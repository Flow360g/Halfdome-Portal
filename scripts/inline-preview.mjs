// Folds the `vite build --mode artifact` output into one self-contained page
// (dist-artifact/people-hub.html by default) for sharing a preview as a single file.
// Assets are already inlined as data URIs by the artifact build mode.
// PREVIEW_FILE, PREVIEW_TITLE and PREVIEW_DESCRIPTION override the defaults, and
// VITE_PREVIEW_ROUTE (read at build time) picks the page the preview opens on.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'dist-artifact';
const html = readFileSync(join(dir, 'index.html'), 'utf8');

const read = (href) => readFileSync(join(dir, href.replace(/^\//, '')), 'utf8');

const css = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map((m) => read(m[1])).join('\n');
const js = [...html.matchAll(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g)]
  .map((m) => read(m[1]))
  .join('\n')
  .replace(/<\/script/gi, '<\\/script');
const title = process.env.PREVIEW_TITLE ?? 'Half Dome People Hub';
const description =
  process.env.PREVIEW_DESCRIPTION ?? "Half Dome's people hub: policies, pay, leave, learning and how we work, in one place.";
const file = process.env.PREVIEW_FILE ?? 'people-hub.html';

const page = `<title>${title}</title>
<meta name="description" content="${description}">
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;

writeFileSync(join(dir, file), page);
console.log(`Wrote ${join(dir, file)} (${(page.length / 1024).toFixed(0)} KB)`);
