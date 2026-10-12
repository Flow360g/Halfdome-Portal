/*
 * The people hub's table of contents: every topic and the pages inside it.
 * This file drives the dashboard, search and routing. Add, rename or reorder
 * pages here; slugs become URLs, so change them with care once a page is live.
 */

import type { SourceKey } from './sources';

export type IconName =
  | 'flag'
  | 'team'
  | 'teapot'
  | 'revenue'
  | 'present'
  | 'calendar'
  | 'learning'
  | 'rating'
  | 'handshake'
  | 'mental-health'
  | 'checklist'
  | 'people';

/** What a page is. Guides are the default; the others are labelled on the dashboard. */
export type PageKind = 'guide' | 'policy' | 'form' | 'template';

export interface HubPage {
  slug: string;
  title: string;
  kind: PageKind;
  /** The SharePoint document this page is written from, when there is one. */
  source?: SourceKey;
  /** Extra words people might search for, such as synonyms and acronyms. */
  keywords?: string[];
}

export interface HubTopic {
  slug: string;
  title: string;
  summary: string;
  icon: IconName;
  pages: HubPage[];
}

export const KIND_LABEL: Record<PageKind, string> = {
  guide: 'Guide',
  policy: 'Policy',
  form: 'Form',
  template: 'Template',
};

