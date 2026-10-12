# Half Dome portal

The internal Half Dome portal: a shared shell with a collapsible side nav, and the pages that live inside it.

| Page | Route | Status |
| --- | --- | --- |
| Agency calendar | `/calendar` | Built here |
| People hub | `/` | Built on its own branch; the nav links to its preview until it merges |

## Run it

```bash
npm install
npm run dev            # local dev server
npm run build          # typecheck and production build to dist/
npm run build:preview  # single-file Artifact preview in dist-artifact/
```

## How it's put together

- `src/shell/`: the portal frame. `AppShell` lays out the side nav (top bar and drawer below 960px), `SideNav` renders the logo, nav items and the Today card, and `navItems.ts` lists the pages. The wordmark is split into three slices (`src/assets/shell/logo-*`) so collapsing the nav folds it into the dome. Press `[` to collapse.
- `src/styles/`: `tokens.css`, `base.css` and `components.css` mirror the Half Dome design system; `shell.css` and `calendar.css` are page specific.
- `src/content/agencyCalendar.ts`: every date from *Half Dome - Agency Calender 2026* (People & Culture SharePoint), plus the milestone descriptions. Edit dates here.
- `src/calendar/`: the calendar's date maths (`dates.ts`), derived model (`model.ts`) and components (hero, filter bar, coming up, year strip, month/year/agenda views, detail drawer, rhythm guide).

Calendar shortcuts: `/` search, `T` today, `M` / `Y` / `A` switch views, arrow keys change month, `Esc` closes the drawer.

## Adding the People hub

When the hub branch merges in:

1. Add its routes inside `<AppShell>` in `src/App.tsx` and drop the catch-all redirect to `/calendar`.
2. In `src/shell/navItems.ts`, replace the hub's `href` with `to: '/'`.
3. Remove the logo and divider from the hub's `SiteHeader`, since the side nav now carries the logo.
