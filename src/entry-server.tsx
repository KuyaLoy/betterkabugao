import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
// React Router 7 exports StaticRouter from the package root; the old
// "react-router-dom/server" subpath no longer exists.
import { StaticRouter } from "react-router-dom";
import { App } from "./App";
import { metaFor } from "./lib/seo";

/** Renders one route to static HTML plus the metadata for its <head>. */
export function render(path: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, meta: metaFor(path) };
}
