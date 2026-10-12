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
  /** Which paths count as this page, for the "you are here" state. */
  matches?: (pathname: string) => boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'people',
    label: 'People hub',
    description: 'Policies, pay and leave',
    icon: NAV_ICONS.people,
    to: '/',
    // The hub owns "/" and every topic page under it.
    matches: (path) => path === '/' || path.startsWith('/topics'),
  },
  {
    id: 'calendar',
    label: 'Agency calendar',
    description: 'Dates and rhythms, 2026',
    icon: NAV_ICONS.calendar,
    to: '/calendar',
    matches: (path) => path.startsWith('/calendar'),
  },
];
