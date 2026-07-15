import type { Express } from "express";
import express from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

function safeSerialize(value: unknown) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

function composeHtml(
  template: string,
  appHtml: string,
  headTags: string,
  dehydratedState: unknown
) {
  const stateScript = `<script>window.__TANSTACK_QUERY_STATE__=${safeSerialize(dehydratedState)}</script>`;
  return template
    .replace("<!--app-head-->", () => headTags)
    .replace("<!--app-html-->", () => appHtml)
    .replace("<!--app-state-->", () => stateScript);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use((req, res, next) => {
    if (req.path === "/index.html") return res.redirect(301, "/");
    if (req.path !== "/" && /\/+$/g.test(req.path)) {
      const query = req.originalUrl.slice(req.path.length);
      const target = (req.path.replace(/\/+$/g, "") || "/").replace(/^\/{2,}/g, "/");
      return res.redirect(301, target + query);
    }
    next();
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/entry-client.tsx"`,
        `src="/src/entry-client.tsx?v=${nanoid()}"`
      );
      template = await vite.transformIndexHtml(url, template);
      template = template.replace(
        "</head>",
        `<link rel="stylesheet" href="/src/index.css?direct" data-ssr-dev-css></head>`
      );
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const result = await render(url);
      const page = composeHtml(
        template,
        result.html,
        result.headTags,
        result.dehydratedState
      );
      res
        .status(result.notFound ? 404 : 200)
        .set({ "Content-Type": "text/html", "Cache-Control": "no-cache" })
        .end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use((req, res, next) => {
    if (req.path === "/index.html") return res.redirect(301, "/");
    if (req.path !== "/" && /\/+$/g.test(req.path)) {
      const query = req.originalUrl.slice(req.path.length);
      const target = (req.path.replace(/\/+$/g, "") || "/").replace(/^\/{2,}/g, "/");
      return res.redirect(301, target + query);
    }
    next();
  });

  app.use(express.static(distPath, { index: false, redirect: false }));
  const templatePath = path.resolve(distPath, "index.html");
  const serverEntryPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "server-ssr", "entry-server.js")
      : path.resolve(import.meta.dirname, "server-ssr", "entry-server.js");

  app.use("*", async (req, res) => {
    try {
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const { render } = await import(serverEntryPath);
      const result = await render(req.originalUrl);
      res
        .status(result.notFound ? 404 : 200)
        .set({ "Content-Type": "text/html", "Cache-Control": "no-cache" })
        .end(composeHtml(template, result.html, result.headTags, result.dehydratedState));
    } catch (error) {
      console.error("[SSR] render failed:", error);
      res.status(500).type("text").send("Unable to render this page.");
    }
  });
}
