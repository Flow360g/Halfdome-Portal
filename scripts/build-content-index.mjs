// Builds the text Ask the hub answers from, and the extra words search uses.
// Reads the table of contents (src/content/hub.ts) and every MDX page, turns
// the components into plain text, and writes:
//   supabase/functions/ask-hub/content.json  for the Supabase function
//   src/generated/hub-content.json           for the single-file preview
//   src/generated/search-text.json           page text for dashboard search
// Runs before `dev` and `build`. Node 22 loads the .ts files directly.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const { topics } = await import('../src/content/hub.ts');
const { sources } = await import('../src/content/sources.ts');
const { journey } = await import('../src/content/journey.ts');
const { publicHolidaysVic } = await import('../src/content/public-holidays-vic.ts');
const { askHubInstructions } = await import('../src/content/ask-hub-instructions.ts');

const attrs = (raw) => Object.fromEntries([...raw.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

const journeyText = journey
  .map((stage) => `${stage.title} (${stage.when}):\n${stage.steps.map((s) => `- ${s.title}: ${s.detail}`).join('\n')}`)
  .join('\n\n');

/** Turns an MDX page body into readable plain text. */
function mdxToText(body) {
  return body
    .replace(/<(\w+)([^>]*?)\/>/g, (_, tag, raw) => {
      const a = attrs(raw);
      switch (tag) {
        case 'KeyNumber':
          return `\n- ${a.label}: ${a.value}${a.note ? ` (${a.note})` : ''}`;
        case 'DocumentLink':
          return '';
        case 'LeavePlanner':
          return '\n[This page has a leave planner that counts working days and the date to get leave approved by.]\n';
        case 'NextPublicHoliday':
          return '\n[This page shows a countdown to the next Victorian public holiday.]\n';
        case 'WholePotentialDays':
          return '\n[This page has a tracker for this trimester’s two Whole Potential Days.]\n';
        case 'JourneyChecklist':
          return `\nThe new starter checklist:\n${journeyText}\n`;
        default:
          return '';
      }
    })
    .replace(/<(\w+)([^>]*)>/g, (_, tag, raw) => {
      const a = attrs(raw);
      switch (tag) {
        case 'ShortVersion':
          return `${a.title ?? 'The short version'}:`;
        case 'AtAGlance':
          return 'At a glance:';
        case 'Callout':
          return a.title ? `Note (${a.title}):` : 'Note:';
        case 'Step':
          return `Step: ${a.title}.`;
        case 'Question':
          return `Q: ${a.q}`;
        case 'PolicySection':
          return `### ${a.title}`;
        case 'Value':
          return `### ${a.statement}`;
        case 'TimelineItem':
          return `- ${a.when}: ${a.title}.`;
        case 'Quote':
          return a.by ? `Quote from ${a.by}:` : 'Quote:';
        default:
          return '';
      }
    })
    .replace(/<\/\w+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const written = [];
const unwritten = [];
const searchText = {};

for (const topic of topics) {
  for (const page of topic.pages) {
    const path = `${topic.slug}/${page.slug}`;
    const file = `src/content/pages/${path}.mdx`;
    const sourceKey = page.source;
    if (existsSync(file)) {
      const raw = readFileSync(file, 'utf8');
      const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
      const front = fm ? fm[1] : '';
      const summary = front.match(/^summary:\s*(.+)$/m)?.[1] ?? '';
      const fmSource = front.match(/^source:\s*(\w+)$/m)?.[1];
      const source = sources[fmSource ?? sourceKey];
      const text = mdxToText(fm ? raw.slice(fm[0].length) : raw);
      written.push(
        [
          `## ${page.title}`,
          `Path: [[${path}]]`,
          `Topic: ${topic.title}`,
          source ? `Original document: ${source.label}, reviewed ${source.reviewed}` : null,
          `Summary: ${summary}`,
          '',
          text,
        ]
          .filter((line) => line !== null)
          .join('\n'),
      );
      searchText[path] = `${summary} ${text}`
        .replace(/\[\[[^\]]+\]\]|[#*_[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .slice(0, 4000);
    } else {
      const source = sourceKey ? sources[sourceKey] : undefined;
      unwritten.push(
        `- ${topic.title} > ${page.title} [[${path}]] (not written yet${source ? `; original document: ${source.label}` : ''})`,
      );
    }
  }
}

const holidays = [
  '## Victorian public holidays',
  'Path: [[leave-and-flexibility/public-holidays]]',
  'Topic: Leave and flexibility',
  '',
  ...publicHolidaysVic.map((h) => `- ${h.date}: ${h.name}${h.tbc ? ' (date to be confirmed)' : ''}`),
].join('\n');

const content = [
  '# Pages with content',
  ...written,
  holidays,
  '# Pages in the hub that are not written yet',
  unwritten.join('\n'),
].join('\n\n');

const payload = { instructions: askHubInstructions, content };

for (const out of ['supabase/functions/ask-hub/content.json', 'src/generated/hub-content.json']) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(payload, null, 2) + '\n');
}
writeFileSync('src/generated/search-text.json', JSON.stringify(searchText, null, 2) + '\n');

console.log(`Content index: ${written.length} written pages, ${unwritten.length} to come, ${(content.length / 1024).toFixed(0)} KB`);
