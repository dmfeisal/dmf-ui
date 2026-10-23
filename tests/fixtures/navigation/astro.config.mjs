import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  root: fileURLToPath(new URL('../../../', import.meta.url)),
  srcDir: fileURLToPath(new URL('./src/', import.meta.url)),
  outDir: fileURLToPath(new URL('../../../.dmf-ui-test-results/navigation-dist/', import.meta.url)),
  cacheDir: fileURLToPath(new URL('../../../.dmf-ui-test-results/navigation-cache/', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public/', import.meta.url)),
  output: 'static', vite: { plugins: [tailwindcss()] },
});
