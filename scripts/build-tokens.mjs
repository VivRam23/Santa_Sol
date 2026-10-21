// Generates src/styles/tokens.css from design/tokens.json (Iris's Santa & Sol design system).
// No dependencies. Run with `npm run tokens` (also runs before dev and build).
//
// Tiers:
//   primitives  – raw colours (red-600, haze, ink …), spacing, radius, shadow
//   semantics   – surface, text, action … (aliases to primitives, switch in dark mode)
// Components use semantic tokens only, through the Tailwind theme in global.css.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'design/tokens.json');
const out = resolve(root, 'src/styles/tokens.css');

const tokens = JSON.parse(readFileSync(src, 'utf8'));
const themes = tokens.color.themes.map((t) => t.id); // ['light', 'dark']
const [first, ...rest] = themes;

const ref = (v) =>
  typeof v === 'string' ? v.replace(/^\{([A-Za-z0-9_.-]+)\}$/, 'var(--ss-$1)') : v;

const light = [];
const dark = [];

for (const t of tokens.color.tokens) {
  if (typeof t.value === 'string') {
    light.push(`  --ss-${t.name}: ${ref(t.value)}; /* ${t.usage} */`);
  } else {
    light.push(`  --ss-${t.name}: ${ref(t.value[first])}; /* ${t.usage} */`);
    for (const theme of rest) {
      if (t.value[theme] && t.value[theme] !== t.value[first]) {
        dark.push(`  --ss-${t.name}: ${ref(t.value[theme])};`);
      }
    }
  }
}

for (const family of ['spacing', 'radius', 'shadow']) {
  for (const t of tokens[family]?.tokens ?? []) {
    light.push(`  --ss-${t.name}: ${t.value}; /* ${t.usage} */`);
  }
}

for (const [name, stack] of Object.entries(tokens.type.families)) {
  light.push(`  --ss-font-${name}: ${stack};`);
}

const css = `/* ${tokens.name} — generated from design/tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */
/* Source: ${tokens.meta?.source ?? 'design system'} */

:root {
${light.join('\n')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${dark.map((l) => '  ' + l).join('\n')}
  }
}

:root[data-theme='dark'] {
${dark.join('\n')}
}
`;

writeFileSync(out, css);
console.log(`tokens.css written (${light.length} tokens, ${dark.length} dark overrides)`);
