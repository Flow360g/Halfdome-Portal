import type { MDXComponents } from 'mdx/types';
import type { AnchorHTMLAttributes, TableHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { JourneyChecklist } from '../tools/JourneyChecklist';
import { LeavePlanner, NextPublicHoliday, WholePotentialDays } from '../tools/LeaveTools';
import {
  AtAGlance,
  Callout,
  DocumentLink,
  Faq,
  KeyNumber,
  KeyNumbers,
  PolicySection,
  Question,
  Quote,
  ShortVersion,
  Statement,
  Step,
  Steps,
  Timeline,
  TimelineItem,
  WhoToAsk,
} from './Blocks';
import { Value, Values } from './Value';

/** Internal links route inside the hub; everything else opens in a new tab. */
function SmartLink({ href = '', children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" {...rest}>
      {children}
    </a>
  );
}

function Table(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-wrap">
      <table className="hd-table" {...props} />
    </div>
  );
}

/** Everything a page author can use in MDX without importing it. */
export const mdxComponents: MDXComponents = {
  a: SmartLink,
  table: Table,
  AtAGlance,
  Callout,
  DocumentLink,
  Faq,
  JourneyChecklist,
  KeyNumber,
  KeyNumbers,
  LeavePlanner,
  NextPublicHoliday,
  PolicySection,
  Question,
  Quote,
  ShortVersion,
  Statement,
  Step,
  Steps,
  Timeline,
  TimelineItem,
  Value,
  Values,
  WholePotentialDays,
  WhoToAsk,
};
