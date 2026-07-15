import { trpc } from "@/lib/trpc";
import { dehydrate, HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { renderToString } from "react-dom/server";
import React from "react";
import superjson from "superjson";
import { Router } from "wouter";
import { getRouteSeo, isKnownPublicRoute, normalizePath } from "@shared/site";
import App from "./App";
import { buildHeadTags } from "./ssr/head";

export async function render(url: string) {
  const pathname = normalizePath(url);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: false } },
  });
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://127.0.0.1/api/trpc",
        transformer: superjson,
      }),
    ],
  });
  const state = dehydrate(queryClient);
  const html = renderToString(
    <Router ssrPath={pathname}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={state}>
            <App />
          </HydrationBoundary>
        </QueryClientProvider>
      </trpc.Provider>
    </Router>
  );
  const meta = getRouteSeo(pathname);

  return {
    html,
    dehydratedState: state,
    headTags: buildHeadTags(meta),
    notFound: !isKnownPublicRoute(pathname) || pathname === "/404",
  };
}
