import type { Day } from './dates';

export type Selection = { kind: 'item'; id: string } | { kind: 'day'; day: Day };
export type View = 'month' | 'year' | 'agenda';

export interface Actions {
  openItem: (id: string, from?: Element | null) => void;
  openDay: (day: Day, from?: Element | null) => void;
}
