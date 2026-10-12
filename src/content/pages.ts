import type { ComponentType } from 'react';
import type { MDXComponents } from 'mdx/types';
import type { PageKind } from './hub';
import type { SourceKey } from './sources';

/*
 * Page content lives in src/content/pages/<topic>/<page>.mdx. A page without
 * a file shows the holding page until its content is written.
 */

export type TemplateName = 'guide' | 'policy' | 'story' | 'journey';

export interface PageFrontmatter {
  /** One or two sentences shown under the title and used by search and Ask the hub. */
  summary: string;
  /** Who keeps the page accurate. */
  owner?: string;
  /** When the hub page was last checked against its source (YYYY-MM-DD). */
  updated: string;
  /** The SharePoint document the page is written from. Overrides the one in hub.ts. */
  source?: SourceKey;
  /** Other pages to suggest, as "topic/page". */
  related?: string[];
  /** Layout to use. Defaults from the page kind in hub.ts. */
  template?: TemplateName;
}

export interface PageModule {
  default: ComponentType<{ components?: MDXComponents }>;
  frontmatter: PageFrontmatter;
}

const files = import.meta.glob<PageModule>('./pages/*/*.mdx');

function key(topic: string, page: string) {
  return `./pages/${topic}/${page}.mdx`;
}

export function hasContent(topic: string, page: string) {
  return key(topic, page) in files;
}

export function loadPage(topic: string, page: string): Promise<PageModule> | undefined {
  return files[key(topic, page)]?.();
}

export function templateFor(kind: PageKind, frontmatter: PageFrontmatter): TemplateName {
  if (frontmatter.template) return frontmatter.template;
  return kind === 'policy' ? 'policy' : 'guide';
}