export const topics: HubTopic[] = [
  {
    slug: 'the-big-picture',
    title: 'The big picture',
    summary: 'Why we exist, where we are heading and what we value.',
    icon: 'flag',
    pages: [
      { slug: 'why-we-exist', title: 'Why we exist', kind: 'guide', source: 'guideToHalfDome', keywords: ['purpose', 'mission', 'whole potential', 'challengers'] },
      { slug: 'our-values', title: 'Our values', kind: 'guide', source: 'guideToHalfDome', keywords: ['constantly curious', 'stay classy', 'love mondays', 'blow things up'] },
      { slug: 'our-story', title: 'Our story', kind: 'guide', source: 'guideToHalfDome', keywords: ['history', 'founders', 'joe', 'tom', 'will', 'yosemite', 'why half dome'] },
      { slug: 'strategy-and-okrs', title: 'Strategy and OKRs', kind: 'guide', keywords: ['goals', 'objectives', 'key results', 'plan'] },
      { slug: 'agency-scorecard', title: 'Agency scorecard', kind: 'guide', keywords: ['metrics', 'business performance', 'results'] },
      { slug: 'roadmap', title: 'Roadmap', kind: 'guide', keywords: ['priorities', 'projects'] },
      { slug: 'town-hall-recaps', title: 'Town hall recaps', kind: 'guide', keywords: ['all hands', 'company update', 'announcements'] },
    ],
  },
  {
    slug: 'our-team',
    title: 'Our team',
    summary: 'Who is who, how our teams fit together and who to ask.',
    icon: 'team',
    pages: [
      { slug: 'org-chart', title: 'Org chart', kind: 'guide', keywords: ['structure', 'reporting lines', 'organisation'] },
      { slug: 'teams-and-what-they-do', title: 'Teams and what they do', kind: 'guide', keywords: ['departments', 'squads', 'media', 'strategy'] },
      { slug: 'leadership-team', title: 'Leadership team', kind: 'guide', keywords: ['founders', 'partners', 'directors', 'leaders'] },
      { slug: 'who-to-ask-for-what', title: 'Who to ask for what', kind: 'guide', keywords: ['contacts', 'help', 'people and culture', 'hr'] },
      { slug: 'team-readmes', title: 'Team ReadMes', kind: 'guide', keywords: ['working styles', 'user manual'] },
      { slug: 'write-your-ways-of-working', title: 'Write your ways of working', kind: 'template', keywords: ['readme', 'user manual', 'working style'] },
    ],
  },
  {
    slug: 'culture',
    title: 'Culture and how we work',
    summary: 'The habits, rituals and tools that make Half Dome feel like Half Dome.',
    icon: 'teapot',
    pages: [
      { slug: 'how-we-work', title: 'How we work', kind: 'guide', keywords: ['ways of working', 'culture'] },
      { slug: 'how-we-communicate', title: 'How we communicate', kind: 'guide', source: 'communicationGuide', keywords: ['slack', 'email', 'response times', 'hibob shoutouts', 'status'] },
      { slug: 'meetings-that-work', title: 'Meetings that work', kind: 'guide', source: 'meetingsGuide', keywords: ['agenda', 'effective meetings'] },
      { slug: 'our-weekly-rhythm', title: 'Our weekly rhythm', kind: 'guide', keywords: ['wip', 'stand-up', 'meeting schedule'] },
      { slug: 'the-tools-we-use', title: 'The tools we use', kind: 'guide', keywords: ['software', 'slack', 'hibob', 'monday', 'apps'] },
      { slug: 'giving-and-receiving-feedback', title: 'Giving and receiving feedback', kind: 'guide', keywords: ['feedback', 'difficult conversations'] },
      { slug: 'dress-code', title: 'Dress code', kind: 'policy', keywords: ['clothes', 'what to wear'] },
      { slug: 'socials-and-off-sites', title: 'Socials and off-sites', kind: 'guide', keywords: ['events', 'parties', 'christmas party', 'culture committee'] },
    ],
  },
  {
    slug: 'pay-and-recognition',
    title: 'Pay and recognition',
    summary: 'How pay works, how it is reviewed and how we recognise great work.',
    icon: 'revenue',
    pages: [
      { slug: 'remuneration-and-benefits', title: 'Remuneration and benefits', kind: 'policy', source: 'remunerationPolicy', keywords: ['salary', 'compensation', 'pay equity', 'pay'] },
      { slug: 'salary-brackets', title: 'Salary brackets', kind: 'guide', source: 'remunerationPolicy', keywords: ['salary bands', 'pay transparency', 'levels'] },
      { slug: 'pay-reviews', title: 'Pay reviews', kind: 'guide', source: 'remunerationPolicy', keywords: ['salary review', 'june', 'december', 'pay rise'] },
      { slug: 'payroll-dates-and-payslips', title: 'Payroll dates and payslips', kind: 'guide', keywords: ['payday', 'pay cycle', 'payslip', 'when do i get paid'] },
      { slug: 'superannuation', title: 'Superannuation', kind: 'guide', keywords: ['super', 'retirement', 'super fund'] },
      { slug: 'expenses-and-reimbursements', title: 'Expenses and reimbursements', kind: 'policy', source: 'expensesPolicy', keywords: ['receipts', 'claims', 'expense claim', 'reimbursement', 'travel'] },
      { slug: 'recognition-and-awards', title: 'Recognition and awards', kind: 'guide', keywords: ['shoutouts', 'kudos', 'awards'] },
    ],
  },
  {
    slug: 'benefits-and-perks',
    title: 'Benefits and perks',
    summary: 'The extras that come with working here and how to use them.',
    icon: 'present',
    pages: [
      { slug: 'benefits-at-a-glance', title: 'Benefits at a glance', kind: 'guide', source: 'remunerationPolicy', keywords: ['perks', 'free lunch fridays', 'snacks', 'coffee', 'merch'] },
      { slug: 'the-three-keys', title: 'The Three Keys', kind: 'guide', source: 'remunerationPolicy', keywords: ['journey key', 'wellness key', 'growth key', 'work perks', 'trimester'] },
      { slug: 'tech-and-equipment', title: 'Tech and equipment', kind: 'guide', keywords: ['laptop', 'computer', 'monitor', 'hardware'] },
      { slug: 'milestones-and-celebrations', title: 'Milestones and celebrations', kind: 'guide', source: 'remunerationPolicy', keywords: ['birthday', 'work anniversary', 'anniversary bonus', 'celebrate'] },
    ],
  },
  {
    slug: 'leave-and-flexibility',
    title: 'Leave and flexibility',
    summary: 'Time off, public holidays and working in a way that suits you.',
    icon: 'calendar',
    pages: [
      { slug: 'types-of-leave', title: 'Types of leave', kind: 'policy', source: 'leavePolicy', keywords: ['annual leave', 'personal leave', 'sick leave', "carer's leave", 'compassionate leave', 'long service leave', 'holidays'] },
      { slug: 'how-to-apply-for-leave', title: 'How to apply for leave', kind: 'guide', source: 'leavePolicy', keywords: ['annual leave', 'book leave', 'time off', 'holiday', 'request leave', 'hibob'] },
      { slug: 'whole-potential-days', title: 'Whole Potential Days', kind: 'guide', source: 'wholePotentialDaysGuide', keywords: ['wpd', 'long weekend', 'day off', 'trimester'] },
      { slug: 'advanced-leave', title: 'Advanced leave', kind: 'policy', source: 'leavePolicy', keywords: ['unlimited leave', 'extra leave', 'negative balance'] },
      { slug: 'public-holidays', title: 'Public holidays and swaps', kind: 'guide', source: 'leavePolicy', keywords: ['melbourne cup', 'grand final', 'christmas', 'easter', 'swap a public holiday', 'victoria'] },
      { slug: 'our-working-model', title: 'Our working model (60/40)', kind: 'guide', source: 'remoteWorkingGuide', keywords: ['hybrid', 'wfh', 'work from home', 'remote', 'office', 'richmond'] },
      { slug: 'flexible-working', title: 'Flexible working', kind: 'policy', keywords: ['flexibility', 'hours', 'part time'] },
      { slug: 'working-from-overseas', title: 'Working from overseas', kind: 'policy', source: 'remoteWorkingGuide', keywords: ['travel', 'abroad', 'work remotely'] },
    ],
  },
  {
    slug: 'learning-and-development',
    title: 'Learning and development',
    summary: 'Build your skills, your craft and your career with us.',
    icon: 'learning',
    pages: [
      { slug: 'career-framework', title: 'Career and capability framework', kind: 'guide', keywords: ['levels', 'progression', 'career path', 'capability framework'] },
      { slug: 'one-on-ones', title: 'One-on-ones', kind: 'guide', keywords: ['1:1', '1on1', 'manager catch-up'] },
      { slug: 'learna', title: 'Learna learning platform', kind: 'guide', source: 'remunerationPolicy', keywords: ['courses', 'online learning', 'training library'] },
      { slug: 'qualifications', title: 'Qualifications (MFA, IMAA, Mini MBA)', kind: 'guide', source: 'remunerationPolicy', keywords: ['study', 'certification', 'mfa', 'imaa', 'mini mba'] },
      { slug: 'platform-certifications', title: 'Platform certifications', kind: 'guide', keywords: ['meta blueprint', 'google skillshop', 'google ads', 'tiktok academy'] },
      { slug: 'coaching-and-mentoring', title: 'Coaching and mentoring', kind: 'guide', source: 'remunerationPolicy', keywords: ['mentor', 'coach', 'uprise'] },
    ],
  },
  {
    slug: 'performance',
    title: 'Performance',
    summary: 'How we set goals, check in and recognise growth.',
    icon: 'rating',
    pages: [
      { slug: 'performance-framework', title: 'Performance framework', kind: 'guide', keywords: ['expectations', 'behaviours', 'capability'] },
      { slug: 'review-cycle', title: 'Review cycle', kind: 'guide', keywords: ['performance review', 'appraisal', 'timeline'] },
      { slug: 'setting-goals', title: 'Setting goals', kind: 'guide', keywords: ['okrs', 'objectives', 'targets'] },
      { slug: 'check-ins', title: 'Check-ins', kind: 'guide', keywords: ['feedback', 'catch-up', 'progress'] },
      { slug: 'promotions', title: 'Promotions', kind: 'policy', keywords: ['promotion', 'level up', 'progression'] },
      { slug: 'manager-guide', title: 'Manager guide', kind: 'guide', keywords: ['managers', 'leading a team', 'people leaders'] },
      { slug: 'performance-support-plans', title: 'Performance support plans', kind: 'policy', keywords: ['pip', 'improvement plan', 'underperformance'] },
    ],
  },
  {
    slug: 'hiring-and-onboarding',
    title: 'Hiring and onboarding',
    summary: 'How we find great people and welcome them in.',
    icon: 'handshake',
    pages: [
      { slug: 'your-first-90-days', title: 'Your first 90 days', kind: 'guide', source: 'guideToHalfDome', keywords: ['onboarding', 'new starter', 'induction', 'first week', 'checklist'] },
      { slug: 'buddy-program', title: 'Buddy Program', kind: 'guide', source: 'buddyProgramGuide', keywords: ['buddy', 'new starter', 'onboarding'] },
      { slug: 'how-we-hire', title: 'How we hire', kind: 'guide', keywords: ['recruitment', 'hiring'] },
      { slug: 'interview-process', title: 'Interview process', kind: 'guide', keywords: ['interviews', 'interviewing', 'candidates'] },
      { slug: 'referral-programme', title: 'Referral programme', kind: 'policy', keywords: ['refer a friend', 'referral bonus', "finder's fee"] },
      { slug: 'probation', title: 'Probation', kind: 'policy', keywords: ['probation period'] },
      { slug: 'leaving-half-dome', title: 'Leaving Half Dome', kind: 'guide', keywords: ['offboarding', 'resignation', 'resign', 'notice period', 'exit'] },
    ],
  },
  {
    slug: 'wellbeing-and-support',
    title: 'Wellbeing and support',
    summary: 'Looking after your mind, your body and the people you love.',
    icon: 'mental-health',
    pages: [
      { slug: 'uprise', title: 'Uprise: confidential support and coaching', kind: 'guide', source: 'remunerationPolicy', keywords: ['eap', 'employee assistance program', 'counselling', 'mental health'] },
      { slug: 'mental-health-first-aid', title: 'Mental Health First Aid', kind: 'guide', source: 'mentalHealthFirstAidGuide', keywords: ['mhfa', 'first aiders', 'support'] },
      { slug: 'wellbeing-at-half-dome', title: 'Wellbeing at Half Dome', kind: 'guide', source: 'wellbeingGuide', keywords: ['stress', 'burnout', 'wellbeing'] },
      { slug: 'parental-leave', title: 'Parental leave', kind: 'policy', source: 'parentalLeaveGuide', keywords: ['maternity', 'paternity', 'primary carer', 'secondary carer', 'baby', 'adoption'] },
      { slug: 'reproductive-health-and-wellbeing', title: 'Reproductive health and wellbeing', kind: 'policy', keywords: ['fertility', 'ivf', 'menopause', 'periods', 'pregnancy loss'] },
      { slug: 'family-and-domestic-violence-support', title: 'Family and domestic violence support', kind: 'policy', source: 'leavePolicy', keywords: ['fdv leave', 'safety', 'domestic violence leave'] },
      { slug: 'health-and-safety', title: 'Health and safety', kind: 'policy', keywords: ['ohs', 'whs', 'injury', 'first aid', 'incident report'] },
      { slug: 'team-pulse-surveys', title: 'Team pulse surveys', kind: 'guide', keywords: ['engagement survey', 'feedback survey', 'great place to work'] },
    ],
  },
  {
    slug: 'policies',
    title: 'Policies',
    summary: 'The rules of the road, written in plain English.',
    icon: 'checklist',
    pages: [
      { slug: 'code-of-conduct', title: 'Code of conduct', kind: 'policy', source: 'codeOfConduct', keywords: ['behaviour', 'conduct', 'ethics'] },
      { slug: 'equal-opportunity', title: 'Equal opportunity and anti-discrimination', kind: 'policy', keywords: ['discrimination', 'eeo', 'fairness'] },
      { slug: 'respect-at-work', title: 'Bullying and harassment', kind: 'policy', keywords: ['respect at work', 'sexual harassment', 'bullying'] },
      { slug: 'raising-a-concern', title: 'Raising a concern', kind: 'policy', keywords: ['grievance', 'complaint', 'issue'] },
      { slug: 'whistleblower', title: 'Whistleblower', kind: 'policy', keywords: ['speak up', 'report misconduct'] },
      { slug: 'it-and-acceptable-use', title: 'IT and acceptable use', kind: 'policy', keywords: ['devices', 'security', 'passwords', 'laptop'] },
      { slug: 'using-ai-at-work', title: 'Using AI at work', kind: 'policy', keywords: ['ai', 'claude', 'chatgpt', 'copilot', 'generative ai'] },
      { slug: 'privacy-and-confidentiality', title: 'Privacy and confidentiality', kind: 'policy', keywords: ['client data', 'personal information', 'nda'] },
    ],
  },
  {
    slug: 'diversity-equity-and-inclusion',
    title: 'Diversity, equity and inclusion',
    summary: 'Building a place where everyone belongs and can do their best work.',
    icon: 'people',
    pages: [
      { slug: 'our-commitment', title: 'Our commitment', kind: 'guide', keywords: ['dei', 'd&i', 'diversity', 'inclusion'] },
      { slug: 'belonging-at-half-dome', title: 'Belonging at Half Dome', kind: 'guide', keywords: ['belonging', 'community', 'employee groups'] },
      { slug: 'pay-equity', title: 'Pay equity', kind: 'guide', source: 'remunerationPolicy', keywords: ['gender pay gap', 'wgea', 'equal pay', 'pay audit'] },
      { slug: 'acknowledgement-of-country', title: 'Acknowledgement of Country', kind: 'guide', keywords: ['first nations', 'reconciliation', 'aboriginal', 'torres strait islander', 'wurundjeri'] },
      { slug: 'accessibility-and-adjustments', title: 'Accessibility and adjustments', kind: 'policy', keywords: ['disability', 'reasonable adjustments', 'neurodiversity'] },
      { slug: 'cultural-and-religious-leave', title: 'Cultural and religious leave', kind: 'policy', source: 'leavePolicy', keywords: ['cultural leave', 'religious holidays', 'ceremonial', 'swap a public holiday'] },
    ],
  },
];

