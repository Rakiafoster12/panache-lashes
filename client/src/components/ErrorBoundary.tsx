import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("PANACHE application error", error, info.componentStack);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        className="min-h-screen flex items-center justify-center px-6 py-16"
        style={{ background: "var(--ivory)" }}
      >
        <section
          role="alert"
          aria-live="assertive"
          className="w-full max-w-2xl text-center px-7 py-12 sm:px-12 sm:py-16"
          style={{ background: "var(--blush-cream)", border: "1px solid var(--border)" }}
        >
          <img
            src="/manus-storage/panache-logo-black-trimmed_b79f88ee.png"
            alt="Panache Lashes"
            width="1508"
            height="438"
            decoding="async"
            className="mx-auto h-auto"
            style={{ width: "min(18rem, 72vw)" }}
          />
          <div className="rule-gold mx-auto my-8" />
          <p className="label-caps mb-4">A Brief Pause</p>
          <h1
            style={{
              color: "var(--charcoal)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 7vw, 3.75rem)",
              fontWeight: 400,
              lineHeight: 1.08,
            }}
          >
            Something went <em style={{ color: "var(--rose-gold)" }}>unexpectedly.</em>
          </h1>
          <p className="lede max-w-lg mx-auto mt-6">
            The page could not finish loading. Refresh to try again, or return home and continue browsing.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-9 py-3.5 cursor-pointer"
              style={{ background: "var(--rose-gold)", border: "1px solid var(--rose-gold)", color: "white", fontFamily: "var(--font-label)", fontSize: "1rem" }}
            >
              Refresh Page
            </button>
            <a
              href="/"
              className="px-9 py-3.5"
              style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--charcoal)", fontFamily: "var(--font-label)", fontSize: "1rem" }}
            >
              Return Home
            </a>
          </div>

          {import.meta.env.DEV && this.state.error && (
            <details className="mt-10 text-left">
              <summary className="cursor-pointer" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-label)" }}>
                Development error details
              </summary>
              <pre className="mt-3 p-4 overflow-auto whitespace-pre-wrap text-xs" style={{ background: "white", color: "var(--charcoal)" }}>
                {this.state.error.stack || this.state.error.message}
              </pre>
            </details>
          )}
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
