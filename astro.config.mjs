// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { SITE, BASE } from './site.config.mjs';

export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
  vite: { plugins: [tailwindcss()] },
});
