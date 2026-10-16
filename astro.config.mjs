// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO(domain): replace with the real domain before launch.
// It drives the canonical URL, Open Graph URLs and sitemap.xml.
const SITE = process.env.SITE_URL ?? 'https://santaandsol.example';

export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
