import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { readdirSync, readFileSync, statSync, rmSync, rmdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * public/ is copied into dist/ wholesale, so a build would otherwise ship all
 * twenty font families — ~59MB across 1,046 files, in .eot/.ttf/.otf/.svg
 * formats no current browser asks for — when the active style uses two woff2.
 *
 * This prunes dist/fonts down to the files the built HTML actually references,
 * so the pruning follows real usage rather than a second copy of the style
 * config that could drift out of step with src/lib/styles.ts.
 */
function pruneUnusedFonts() {
  return {
    name: 'releasepage:prune-unused-fonts',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const fontsDir = join(out, 'fonts');
        try {
          statSync(fontsDir);
        } catch {
          return; // no fonts to prune
        }

        const walk = (d) =>
          readdirSync(d, { withFileTypes: true }).flatMap((e) =>
            e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)],
          );

        // Every /fonts/... URL named by the built HTML, CSS and JS.
        //
        // Files under dist/fonts are skipped deliberately: each Fontshare
        // package ships its own stylesheet whose relative url('../fonts/X')
        // references read as absolute /fonts/X paths that match nothing here.
        // They are pruned along with everything else, and scanning them would
        // only add phantom entries that could one day collide with a real path.
        const kept = new Set();
        for (const f of walk(out)) {
          if (!/\.(html|css|js)$/.test(f)) continue;
          if (!relative(fontsDir, f).startsWith('..')) continue;
          const src = readFileSync(f, 'utf8');
          for (const m of src.matchAll(/\/fonts\/[^"'()\s]+?\.(?:woff2|woff)/g)) {
            kept.add(decodeURIComponent(m[0]).replace(/^\/+/, ''));
          }
        }

        let removed = 0;
        let freed = 0;
        for (const file of walk(fontsDir)) {
          const rel = relative(out, file).split('\\').join('/');
          if (kept.has(rel)) continue;
          freed += statSync(file).size;
          rmSync(file);
          removed++;
        }

        // Drop directories left empty by the pruning, deepest first.
        for (const d of walk_dirs(fontsDir).sort((a, b) => b.length - a.length)) {
          try {
            rmdirSync(d);
          } catch {
            /* not empty — keep */
          }
        }

        const mb = (freed / 1024 / 1024).toFixed(1);
        logger.info(
          `pruned ${removed} unused font file(s), freed ${mb}MB — kept ${kept.size}`,
        );
      },
    },
  };
}

function walk_dirs(d) {
  return readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? [join(d, e.name), ...walk_dirs(join(d, e.name))] : [],
  );
}

// ReleasePage Astro template
// Per-client config: update `site` to the client's domain before deploy.
// Typography and palette come from ACTIVE_STYLE in src/lib/styles.ts.
export default defineConfig({
  site: 'https://example-client.releasepage.com.au',
  integrations: [
    tailwind({
      applyBaseStyles: false, // global.css owns base styles
    }),
    react(), // used only for interactive islands (see src/components/react)
    pruneUnusedFonts(),
  ],
  output: 'static',
});
