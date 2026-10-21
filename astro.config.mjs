// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The live domain. It drives the canonical URL, Open Graph URLs and sitemap.xml.
// Override with SITE_URL for a staging address.
const SITE = process.env.SITE_URL ?? 'https://santasol.fun';

export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
