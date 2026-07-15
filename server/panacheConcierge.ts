import { z } from "zod";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-luna";
const REQUEST_TIMEOUT_MS = 15_000;

export const MAX_MESSAGE_LENGTH = 500;
export const MAX_CONVERSATION_MESSAGES = 8;
export const MAX_CONVERSATION_CHARACTERS = 2_500;

export type ConciergeMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ConciergeReply = {
  reply: string;
  mode: "ai" | "fallback";
  notice?: string;
};

const conciergeMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
});

export const conciergeInputSchema = z
  .object({
    messages: z
      .array(conciergeMessageSchema)
      .min(1)
      .max(MAX_CONVERSATION_MESSAGES),
  })
  .superRefine(({ messages }, context) => {
    const totalCharacters = messages.reduce(
      (total, message) => total + message.content.length,
      0
    );
    if (totalCharacters > MAX_CONVERSATION_CHARACTERS) {
      context.addIssue({
        code: "custom",
        path: ["messages"],
        message: "Conversation is too long. Please start a new question.",
      });
    }

    if (messages.at(-1)?.role !== "user") {
      context.addIssue({
        code: "custom",
        path: ["messages"],
        message: "The final message must be from the visitor.",
      });
    }

    for (let index = 1; index < messages.length; index += 1) {
      if (messages[index].role === messages[index - 1].role) {
        context.addIssue({
          code: "custom",
          path: ["messages", index, "role"],
          message: "Conversation roles must alternate.",
        });
        break;
      }
    }
  });

const KNOWLEDGE = `
PANACHE LASHES LLC is a private, appointment-only lash studio at 901 Tower Drive,
Suite 420, Troy, Michigan 48098. The studio is on Floor 4 and is accessible by
elevator from the main lobby. Phone: (248) 494-8594. Email:
info@panachelashes.com. Instagram: @panachelashes.

Current services:
- The Refined Edit — $115, 120 minutes. Fine classic lashes for soft, natural,
  weightless definition.
- The Panache Full Set — $175, 135 minutes. Classic, hybrid, or volume coverage
  customized to the client's eye shape with a clean, uniform finish.
- The Bespoke Set — $225, 180 minutes. A highly customized, textured, wispy set
  with layered dimension and movement.
- The Fill — $85, 90 minutes. For returning clients approximately every two to
  three weeks, before more than 50% of extensions have shed.
- The Express Fill — $55, 45 minutes. A brief touch-up for a set that is still
  mostly full.
- The Consultation — complimentary, 20 minutes.
- Patch Test — $40, 40 minutes.
- Lash Extension Removal — $25, 15 minutes.

Preparation: arrive with clean lashes and no eye makeup; avoid caffeine if it
causes restlessness; remove contact lenses; bring inspiration photos if helpful;
and plan for the full appointment duration.

Aftercare: cleanse regularly with an extension-safe cleanser, brush gently with
a clean spoolie, avoid pulling/rubbing/picking, use oil-free products around the
eyes, and schedule fills before excessive shedding.

Policies: a 25% deposit is collected at booking and applied to the service total.
Provide at least 24 hours' notice to cancel or reschedule. Cancellations and
no-shows within 24 hours are subject to a 50% service fee, and deposits are
non-refundable. Arrivals more than 10 minutes late may need to reschedule.
Appointments are private; children and guests should not attend unless arranged
with the studio in advance. Contact lenses should be removed. Clients with eye
sensitivities, allergies, a previous adhesive reaction, or an active eye concern
should contact the studio; a patch test may be recommended but cannot guarantee
that a future reaction will not occur.
`.trim();

