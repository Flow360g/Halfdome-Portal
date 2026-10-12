# Half Dome portal

The internal Half Dome portal: a shared shell with a collapsible side nav, and the pages inside it.

| Page | Route | What it is |
| --- | --- | --- |
| People hub | `/`, `/topics/...` | Policies, pay, leave, learning and how we work |
| Agency calendar | `/calendar` | Every 2026 date and rhythm from the People and Culture agency calendar |

## Run it

```bash
npm install
npm run dev            # local dev server
npm test               # unit tests (date logic)
npm run build          # content index, typecheck and production build to dist/
npm run build:preview  # one self-contained HTML file at dist-artifact/people-hub.html (see below)
```

Copy `.env.example` to `.env.local` to connect Supabase. Without it, feedback stays in the browser and Ask the hub is hidden.

## Deploy on Vercel

`vercel.json` holds the settings: a Vite build with `npm run build` to `dist/`, and a rewrite that sends every route to `index.html` so links like `/calendar` work when opened directly. `package.json` pins Node 22, which the content index script needs.

To set it up once:

1. In Vercel, go to Add New › Project and import `Flow360g/Halfdome-Portal`. Give the Vercel GitHub app access to the repo if it asks.
2. Leave the build settings as they are and click Deploy. Production builds from the default branch, and every other branch gets a preview link.
3. Before sharing the link, turn on Settings › Deployment Protection for production. The portal shows internal policies and pay information, and Ask the hub spends OpenRouter credit.

`.env.production` already holds the Supabase URL and public key, so there are no environment variables to add in Vercel. Feedback from the Vercel site goes to the live `page_feedback` table.

## The portal shell

- `src/shell/AppShell.tsx` lays out the side nav, with a top bar and slide-out drawer below 960px. Press `[` to collapse the nav.
- `src/shell/SideNav.tsx` renders the logo, the pages and the Today card. The wordmark is three slices (`src/assets/shell/logo-*`), so collapsing folds it into the dome.
- `src/shell/navItems.ts` lists the pages. Add a new page there and as a route in `src/App.tsx`.
- `src/styles/shell.css` holds the shell styles. `--shell-bar` is the phone top bar's height; page-level sticky bars sit below it.

To build a preview that opens on a particular page:

```bash
VITE_PREVIEW_ROUTE=/calendar PREVIEW_FILE=agency-calendar.html PREVIEW_TITLE="Half Dome Agency Calendar" npm run build:preview
```

## Agency calendar

- `src/content/agencyCalendar.ts`: every date from *Half Dome - Agency Calender 2026* (People & Culture SharePoint), plus the milestone descriptions. Edit dates here. Public holidays use the official Victorian dates.
- `src/calendar/`: date maths (`dates.ts`), the derived model (`model.ts`) and the components: hero with the next day off, filters and search, coming up, the year strip, month, year and agenda views, the detail drawer and the rhythm guide.
- `src/styles/calendar.css`: calendar styles. Kinds of dates follow the brand chart order (Sequoia, Black Oak, Camas, White Fir, outline), and office-closed days are hatched.

Trimesters follow the agency calendar across the portal: Trimester 1 runs July to October, Trimester 2 November to February and Trimester 3 March to June.

Calendar shortcuts: `/` search, `T` today, `M` / `Y` / `A` switch views, arrow keys change month, `Esc` closes the drawer.

## People hub

The home for everything people and culture at Half Dome: policies, pay, leave, learning and how we work, in one place.

What's here so far:

- **The dashboard:** every topic and page, with search, quick links, What's new and a path for new starters.
- **Content pages** in three templates (guide, policy and story) plus the new starter journey. Six pages are written so far, from the People and Culture documents in SharePoint.
- **Tools inside pages:** a leave planner, a public holiday countdown, a Whole Potential Days tracker and the first 90 days checklist.
- **Trust signals:** each page shows its owner, when it was updated and its source document, and asks "Was this page helpful?".
- **Ask the hub:** questions answered in plain English from hub pages only, with links to the pages used.

Pages without content yet show a holding page that links to the original SharePoint document where there is one.

### Writing a page

1. Make sure the page is listed in `src/content/hub.ts` (topic, title, kind, keywords and its SharePoint `source`).
2. Add `src/content/pages/<topic>/<page>.mdx`:

```mdx
---
summary: One or two sentences people see under the title.
updated: 2026-10-12
source: leavePolicy          # optional, a key from src/content/sources.ts
related:
  - leave-and-flexibility/types-of-leave
template: guide              # optional: guide, policy, story or journey
---

<ShortVersion>

- The three to five facts most people came for.

</ShortVersion>

## A section heading

Plain Markdown, plus any of the blocks below.
```

