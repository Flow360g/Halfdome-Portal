import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `--mode artifact` builds a single self-contained preview: every asset is inlined so
// scripts/inline-preview.mjs can fold the whole app into one HTML file.
export default defineConfig(({ mode }) => {
  const artifact = mode === 'artifact';
  return {
    plugins: [react()],
    base: artifact ? './' : '/',
    build: artifact
      ? {
          outDir: 'dist-artifact',
          assetsInlineLimit: Number.MAX_SAFE_INTEGER,
          cssCodeSplit: false,
          modulePreload: false,
        }
      : {},
  };
});
