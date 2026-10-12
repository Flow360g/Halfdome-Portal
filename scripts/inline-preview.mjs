// Folds the `vite build --mode artifact` output into one self-contained page
// (dist-artifact/people-hub.html) for sharing a preview as a single file.
// Assets are already inlined as data URIs by the artifact build mode.
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
const title = html.match(/<title>[^<]*<\/title>/)?.[0] ?? '<title>People hub</title>';

const page = `${title}
<meta name="description" content="Half Dome's people hub: policies, pay, leave, learning and how we work, in one place.">
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;

writeFileSync(join(dir, 'people-hub.html'), page);
console.log(`Wrote ${join(dir, 'people-hub.html')} (${(page.length / 1024).toFixed(0)} KB)`);
