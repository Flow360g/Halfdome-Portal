import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `--mode artifact` builds a self-contained preview: every asset is inlined so
// scripts/inline-preview.mjs can fold the whole app into one HTML page.
export default defineConfig(({ mode }) => {
  const artifact = mode === 'artifact';
  return {
    plugins: [react()],
    build: artifact
      ? {
          outDir: 'dist-artifact',
          assetsInlineLimit: () => true,
          cssCodeSplit: false,
          modulePreload: false,
        }
      : {},
  };
});