/** Shortcuts to the pages people open most. Each one points at a page above. */
export const quickLinks: { label: string; topic: string; page: string }[] = [
  { label: 'Apply for leave', topic: 'leave-and-flexibility', page: 'how-to-apply-for-leave' },
  { label: 'Whole Potential Days', topic: 'leave-and-flexibility', page: 'whole-potential-days' },
  { label: 'The Three Keys', topic: 'benefits-and-perks', page: 'the-three-keys' },
  { label: 'Claim an expense', topic: 'pay-and-recognition', page: 'expenses-and-reimbursements' },
  { label: 'Org chart', topic: 'our-team', page: 'org-chart' },
  { label: 'Confidential support', topic: 'wellbeing-and-support', page: 'uprise' },
];

/** Suggested searches shown under the search field. */
export const popularSearches = ['Whole Potential Days', 'Annual leave', 'Parental leave', 'Three Keys', 'Uprise'];

export const pageCount = topics.reduce((total, topic) => total + topic.pages.length, 0);

export function topicPath(topic: string) {
  return `/topics/${topic}`;
}

export function pagePath(topic: string, page: string) {
  return `/topics/${topic}/${page}`;
}

export function findTopic(slug: string | undefined) {
  return topics.find((topic) => topic.slug === slug);
}

export function findPage(topicSlug: string | undefined, pageSlug: string | undefined) {
  const topic = findTopic(topicSlug);
  const page = topic?.pages.find((p) => p.slug === pageSlug);
  return topic && page ? { topic, page } : undefined;
}
