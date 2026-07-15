import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from "@shared/const";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  type DehydratedState,
} from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot, hydrateRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { startLogin } from "./const";
import "./index.css";

declare global {
  interface Window {
    __TANSTACK_QUERY_STATE__?: unknown;
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (error.message === UNAUTHED_ERR_MSG) startLogin();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.query.state.error);
    console.error("[API Query Error]", event.query.state.error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.mutation.state.error);
    console.error("[API Mutation Error]", event.mutation.state.error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers() {
        try {
          const raw = sessionStorage.getItem("manus-cookie");
          const prefix = `${COOKIE_NAME}=`;
          const pair = raw?.split(";").find(value => value.trim().startsWith(prefix));
          const token = pair?.trim().slice(prefix.length);
          return token ? { Authorization: `Bearer ${token}` } : {};
        } catch {
          return {};
        }
      },
      fetch(input, init) {
        return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" });
      },
    }),
  ],
});

const root = document.getElementById("root")!;
const state = window.__TANSTACK_QUERY_STATE__ as DehydratedState | undefined;
delete window.__TANSTACK_QUERY_STATE__;

const application = (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={state}>
        <App />
      </HydrationBoundary>
    </QueryClientProvider>
  </trpc.Provider>
);

if (root.hasChildNodes()) hydrateRoot(root, application);
else createRoot(root).render(application);
