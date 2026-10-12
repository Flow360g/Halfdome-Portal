/*
 * The new starter journey on "Your first 90 days". Each step links to the
 * hub page that explains it. Drawn from Your guide to Half Dome (July 2025)
 * and Your guide to the HD Buddy Program (August 2025).
 */

export interface JourneyStep {
  id: string;
  title: string;
  detail: string;
  link?: { topic: string; page: string };
}

export interface JourneyStage {
  id: string;
  title: string;
  when: string;
  steps: JourneyStep[];
}

export const journey: JourneyStage[] = [
  {
    id: 'before',
    title: 'Before day one',
    when: 'The week before you start',
    steps: [
      { id: 'buddy-hello', title: 'Say hello to your buddy', detail: 'They’ll email to introduce themselves and tell you what to expect.', link: { topic: 'hiring-and-onboarding', page: 'buddy-program' } },
      { id: 'hibob-profile', title: 'Check your details in HiBob', detail: 'Your employment terms and position description live there.', link: { topic: 'culture', page: 'the-tools-we-use' } },
      { id: 'our-story', title: 'Read our story', detail: 'Who started Half Dome, what we do and why it matters.', link: { topic: 'the-big-picture', page: 'our-story' } },
    ],
  },
  {
    id: 'week-one',
    title: 'Week one',
    when: 'Days 1 to 5',
    steps: [
      { id: 'buddy-coffee', title: 'Coffee or lunch with your buddy', detail: 'Your buddy takes you out on your first day to say hello properly.', link: { topic: 'hiring-and-onboarding', page: 'buddy-program' } },
      { id: 'values', title: 'Get to know our values', detail: 'Four short statements that shape how we work.', link: { topic: 'the-big-picture', page: 'our-values' } },
      { id: 'communicate', title: 'Learn how we communicate', detail: 'Slack for quick questions, email for detail, a call for anything sensitive.', link: { topic: 'culture', page: 'how-we-communicate' } },
      { id: 'tools', title: 'Set up your tools', detail: 'Slack, HiBob and everything else you’ll use every day.', link: { topic: 'culture', page: 'the-tools-we-use' } },
      { id: 'conduct', title: 'Read the code of conduct', detail: 'How we treat each other, our clients and our work.', link: { topic: 'policies', page: 'code-of-conduct' } },
    ],
  },
  {
    id: 'month-one',
    title: 'First month',
    when: 'Weeks 2 to 4',
    steps: [
      { id: 'buddy-weekly', title: 'Weekly catch-ups with your buddy', detail: 'A regular check-in for anything on your mind.', link: { topic: 'hiring-and-onboarding', page: 'buddy-program' } },
      { id: 'leave', title: 'Understand your leave', detail: 'Annual leave, personal leave and how to request it.', link: { topic: 'leave-and-flexibility', page: 'types-of-leave' } },
      { id: 'wpd', title: 'Plan a Whole Potential Day', detail: 'Six extra paid days a year, two each trimester.', link: { topic: 'leave-and-flexibility', page: 'whole-potential-days' } },
      { id: 'keys', title: 'Choose your Key for the trimester', detail: 'Journey, Wellness or Growth, worth $250 each trimester.', link: { topic: 'benefits-and-perks', page: 'the-three-keys' } },
      { id: 'one-on-ones', title: 'Set up one-on-ones with your manager', detail: 'Agree how often you’ll meet and what you’ll cover.', link: { topic: 'learning-and-development', page: 'one-on-ones' } },
    ],
  },
  {
    id: 'month-three',
    title: 'First 90 days',
    when: 'Months 2 and 3',
    steps: [
      { id: 'buddy-fortnightly', title: 'Fortnightly buddy check-ins', detail: 'Until you reach three months. After that, they’re still there when you need them.', link: { topic: 'hiring-and-onboarding', page: 'buddy-program' } },
      { id: 'goals', title: 'Set your goals', detail: 'Agree what success looks like in your role.', link: { topic: 'performance', page: 'setting-goals' } },
      { id: 'support', title: 'Know where to get support', detail: 'Uprise gives you confidential support, coaching and wellness resources.', link: { topic: 'wellbeing-and-support', page: 'uprise' } },
      { id: 'probation', title: 'Have your probation conversation', detail: 'A chance to look back on your first few months with your manager.', link: { topic: 'hiring-and-onboarding', page: 'probation' } },
    ],
  },
];

export const journeySteps = journey.flatMap((stage) => stage.steps);

export const JOURNEY_STORAGE_KEY = 'hub:journey:v1';