export const CONCIERGE_INSTRUCTIONS = `
You are Panache Concierge, the calm and polished website assistant for Panache
Lashes. Answer only from the approved business information below. Be warm,
concise, unhurried, and practical. Prefer two or three short paragraphs or a
brief list. Never invent prices, availability, policies, medical advice, or
business details.

You may help a guest compare services, prepare for an appointment, understand
fill eligibility, aftercare and policies, find the studio, or reach Square
booking. When a question depends on the guest's health, eye condition, current
lashes, or a policy exception, explain that the studio must advise them directly.
Never diagnose, recommend medical treatment, or promise that a service or
adhesive is safe for a specific person.

You cannot view or promise Square availability; create, confirm, change, or
cancel appointments; accept payments; or override written Panache policies.
Tell guests to use the Book with Square button for availability and booking. For
changes, cancellations, unusual requests, or anything not covered by the
approved information, direct them to (248) 494-8594 or
info@panachelashes.com. Do not ask for payment information, health records, or
other sensitive personal information.

Approved business information:
${KNOWLEDGE}
`.trim();

export class ConciergeConfigurationError extends Error {
  constructor() {
    super("Panache Concierge is not configured");
    this.name = "ConciergeConfigurationError";
  }
}

export class ConciergeTimeoutError extends Error {
  constructor() {
    super("Panache Concierge request timed out");
    this.name = "ConciergeTimeoutError";
  }
}

export class ConciergeUpstreamError extends Error {
  constructor() {
    super("Panache Concierge service is unavailable");
    this.name = "ConciergeUpstreamError";
  }
}

export class ConciergeRateLimitError extends Error {
  constructor() {
    super("Please wait a few minutes before asking another question.");
    this.name = "ConciergeRateLimitError";
  }
}

export class SlidingWindowRateLimiter {
  private readonly requests = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number
  ) {}

  check(key: string, now = Date.now()) {
    for (const [storedKey, timestamps] of Array.from(this.requests.entries())) {
      const active = timestamps.filter(
        timestamp => now - timestamp < this.windowMs
      );
      if (active.length === 0) this.requests.delete(storedKey);
      else if (active.length !== timestamps.length)
        this.requests.set(storedKey, active);
    }

    const recent = this.requests.get(key) ?? [];
    if (recent.length >= this.limit) throw new ConciergeRateLimitError();
    this.requests.set(key, [...recent, now]);
  }
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function extractResponseText(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const response = payload as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ type?: unknown; text?: unknown }> }>;
  };

  const direct = normalizeText(response.output_text);
  if (direct) return direct;

  const parts = response.output
    ?.flatMap(item => item.content ?? [])
    .filter(part => part.type === "output_text")
    .map(part => normalizeText(part.text))
    .filter((part): part is string => Boolean(part));

  return parts?.length ? parts.join("\n") : null;
}

type AskOptions = {
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
  fetcher?: typeof fetch;
};

export async function askPanacheConcierge(
  messages: ConciergeMessage[],
  options: AskOptions = {}
): Promise<string> {
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY ?? "";
  if (!apiKey) throw new ConciergeConfigurationError();

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? REQUEST_TIMEOUT_MS
  );

  try {
    const response = await (options.fetcher ?? fetch)(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model ?? process.env.OPENAI_CHAT_MODEL ?? DEFAULT_MODEL,
        instructions: CONCIERGE_INSTRUCTIONS,
        input: messages.map(message => ({
          role: message.role,
          content: message.content,
        })),
        max_output_tokens: 350,
        store: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) throw new ConciergeUpstreamError();

    const text = extractResponseText(await response.json());
    if (!text) throw new ConciergeUpstreamError();
    return text;
  } catch (error) {
    if (controller.signal.aborted) throw new ConciergeTimeoutError();
    if (
      error instanceof ConciergeUpstreamError ||
      error instanceof ConciergeConfigurationError
    ) {
      throw error;
    }
    throw new ConciergeUpstreamError();
  } finally {
    clearTimeout(timeout);
  }
}

const DIRECT_CONTACT =
  "For help specific to your appointment, please call (248) 494-8594 or email info@panachelashes.com.";

