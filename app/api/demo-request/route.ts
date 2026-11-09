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

function clean(value: unknown, field: Field): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_LEN[field]) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
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