3. Add a line to `src/content/changelog.ts` so it appears in What's new.
4. Run `npm run build` (it regenerates the Ask the hub content), then redeploy the `ask-hub` function.

Blocks you can use without importing anything:

| Block | Use it for |
| --- | --- |
| `<ShortVersion>`, `<AtAGlance>` | The answer first |
| `<Steps>` with `<Step title="">` | A process in order |
| `<Callout title="" tone="important">` | Something people mustn't miss |
| `<Faq>` with `<Question q="">` | Questions people ask |
| `<KeyNumbers>` with `<KeyNumber value="" label="" note="" emphasis />` | Headline entitlements |
| `<Timeline>` with `<TimelineItem when="" title="">` | Dates in order |
| `<PolicySection title="">` | Full policy wording, closed by default |
| `<Values>` with `<Value name="" statement="">` | Story pages about the values |
| `<Quote by="">`, `<Statement>` | Pull quotes and statements |
| `<WhoToAsk>`, `<DocumentLink source="">` | Contacts and source documents |
| `<LeavePlanner />`, `<NextPublicHoliday />`, `<WholePotentialDays />`, `<JourneyChecklist />` | The interactive tools |

Write in Australian English, sentence case, and don't use em dashes.

### Where things live

| Path | What it is |
| --- | --- |
| `src/content/hub.ts` | The table of contents: topics, pages, quick links and popular searches. |
| `src/content/pages/` | Page content, one MDX file per page. |
| `src/content/sources.ts` | The SharePoint documents pages are written from. |
| `src/content/public-holidays-vic.ts` | Victorian public holidays. Add the next year each spring. |
| `src/content/journey.ts` | The first 90 days checklist. |
| `src/content/changelog.ts` | What's new. |
| `src/templates/` | Guide, policy, story and journey layouts and their shared parts. |
| `src/components/blocks/` | The MDX blocks. |
| `src/components/tools/` | Leave planner, holiday countdown, Whole Potential Days tracker, journey checklist. |
| `src/lib/dates.ts` | Working days, notice periods and trimesters (tested in `dates.test.ts`). |
| `src/styles/tokens.css` | Half Dome design system tokens as CSS variables. |
| `scripts/build-content-index.mjs` | Builds the text Ask the hub answers from, and page text for search. |
| `supabase/functions/ask-hub/` | The Ask the hub function (OpenRouter). |
| `supabase/migrations/` | The `page_feedback` table. |

### Ask the hub and feedback (Supabase)

#### Live setup

The hub uses the **Halfdome-Portal** Supabase project (ref `zvsvusemusdrgesebrsu`, Sydney).

- **Feedback:** the `page_feedback` table. Anyone can add a response; nobody can read, change or delete responses through the public API. People and Culture reads them in the dashboard under Table editor › `page_feedback`.
- **Ask the hub:** the `ask-hub` edge function. Every call needs the project's anon key.
- **Settings:** `.env.production` holds the project URL and the public anon key, so production builds switch on Ask the hub and feedback. The single-file preview ignores it and uses Claude in the viewer.

The function needs two secrets, set in the dashboard under Edge Functions › Secrets:

- `OPENROUTER_API_KEY`: an OpenRouter key. Give it a monthly credit limit while the hub has no sign-in.
- `OPENROUTER_MODEL`: an OpenRouter model slug, such as the latest Claude Sonnet from openrouter.ai/models.
- Optional: `ALLOWED_ORIGINS`, the hub's web address once it has one.

After changing hub pages, run `npm run content`, then redeploy the function with `supabase functions deploy ask-hub`. The function reads its content from `supabase/functions/ask-hub/content.json`.

#### Setting up a new project from scratch

1. Apply `supabase/migrations/*_page_feedback.sql`.
2. Set the secrets above.
3. Deploy the function: `supabase functions deploy ask-hub`.
4. Put the project URL and anon key in `.env.production`.

The assistant's rules live in `src/content/ask-hub-instructions.ts`. It answers only from hub content, cites its sources, never guesses entitlements and points to HiBob or People and Culture for anything personal.

Before the hub is shared beyond a private preview, put it behind Microsoft sign-in and require a signed-in user on the function. Pages include the salary brackets and internal policies.

### Design

The hub is built on the Half Dome design system:

- Plus Jakarta Sans and Libre Baskerville.
- The five brand colours at full strength, with one accent per theme: sequoia on light, white fir on dark.
- Illustrated brand icons in the matching colourway.
- One brand image on one shape.
- Chalk arrows used sparingly.
- No shadows or gradients.

Light and dark themes follow the device setting.
