/**
 * Demo / consultation request intake.
 *
 * The landing page used to flip a "submitted" flag locally and discard the
 * lead. This route validates the request and forwards it to whatever intake
 * the team points `DEMO_REQUEST_WEBHOOK_URL` at (CRM webhook, Zapier, Slack
 * incoming webhook, Power Automate flow, ...).
 *
 * If the webhook is not configured it answers 503 so the UI shows an honest
 * error instead of claiming a consultation was scheduled.
 *
 * Abuse protection (all of it is cheap and local; put a WAF / bot check in front for real traffic):
 *  - a hidden honeypot field,
 *  - same-origin check on the Origin header,
 *  - a small body-size limit,
 *  - a per-IP rate limit kept in memory (per server instance, so it is best-effort on serverless hosts),
 *  - text cleaned before it is forwarded (control characters, spreadsheet-formula starts, chat mentions).
 * Personal data: the form carries an explicit consent tick, which is required here too.
 */

const MAX_LEN = {
  fullName: 120,
  email: 254,
  company: 160,
  phone: 32,
  product: 120,
  floorSize: 120,
  message: 2000,
} as const;

type Field = keyof typeof MAX_LEN;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Largest request body we accept, in bytes (the biggest valid form is under 3 KB). */
const MAX_BODY_BYTES = 10_000;

/** At most this many submissions per IP in the window. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map small: drop idle entries now and then.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim() || "unknown";
}

/** Same-origin only: a browser form on this site sends an Origin header that matches the Host header. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients; the rate limit and honeypot still apply
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

/** Trim, cap the length, drop control characters, neutralise formula starts and chat mentions. */
function clean(value: unknown, field: Field): string {
  if (typeof value !== "string") return "";
  let out = value
    // eslint-disable-next-line no-control-regex
    .replace(field === "message" ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, MAX_LEN[field]);
  if (field !== "email") {
    out = out.replace(/^[=+\-@\t]+/, "").replace(/[<>]/g, (c) => (c === "<" ? "‹" : "›"));
  }
  return out;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ error: "Invalid request." }, { status: 403 });
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    return Response.json({ error: "Invalid request." }, { status: 413 });
  }

  if (rateLimited(clientIp(request))) {
    return Response.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(RATE_WINDOW_MS / 1000) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return Response.json({ error: "Invalid request." }, { status: 413 });
    }
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see or fill this field. Pretend success.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const lead = {
    fullName: clean(body.fullName, "fullName"),
    email: clean(body.email, "email"),
    company: clean(body.company, "company"),
    phone: clean(body.phone, "phone"),
    product: clean(body.product, "product"),
    floorSize: clean(body.floorSize, "floorSize"),
    message: clean(body.message, "message"),
  };

  if (lead.fullName.length < 2 || lead.company.length < 2) {
    return Response.json(
      { error: "Please enter your name and company." },
      { status: 422 },
    );
  }
  if (!EMAIL_RE.test(lead.email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 422 },
    );
  }
  if (body.consent !== true) {
    return Response.json(
      { error: "Please tick the box to agree to the privacy notice." },
      { status: 422 },
    );
  }

  const webhook = process.env.DEMO_REQUEST_WEBHOOK_URL;
  if (!webhook) {
    console.error("DEMO_REQUEST_WEBHOOK_URL is not set; demo request not delivered.");
    return Response.json(
      { error: "We couldn't submit your request right now. Please try again shortly." },
      { status: 503 },
    );
  }

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        source: "synax-landing",
        consent: true,
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!upstream.ok) throw new Error(`Webhook responded ${upstream.status}`);
  } catch (error) {
    console.error("Demo request delivery failed:", error);
    return Response.json(
      { error: "We couldn't submit your request right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
