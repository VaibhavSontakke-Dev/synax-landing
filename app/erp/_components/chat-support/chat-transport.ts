/**
 * The chat's "backend", behind one small interface so the real thing can replace the dummy without touching the widget.
 *
 * TODAY: `createDummyTransport` answers from canned, translated texts (messages "Chat.reply.*") after a short, fake typing delay.
 * It matches a few keywords (messages "Chat.keywords.*") and otherwise asks for an email address. NOTHING is sent anywhere, and no
 * address is stored: the visitor's email only appears in the on-screen "thanks" line.
 *
 * LATER: write a transport that calls the support API (and, for `sendEmail`, the lead webhook the demo form already uses in
 * `app/api/demo-request/route.ts`), return its answers as `AgentReply[]`, and pass it to `<ChatWidget transport={...} />`.
 */

/** A button under an agent message that does something on the site. */
export type ChatAction = "demo" | "products" | "security";

/** One message from the support side. `form: "email"` means "show the email box under this message". */
export interface AgentReply {
  text: string;
  action?: ChatAction;
  form?: "email";
}

/** The quick-reply chips; `person` and the others double as the intents the dummy can answer. */
export type ChatIntent = "demo" | "products" | "pricing" | "person" | "tally" | "gst" | "machines" | "hr" | "security";

export interface ChatTransport {
  /** Sends what the visitor typed (or the intent of the chip they clicked). Resolves with the replies to show. */
  send(text: string, intent?: ChatIntent): Promise<AgentReply[]>;
  /** Sends the address the visitor left so a person can follow up. */
  sendEmail(email: string): Promise<AgentReply[]>;
}

/** Translator for the "Chat" messages. */
export type ChatTranslator = (key: string, values?: Record<string, string | number>) => string;

/** Order matters: the first intent whose keywords appear in the text wins (hr before gst, so German "Lohnabrechnung" is payroll, not an invoice). */
const INTENT_ORDER: ChatIntent[] = ["demo", "person", "pricing", "tally", "hr", "gst", "machines", "security", "products"];

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** A fake "the agent is typing" delay: longer for longer answers, never more than ~2 s. */
const typingDelay = (text: string) => Math.min(2000, 650 + text.length * 7);

export function createDummyTransport(t: ChatTranslator): ChatTransport {
  /** Words of at most 3 letters (hr, ai, ki) must match a whole word, longer ones may match inside a word ("payroll" in "payrolls"). */
  const matches = (text: string, keyword: string) => {
    const k = keyword.trim().toLowerCase();
    if (!k) return false;
    if (k.length > 3) return text.includes(k);
    return text.split(/[^\p{L}\p{N}-]+/u).includes(k);
  };

  const detect = (text: string): ChatIntent | null => {
    const lower = text.toLowerCase();
    for (const intent of INTENT_ORDER) {
      if (t(`keywords.${intent}`).split(",").some((k) => matches(lower, k))) return intent;
    }
    return null;
  };

  const answer = (intent: ChatIntent | null): AgentReply => {
    switch (intent) {
      case "demo":
        return { text: t("reply.demo"), action: "demo" };
      case "products":
        return { text: t("reply.products"), action: "products" };
      case "security":
        return { text: t("reply.security"), action: "security" };
      case "person":
        return { text: t("reply.person"), form: "email" };
      case "pricing":
      case "tally":
      case "gst":
      case "machines":
      case "hr":
        return { text: t(`reply.${intent}`) };
      default:
        return { text: t("reply.fallback"), form: "email" };
    }
  };

  return {
    async send(text, intent) {
      const reply = answer(intent ?? detect(text));
      await wait(typingDelay(reply.text));
      return [reply];
    },
    async sendEmail(email) {
      await wait(700);
      return [{ text: t("email.thanks", { email }) }];
    },
  };
}
