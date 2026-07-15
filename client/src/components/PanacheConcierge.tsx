import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { BOOKING_URL } from "@shared/site";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Welcome to Panache. I can help you choose a lash set, prepare for your visit, review aftercare, or find booking information.",
};

const SUGGESTIONS = [
  "Help me choose a set",
  "How should I prepare?",
  "What are the fill options?",
  "Where is the studio?",
];

export default function PanacheConcierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const chat = trpc.concierge.chat.useMutation({
    onSuccess: ({ reply, notice: responseNotice }) => {
      setMessages(current => [
        ...current,
        { role: "assistant", content: reply },
      ]);
      setNotice(responseNotice ?? null);
      setError(null);
    },
    onError: apiError => {
      setMessages(current => [
        ...current,
        {
          role: "assistant",
          content:
            "I’m unable to answer right now. Please call (248) 494-8594 or email info@panachelashes.com, and the studio will be happy to help.",
        },
      ]);
      setNotice(null);
      setError(
        apiError.data?.code === "TOO_MANY_REQUESTS"
          ? "You’ve reached the temporary message limit. Please wait a few minutes or contact the studio directly."
          : "Panache Concierge could not complete that request. Direct contact options remain available below."
      );
    },
  });

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chat.isPending, open]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function send(content: string) {
    const text = content.trim();
    if (!text || chat.isPending) return;
    setError(null);
    setNotice(null);
    const nextMessages = [
      ...messages,
      { role: "user" as const, content: text },
    ];
    setMessages(nextMessages);
    setInput("");
    chat.mutate({ messages: nextMessages.slice(-8) });
  }

  return (
    <aside
      className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[70] sm:bottom-6 sm:right-6"
      aria-label="Panache Concierge"
    >
      {open && (
        <section
          id="panache-concierge-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="concierge-title"
          aria-describedby="concierge-description"
          className="pointer-events-auto mb-3 flex h-[min(38rem,calc(100dvh-10rem))] min-h-[24rem] w-[calc(100vw-2rem)] max-w-[24rem] flex-col overflow-hidden shadow-2xl sm:w-[24rem]"
          style={{
            background: "var(--ivory)",
            border: "1px solid var(--border)",
            boxShadow: "0 24px 70px oklch(0.14 0.01 300 / 0.22)",
          }}
        >
          <header
            className="flex items-center justify-between gap-4 px-5 py-4"
            style={{ background: "oklch(0.14 0.01 300)", color: "white" }}
          >
            <div className="flex items-center gap-3">
              <Sparkles
                aria-hidden="true"
                className="h-5 w-5"
                style={{ color: "var(--rose-gold-muted)" }}
              />
              <div>
                <h2
                  id="concierge-title"
                  className="text-lg leading-tight"
                  style={{ color: "white" }}
                >
                  Panache Concierge
                </h2>
                <p
                  id="concierge-description"
                  className="text-xs"
                  style={{
                    color: "oklch(0.76 0.012 60)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Lash guidance · Booking help
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close Panache Concierge"
              className="rounded-full p-2 transition-colors hover:bg-white/10"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </header>

          <div
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
            aria-label="Conversation"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <p
                  className="max-w-[88%] whitespace-pre-wrap px-4 py-3 text-[0.96rem] leading-relaxed"
                  style={
                    message.role === "user"
                      ? {
                          background: "var(--rose-gold)",
                          color: "white",
                          borderRadius: "1rem 1rem 0.2rem 1rem",
                        }
                      : {
                          background: "oklch(0.985 0.010 80)",
                          color: "var(--charcoal)",
                          border: "1px solid var(--border)",
                          borderRadius: "1rem 1rem 1rem 0.2rem",
                        }
                  }
                >
                  {message.content}
                </p>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="grid gap-2">
                {SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="px-4 py-2.5 text-left text-sm transition-colors hover:bg-white"
                    style={{
                      border: "1px solid var(--border)",
                      color: "var(--charcoal)",
                      fontFamily: "var(--font-label)",
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {chat.isPending && (
              <div
                className="flex justify-start"
                role="status"
                aria-live="polite"
              >
                <p
                  className="px-4 py-3 text-sm"
                  style={{
                    color: "var(--warm-gray)",
                    background: "oklch(0.985 0.010 80)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 animate-pulse rounded-full"
                      style={{ background: "var(--rose-gold)" }}
                    />
                    Preparing a thoughtful answer…
                  </span>
                </p>
              </div>
            )}
            {notice && (
              <p
                role="status"
                className="px-3 py-2 text-xs leading-relaxed"
                style={{
                  background: "oklch(0.94 0.025 75)",
                  borderLeft: "3px solid var(--rose-gold)",
                  color: "var(--warm-gray)",
                }}
              >
                {notice}
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="px-3 py-2 text-xs leading-relaxed"
                style={{
                  background: "oklch(0.95 0.035 25)",
                  borderLeft: "3px solid oklch(0.55 0.16 25)",
                  color: "var(--charcoal)",
                }}
              >
                {error}
              </p>
            )}
            <div ref={endRef} />
          </div>

          <div
            className="border-t px-4 py-3"
            style={{
              borderColor: "var(--border)",
              background: "oklch(0.985 0.010 80)",
            }}
          >
            <div className="mb-3 flex gap-2">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-3 py-2 text-center text-sm"
                style={{
                  background: "var(--rose-gold)",
                  color: "white",
                  fontFamily: "var(--font-label)",
                }}
              >
                Book with Square
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-center text-sm"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--charcoal)",
                  fontFamily: "var(--font-label)",
                }}
              >
                Contact
              </Link>
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={event => {
                event.preventDefault();
                send(input);
              }}
            >
              <label htmlFor="concierge-message" className="sr-only">
                Ask Panache Concierge
              </label>
              <input
                ref={inputRef}
                id="concierge-message"
                value={input}
                onChange={event => setInput(event.target.value.slice(0, 500))}
                disabled={chat.isPending}
                placeholder="Ask about services or your visit…"
                autoComplete="off"
                className="min-w-0 flex-1 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--charcoal)",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || chat.isPending}
                aria-label="Send message"
                className="p-3 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: "var(--charcoal)", color: "white" }}
              >
                <Send aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>
            <p
              className="mt-2 text-[0.68rem] leading-snug"
              style={{ color: "var(--warm-gray)" }}
            >
              AI-generated guidance may be imperfect. Don’t share payment or
              sensitive health information. See our{" "}
              <Link
                href="/privacy"
                onClick={() => setOpen(false)}
                className="underline"
              >
                privacy notice
              </Link>
              .
            </p>
          </div>
        </section>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(current => !current)}
        aria-expanded={open}
        aria-controls="panache-concierge-panel"
        aria-haspopup="dialog"
        aria-label={open ? "Close Panache Concierge" : "Open Panache Concierge"}
        className="pointer-events-auto ml-auto flex items-center gap-2 rounded-full px-5 py-3.5 shadow-lg transition-transform hover:-translate-y-0.5"
        style={{
          background: "oklch(0.14 0.01 300)",
          color: "white",
          fontFamily: "var(--font-label)",
        }}
      >
        {open ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <MessageCircle aria-hidden="true" className="h-5 w-5" />
        )}
        <span>{open ? "Close" : "Ask Panache"}</span>
      </button>
    </aside>
  );
}
