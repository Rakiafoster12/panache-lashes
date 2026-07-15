import { describe, expect, it, vi } from "vitest";
import {
  CONCIERGE_INSTRUCTIONS,
  ConciergeTimeoutError,
  SlidingWindowRateLimiter,
  askPanacheConcierge,
  conciergeInputSchema,
  createConciergeReply,
  extractResponseText,
} from "./panacheConcierge";

const question = [{ role: "user" as const, content: "Which set is natural?" }];

describe("Panache Concierge response handling", () => {
  it("returns a successful OpenAI response", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            output: [
              {
                content: [
                  {
                    type: "output_text",
                    text: "The Refined Edit offers soft, natural definition.",
                  },
                ],
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
    );

    await expect(
      createConciergeReply(question, { apiKey: "test-key", fetcher })
    ).resolves.toEqual({
      reply: "The Refined Edit offers soft, natural definition.",
      mode: "ai",
    });

    const request = fetcher.mock.calls[0][1];
    expect(request?.headers).toMatchObject({
      Authorization: "Bearer test-key",
    });
    expect(request?.body).not.toContain("test-key");
  });

  it("extracts direct and nested Responses API text", () => {
    expect(extractResponseText({ output_text: "Welcome to Panache." })).toBe(
      "Welcome to Panache."
    );
    expect(
      extractResponseText({
        output: [
          {
            content: [
              { type: "output_text", text: "The Refined Edit is $115." },
            ],
          },
        ],
      })
    ).toBe("The Refined Edit is $115.");
  });

  it("uses verified fallback guidance when the API key is missing", async () => {
    await expect(
      createConciergeReply(
        [{ role: "user", content: "How should I prepare?" }],
        { apiKey: "" }
      )
    ).resolves.toMatchObject({
      mode: "fallback",
      notice: expect.stringContaining("not configured"),
      reply: expect.stringContaining("clean lashes"),
    });
  });

  it("uses verified fallback guidance after an upstream server error", async () => {
    const fetcher = vi.fn(
      async () => new Response("Unavailable", { status: 503 })
    );
    await expect(
      createConciergeReply(
        [{ role: "user", content: "Where is the studio?" }],
        { apiKey: "test-key", fetcher }
      )
    ).resolves.toMatchObject({
      mode: "fallback",
      notice: expect.stringContaining("temporarily unavailable"),
      reply: expect.stringContaining("901 Tower Drive"),
    });
  });

  it("aborts timed-out requests and returns timeout fallback guidance", async () => {
    const fetcher = vi.fn(
      (_input: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        })
    );

    await expect(
      askPanacheConcierge(question, {
        apiKey: "test-key",
        fetcher,
        timeoutMs: 5,
      })
    ).rejects.toBeInstanceOf(ConciergeTimeoutError);

    await expect(
      createConciergeReply(question, {
        apiKey: "test-key",
        fetcher,
        timeoutMs: 5,
      })
    ).resolves.toMatchObject({
      mode: "fallback",
      notice: expect.stringContaining("too long"),
    });
  });
});

describe("Panache Concierge request safeguards", () => {
  it("rejects invalid messages and excessive conversations", () => {
    expect(
      conciergeInputSchema.safeParse({
        messages: [{ role: "user", content: "x".repeat(501) }],
      }).success
    ).toBe(false);

    expect(
      conciergeInputSchema.safeParse({
        messages: [{ role: "assistant", content: "Not a visitor request" }],
      }).success
    ).toBe(false);

    expect(
      conciergeInputSchema.safeParse({
        messages: [
          { role: "user", content: "First" },
          { role: "user", content: "Second" },
        ],
      }).success
    ).toBe(false);

    expect(
      conciergeInputSchema.safeParse({
        messages: Array.from({ length: 9 }, (_, index) => ({
          role: index % 2 === 0 ? "user" : "assistant",
          content: "A valid-length message",
        })),
      }).success
    ).toBe(false);
  });

  it("enforces the sliding-window rate limit and resets after the window", () => {
    const limiter = new SlidingWindowRateLimiter(2, 1_000);
    limiter.check("visitor", 0);
    limiter.check("visitor", 500);
    expect(() => limiter.check("visitor", 750)).toThrow(
      "Please wait a few minutes"
    );
    expect(() => limiter.check("visitor", 1_501)).not.toThrow();
  });

  it("keeps scope, booking, policy, and medical boundaries in instructions", () => {
    expect(CONCIERGE_INSTRUCTIONS).toContain(
      "cannot view or promise Square availability"
    );
    expect(CONCIERGE_INSTRUCTIONS).toContain("Never diagnose");
    expect(CONCIERGE_INSTRUCTIONS).toContain("accept payments");
    expect(CONCIERGE_INSTRUCTIONS).toContain(
      "override written Panache policies"
    );
    expect(CONCIERGE_INSTRUCTIONS).toContain("The Refined Edit — $115");
  });
});
