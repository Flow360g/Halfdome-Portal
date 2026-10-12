/// <reference types="vitest/config" />
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

// `--mode artifact` builds a self-contained preview: every asset is inlined so
// scripts/inline-preview.mjs can fold the whole app into one HTML page.
export default defineConfig(({ mode }) => {
  const artifact = mode === 'artifact';
  return {
    plugins: [
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }], remarkGfm],
          rehypePlugins: [rehypeSlug],
        }),
      } as PluginOption,
      react(),
    ],
    build: artifact
      ? {
          outDir: 'dist-artifact',
          assetsInlineLimit: () => true,
          cssCodeSplit: false,
          modulePreload: false,
          rolldownOptions: { output: { inlineDynamicImports: true } },
        }
      : {},
    test: {
      include: ['src/**/*.test.ts'],
    },
  };
});
