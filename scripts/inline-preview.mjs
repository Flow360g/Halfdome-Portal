// Folds the `--mode artifact` build into one HTML body (styles and the app script inline)
// so it can be published as a single Artifact preview.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'dist-artifact';
const html = readFileSync(join(dir, 'index.html'), 'utf8');
const read = (href) => readFileSync(join(dir, href.replace(/^\.\//, '')), 'utf8');

const styles = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map((m) => read(m[1]));
const scripts = [...html.matchAll(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g)].map((m) => read(m[1]));
const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? 'Half Dome portal';
const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';

const body = [
  `<title>${process.env.PREVIEW_TITLE ?? title}</title>`,
  `<meta name="description" content="${description}">`,
  ...styles.map((css) => `<style>${css}</style>`),
  '<div id="root"></div>',
  // `</script` inside the bundle would end the tag early.
  ...scripts.map((js) => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`),
].join('\n');

const out = join(dir, process.env.PREVIEW_FILE ?? 'portal-preview.html');
writeFileSync(out, body);
console.log(`Wrote ${out} (${(body.length / 1024).toFixed(0)} KB)`);
