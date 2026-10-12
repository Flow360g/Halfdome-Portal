/*
 * The people hub's table of contents: every topic and the pages inside it.
 * This file drives the dashboard, search and routing. Add, rename or reorder
 * pages here; slugs become URLs, so change them with care once a page is live.
 */

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
      { slug: 'why-we-exist', title: 'Why we exist', kind: 'guide', keywords: ['purpose', 'mission', 'whole potential'] },
      { slug: 'our-values', title: 'Our values', kind: 'guide', keywords: ['constantly curious', 'stay classy', 'love mondays', 'blow things up'] },
      { slug: 'our-story', title: 'Our story', kind: 'guide', keywords: ['history', 'founders', 'yosemite', 'why half dome'] },
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
      { slug: 'leadership-team', title: 'Leadership team', kind: 'guide', keywords: ['founders', 'directors', 'leaders'] },
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
      { slug: 'our-weekly-rhythm', title: 'Our weekly rhythm', kind: 'guide', keywords: ['wip', 'stand-up', 'meeting schedule'] },
      { slug: 'meetings-that-work', title: 'Meetings that work', kind: 'guide', keywords: ['agenda', 'effective meetings'] },
      { slug: 'the-tools-we-use', title: 'The tools we use', kind: 'guide', keywords: ['software', 'slack', 'teams', 'monday', 'apps'] },
      { slug: 'async-and-documentation', title: 'Async and documentation', kind: 'guide', keywords: ['asynchronous', 'writing things down'] },
      { slug: 'giving-and-receiving-feedback', title: 'Giving and receiving feedback', kind: 'guide', keywords: ['feedback', 'difficult conversations'] },
      { slug: 'dress-code', title: 'Dress code', kind: 'policy', keywords: ['clothes', 'what to wear'] },
      { slug: 'socials-and-off-sites', title: 'Socials and off-sites', kind: 'guide', keywords: ['events', 'parties', 'christmas party', 'fun'] },
    ],
  },
  {
    slug: 'pay-and-recognition',
    title: 'Pay and recognition',
    summary: 'How pay works, when you are paid and how we recognise great work.',
    icon: 'revenue',
    pages: [
      { slug: 'remuneration-framework', title: 'Remuneration framework', kind: 'policy', keywords: ['salary', 'salary bands', 'compensation', 'pay'] },
      { slug: 'pay-reviews', title: 'Pay reviews', kind: 'guide', keywords: ['salary review', 'pay rise', 'increase'] },
      { slug: 'payroll-dates-and-payslips', title: 'Payroll dates and payslips', kind: 'guide', keywords: ['payday', 'pay cycle', 'payslip', 'when do i get paid'] },
      { slug: 'superannuation', title: 'Superannuation', kind: 'guide', keywords: ['super', 'retirement', 'super fund'] },
      { slug: 'expenses-and-reimbursements', title: 'Expenses and reimbursements', kind: 'form', keywords: ['receipts', 'claims', 'expense claim', 'reimbursement'] },
      { slug: 'recognition-and-awards', title: 'Recognition and awards', kind: 'guide', keywords: ['shout-outs', 'kudos', 'awards'] },
    ],
  },
  {
    slug: 'benefits-and-perks',
    title: 'Benefits and perks',
    summary: 'The extras that come with working here and how to use them.',
    icon: 'present',
    pages: [
      { slug: 'benefits-at-a-glance', title: 'Benefits at a glance', kind: 'guide', keywords: ['perks', 'benefits'] },
      { slug: 'wellbeing-benefits', title: 'Wellbeing benefits', kind: 'guide', keywords: ['gym', 'health', 'fitness'] },
      { slug: 'tech-and-equipment', title: 'Tech and equipment', kind: 'guide', keywords: ['laptop', 'computer', 'monitor', 'it'] },
      { slug: 'partner-discounts', title: 'Partner discounts', kind: 'guide', keywords: ['offers', 'deals', 'discount'] },
      { slug: 'milestones-and-celebrations', title: 'Milestones and celebrations', kind: 'guide', keywords: ['birthday', 'work anniversary', 'celebrate'] },
    ],
  },
  {
    slug: 'leave-and-flexibility',
    title: 'Leave and flexibility',
    summary: 'Time off, public holidays and working in a way that suits you.',
    icon: 'calendar',
    pages: [
      { slug: 'types-of-leave', title: 'Types of leave', kind: 'policy', keywords: ['annual leave', 'personal leave', 'sick leave', "carer's leave", 'compassionate leave', 'long service leave', 'holidays'] },
      { slug: 'how-to-apply-for-leave', title: 'How to apply for leave', kind: 'guide', keywords: ['annual leave', 'book leave', 'time off', 'holiday', 'request leave'] },
      { slug: 'public-holidays-in-victoria', title: 'Public holidays in Victoria', kind: 'guide', keywords: ['melbourne cup', 'grand final', 'christmas', 'easter'] },
      { slug: 'flexible-working', title: 'Flexible working', kind: 'policy', keywords: ['flexibility', 'hours', 'part time', 'compressed week'] },
      { slug: 'hybrid-working-and-office-days', title: 'Hybrid working and office days', kind: 'guide', keywords: ['wfh', 'work from home', 'remote', 'office', 'richmond'] },
      { slug: 'working-from-home-setup', title: 'Working from home setup', kind: 'guide', keywords: ['remote', 'ergonomics', 'home office', 'desk'] },
      { slug: 'working-from-overseas', title: 'Working from overseas', kind: 'policy', keywords: ['travel', 'abroad', 'work remotely'] },
    ],
  },
  {
    slug: 'learning-and-development',
    title: 'Learning and development',
    summary: 'Build your skills, your craft and your career with us.',
    icon: 'learning',
    pages: [
      { slug: 'career-framework', title: 'Career framework', kind: 'guide', keywords: ['levels', 'progression', 'career path', 'promotion'] },
      { slug: 'one-on-ones', title: 'One-on-ones', kind: 'guide', keywords: ['1:1', '1on1', 'manager catch-up'] },
      { slug: 'learning-budget', title: 'Learning budget', kind: 'policy', keywords: ['training budget', 'courses', 'conferences', 'study'] },
      { slug: 'training-library', title: 'Training library', kind: 'guide', keywords: ['courses', 'resources', 'learning'] },
      { slug: 'platform-certifications', title: 'Platform certifications', kind: 'guide', keywords: ['meta blueprint', 'google skillshop', 'google ads', 'tiktok academy'] },
      { slug: 'mentoring', title: 'Mentoring', kind: 'guide', keywords: ['mentor', 'buddy', 'coaching'] },
    ],
  },
  {
    slug: 'performance',
    title: 'Performance',
    summary: 'How we set goals, check in and recognise growth.',
    icon: 'rating',
    pages: [
      { slug: 'performance-framework', title: 'Performance framework', kind: 'guide', keywords: ['expectations', 'behaviours'] },
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
      { slug: 'your-first-90-days', title: 'Your first 90 days', kind: 'guide', keywords: ['onboarding', 'new starter', 'induction', 'first week'] },
      { slug: 'onboarding-checklist', title: 'Onboarding checklist', kind: 'template', keywords: ['new starter', 'setup', 'first day'] },
      { slug: 'how-we-hire', title: 'How we hire', kind: 'guide', keywords: ['recruitment', 'hiring'] },
      { slug: 'interview-process', title: 'Interview process', kind: 'guide', keywords: ['interviews', 'interviewing', 'candidates'] },
      { slug: 'referral-programme', title: 'Referral programme', kind: 'policy', keywords: ['refer a friend', 'referral bonus'] },
      { slug: 'probation', title: 'Probation', kind: 'policy', keywords: ['probation period', 'three months'] },
      { slug: 'leaving-half-dome', title: 'Leaving Half Dome', kind: 'guide', keywords: ['offboarding', 'resignation', 'resign', 'notice period', 'exit'] },
    ],
  },
  {
    slug: 'wellbeing-and-support',
    title: 'Wellbeing and support',
    summary: 'Looking after your mind, your body and the people you love.',
    icon: 'mental-health',
    pages: [
      { slug: 'employee-assistance-program', title: 'Employee Assistance Program', kind: 'guide', keywords: ['eap', 'counselling', 'confidential support', 'mental health'] },
      { slug: 'mental-health-at-work', title: 'Mental health at work', kind: 'guide', keywords: ['stress', 'burnout', 'wellbeing'] },
      { slug: 'parental-leave', title: 'Parental leave', kind: 'policy', keywords: ['maternity', 'paternity', 'primary carer', 'secondary carer', 'baby', 'adoption'] },
      { slug: 'reproductive-health-and-wellbeing', title: 'Reproductive health and wellbeing', kind: 'policy', keywords: ['fertility', 'ivf', 'menopause', 'periods', 'pregnancy loss'] },
      { slug: 'family-and-domestic-violence-support', title: 'Family and domestic violence support', kind: 'policy', keywords: ['fdv leave', 'safety', 'domestic violence leave'] },
      { slug: 'health-and-safety', title: 'Health and safety', kind: 'policy', keywords: ['ohs', 'whs', 'injury', 'first aid', 'incident report'] },
      { slug: 'team-pulse-surveys', title: 'Team pulse surveys', kind: 'guide', keywords: ['engagement survey', 'feedback survey'] },
    ],
  },
  {
    slug: 'policies',
    title: 'Policies',
    summary: 'The rules of the road, written in plain English.',
    icon: 'checklist',
    pages: [
      { slug: 'code-of-conduct', title: 'Code of conduct', kind: 'policy', keywords: ['behaviour', 'conduct', 'ethics'] },
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
      { slug: 'gender-pay-gap', title: 'Gender pay gap', kind: 'guide', keywords: ['wgea', 'equal pay', 'pay equity'] },
      { slug: 'acknowledgement-of-country', title: 'Acknowledgement of Country', kind: 'guide', keywords: ['first nations', 'reconciliation', 'aboriginal', 'torres strait islander', 'wurundjeri'] },
      { slug: 'accessibility-and-adjustments', title: 'Accessibility and adjustments', kind: 'policy', keywords: ['disability', 'reasonable adjustments', 'neurodiversity'] },
      { slug: 'cultural-and-religious-leave', title: 'Cultural and religious leave', kind: 'policy', keywords: ['cultural leave', 'religious holidays', 'swap a public holiday'] },
    ],
  },
];

/** Shortcuts to the pages people open most. Each one points at a page above. */
export const quickLinks: { label: string; topic: string; page: string }[] = [
  { label: 'Apply for leave', topic: 'leave-and-flexibility', page: 'how-to-apply-for-leave' },
  { label: 'Payroll dates', topic: 'pay-and-recognition', page: 'payroll-dates-and-payslips' },
  { label: 'Claim an expense', topic: 'pay-and-recognition', page: 'expenses-and-reimbursements' },
  { label: 'Org chart', topic: 'our-team', page: 'org-chart' },
  { label: 'Public holidays', topic: 'leave-and-flexibility', page: 'public-holidays-in-victoria' },
  { label: 'Confidential support', topic: 'wellbeing-and-support', page: 'employee-assistance-program' },
];

/** Suggested searches shown under the search field. */
export const popularSearches = ['Annual leave', 'Parental leave', 'Payday', 'Super', 'Learning budget'];

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
