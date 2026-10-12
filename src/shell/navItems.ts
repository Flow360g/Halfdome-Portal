import { NAV_ICONS } from './brand';

export interface NavItem {
  id: string;
  label: string;
  description: string;
  icon: { light: string; dark: string };
  /** In-app route. */
  to?: string;
  /** Somewhere outside the app, opened in a new tab. */
  href?: string;
}

/*
 * The People hub is being built on its own branch. Until it merges into this app it links to
 * its published preview; once merged, swap `href` for `to: '/'`.
 */
export const PEOPLE_HUB_PREVIEW_URL = 'https://claude.ai/artifact/1NxKeUmL5rqKKev2aYodZV';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'people',
    label: 'People hub',
    description: 'Policies, pay and leave',
    icon: NAV_ICONS.people,
    href: PEOPLE_HUB_PREVIEW_URL,
  },
  {
    id: 'calendar',
    label: 'Agency calendar',
    description: 'Dates and rhythms, 2026',
    icon: NAV_ICONS.calendar,
    to: '/calendar',
  },
];