export function getFallbackResponse(question: string): string {
  const normalized = question.toLowerCase();

  if (
    /medical|allerg|reaction|infection|swollen|sensitive|pain|doctor|safe/.test(
      normalized
    )
  ) {
    return `I can’t diagnose an eye concern or recommend medical treatment. A patch test may be recommended for sensitivities or a previous adhesive reaction, but it cannot guarantee a future reaction will not occur. ${DIRECT_CONTACT}`;
  }
  if (
    /where|address|location|parking|elevator|suite|floor|direction/.test(
      normalized
    )
  ) {
    return "Panache Lashes is at 901 Tower Drive, Suite 420, Troy, MI 48098. The studio is on Floor 4 and is accessible by elevator from the main lobby. Use the Contact page for arrival and direction details.";
  }
  if (
    /prepare|before|makeup|caffeine|contact lens|inspiration/.test(normalized)
  ) {
    return "Before your visit, arrive with clean lashes and no eye makeup, remove contact lenses, avoid caffeine if it causes restlessness, bring inspiration photos if helpful, and plan for the full appointment duration.";
  }
  if (/aftercare|clean|wash|retention|pick|rub|oil/.test(normalized)) {
    return "Protect your set by cleansing with an extension-safe cleanser, brushing gently with a clean spoolie, avoiding pulling, rubbing, or picking, using oil-free products around the eyes, and scheduling fills before excessive shedding.";
  }
  if (/fill|touch.?up|shed|returning/.test(normalized)) {
    return "The Fill is $85 for 90 minutes and is intended for returning guests about every two to three weeks, before more than 50% has shed. The Express Fill is $55 for 45 minutes when the set is still mostly full. If you are unsure whether your current set qualifies, contact the studio directly.";
  }
  if (/cancel|reschedul|late|deposit|policy|guest|child/.test(normalized)) {
    return "A 25% deposit is applied to your service total. Please provide at least 24 hours’ notice to cancel or reschedule. Late cancellations and no-shows are subject to a 50% service fee, deposits are non-refundable, and arrivals over 10 minutes late may need to reschedule. Appointments are private unless a guest accommodation is arranged in advance.";
  }
  if (/book|appointment|availability|square|reserve|payment/.test(normalized)) {
    return "Use the Book with Square button to view current availability and reserve an appointment. I cannot confirm availability, change appointments, or accept payments. For changes to an existing appointment, contact Panache directly.";
  }
  if (
    /refined|panache full|bespoke|choose|which set|service|price|cost/.test(
      normalized
    )
  ) {
    return "For soft, natural definition, choose The Refined Edit ($115). For clean classic, hybrid, or volume coverage, choose The Panache Full Set ($175). For a textured, wispy, highly customized look, choose The Bespoke Set ($225). A 20-minute consultation is complimentary if you are still unsure.";
  }
  if (/contact|phone|email|instagram/.test(normalized)) {
    return "Call Panache at (248) 494-8594, email info@panachelashes.com, or visit @panachelashes on Instagram.";
  }

  return `I can help with lash services, pricing, preparation, fills, aftercare, policies, studio information, and Square booking directions. ${DIRECT_CONTACT}`;
}

export async function createConciergeReply(
  messages: ConciergeMessage[],
  options: AskOptions = {}
): Promise<ConciergeReply> {
  try {
    return {
      reply: await askPanacheConcierge(messages, options),
      mode: "ai",
    };
  } catch (error) {
    const isConfiguration = error instanceof ConciergeConfigurationError;
    const isTimeout = error instanceof ConciergeTimeoutError;
    return {
      reply: getFallbackResponse(messages.at(-1)?.content ?? ""),
      mode: "fallback",
      notice: isConfiguration
        ? "AI assistance is not configured yet, so you’re viewing verified Panache guidance."
        : isTimeout
          ? "AI assistance took too long to respond, so you’re viewing verified Panache guidance."
          : "AI assistance is temporarily unavailable, so you’re viewing verified Panache guidance.",
    };
  }
}
