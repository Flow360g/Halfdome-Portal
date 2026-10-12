declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types';
  import type { PageFrontmatter } from './content/pages';

  export const frontmatter: PageFrontmatter;
  export default function MDXContent(props: MDXProps): JSX.Element;
}
