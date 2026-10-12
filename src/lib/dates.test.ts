import { describe, expect, it } from 'vitest';
import { publicHolidaysVic } from '../content/public-holidays-vic';
import {
  addMonths,
  isOlderThan,
  nextHoliday,
  requestByDate,
  todayInMelbourne,
  trimesterFor,
  workingDaysBetween,
} from './dates';

const holidays = publicHolidaysVic.map((h) => h.date);

describe('workingDaysBetween', () => {
  it('counts a plain Monday to Friday week as five days', () => {
    expect(workingDaysBetween('2026-10-12', '2026-10-16', holidays)).toEqual({ workingDays: 5, holidays: [] });
  });

  it('skips Melbourne Cup Day', () => {
    expect(workingDaysBetween('2026-11-02', '2026-11-06', holidays)).toEqual({
      workingDays: 4,
      holidays: ['2026-11-03'],
    });
  });

  it('skips Christmas, the Boxing Day substitute and weekends over the break', () => {
    const result = workingDaysBetween('2026-12-21', '2027-01-08', holidays);
    expect(result.holidays).toEqual(['2026-12-25', '2026-12-28', '2027-01-01']);
    expect(result.workingDays).toBe(12);
  });

  it('returns zero for a weekend', () => {
    expect(workingDaysBetween('2026-10-17', '2026-10-18', holidays).workingDays).toBe(0);
  });
});

describe('requestByDate', () => {
  it('asks for four weeks notice for annual leave', () => {
    expect(requestByDate('2026-12-14', 'annual')).toBe('2026-11-16');
  });

  it('asks for three months notice for long service leave', () => {
    expect(requestByDate('2027-05-31', 'long-service')).toBe('2027-02-28');
  });

  it('treats a Whole Potential Day as planned leave', () => {
    expect(requestByDate('2026-11-06', 'whole-potential')).toBe('2026-10-09');
  });
});

describe('addMonths', () => {
  it('clamps to the end of shorter months', () => {
    expect(addMonths('2026-03-31', -1)).toBe('2026-02-28');
  });
});

describe('nextHoliday', () => {
  it('finds Melbourne Cup Day from mid October 2026', () => {
    expect(nextHoliday('2026-10-12', publicHolidaysVic)?.name).toBe('Melbourne Cup Day');
  });

  it('counts a holiday that is today', () => {
    expect(nextHoliday('2026-11-03', publicHolidaysVic)?.date).toBe('2026-11-03');
  });
});

describe('trimesterFor', () => {
  it('places October in the first trimester', () => {
    expect(trimesterFor('2026-10-12')).toEqual({ number: 1, start: '2026-07-01', end: '2026-10-31' });
  });

  it('runs the second trimester across the new year', () => {
    expect(trimesterFor('2026-11-01')).toEqual({ number: 2, start: '2026-11-01', end: '2027-02-28' });
    expect(trimesterFor('2027-01-15')).toEqual({ number: 2, start: '2026-11-01', end: '2027-02-28' });
  });

  it('ends a leap-year second trimester on 29 February', () => {
    expect(trimesterFor('2028-02-29').end).toBe('2028-02-29');
  });

  it('places April in the third trimester', () => {
    expect(trimesterFor('2027-04-30')).toEqual({ number: 3, start: '2027-03-01', end: '2027-06-30' });
  });
});

describe('isOlderThan', () => {
  it('flags a policy reviewed more than a year ago', () => {
    expect(isOlderThan('2025-09', 12, '2026-10-12')).toBe(true);
  });

  it('does not flag a recent review', () => {
    expect(isOlderThan('2026-03', 12, '2026-10-12')).toBe(false);
  });
});

describe('todayInMelbourne', () => {
  it('rolls over at midnight Melbourne time, not UTC', () => {
    // 2pm UTC on 12 October is 1am on 13 October in Melbourne (AEDT).
    expect(todayInMelbourne(new Date('2026-10-12T14:00:00Z'))).toBe('2026-10-13');
  });
});
