# Half Dome People Hub

The home for everything people and culture at Half Dome: policies, pay, leave, learning and how we work, in one place.

This first version is the **dashboard**: every topic and the pages inside it, with search, quick links and a path for new starters. Topic and page links open holding pages for now; the content page design comes next.

## Run it

```bash
npm install
npm run dev            # local dev server
npm run build          # typecheck and production build to dist/
npm run build:preview  # one self-contained HTML file at dist-artifact/people-hub.html
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/content/hub.ts` | The table of contents: topics, pages, quick links and popular searches. Edit this to add or rename pages. |
| `src/content/search.ts` | Search ranking (titles first, then keywords, then the topic name). |
| `src/pages/Dashboard.tsx` | The dashboard. |
| `src/pages/TopicPage.tsx` | Holding pages for topics and pages until content is written. |
| `src/components/` | Header, footer, search, quick links, new starter panel and topic cards. |
| `src/components/brand/` | Logo, illustrated icons and the Whole Potential.™ lock-up, switched to the right colourway per theme. |
| `src/styles/tokens.css` | Half Dome design system tokens (colour, type, spacing, radius) as CSS variables. |
| `src/assets/` | Brand fonts, marks, icons and imagery, exported from the Half Dome design system. |

### Adding a page

Add an entry to the right topic in `src/content/hub.ts`:

```ts
{ slug: 'sabbaticals', title: 'Sabbaticals', kind: 'policy', keywords: ['long break', 'career break'] },
```

`kind` is `guide`, `policy`, `form` or `template`. Anything other than a guide gets a label on the dashboard. `keywords` are extra words people might search for.

## Design

Built on the Half Dome design system: Plus Jakarta Sans and Libre Baskerville, the five brand colours at full strength, one accent per theme (sequoia on light, white fir on dark), illustrated brand icons in the matching colourway, one brand image on one shape, and no shadows or gradients. Light and dark themes follow the device setting.
