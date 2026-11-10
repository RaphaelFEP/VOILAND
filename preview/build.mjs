// Construit une prévisualisation statique monofichier (preview/dist/voiland.html)
// à partir des vrais composants du site. Usage : npm run preview:static
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const shim = (f) => path.join(root, "preview/shims", f);
mkdirSync(path.join(root, "preview/dist"), { recursive: true });

execSync(
  `npx @tailwindcss/cli -i src/app/globals.css -o preview/dist/site.css --minify`,
  { cwd: root, stdio: "inherit" },
);

const result = await build({
  entryPoints: [path.join(root, "preview/main.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  write: false,
  jsx: "automatic",
  logLevel: "warning",
  logOverride: { "unsupported-directive": "silent" },
  alias: {
    "@": path.join(root, "src"),
    "next/link": shim("link.tsx"),
    "next/navigation": shim("navigation.ts"),
    "next/dynamic": shim("dynamic.tsx"),
    "next/image": shim("image.tsx"),
    "next/script": shim("script.tsx"),
    "server-only": shim("empty.ts"),
  },
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_CONSENT_DEMO": '"1"',
    "process.env.NEXT_PUBLIC_SITE_URL": '"https://www.exemple.fr"',
    "process.env.NEXT_PUBLIC_HUBSPOT_MEETINGS_URL": '""',
    "process.env.NEXT_PUBLIC_BOOKING_URL": '""',
    "process.env.NEXT_PUBLIC_DISABLE_EMBED": '"1"',
    "process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID": '""',
    "process.env.NEXT_PUBLIC_HUBSPOT_REGION": '""',
    "process.env.NEXT_PUBLIC_MASCOT_RENDERER": "undefined",
  },
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = readFileSync(path.join(root, "preview/dist/site.css"), "utf8").replace(/<\/style/gi, "<\\/style");

const html = `<title>Voiland Finances & Patrimoine</title>
<meta name="description" content="Prévisualisation du site Voiland Finances & Patrimoine">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
<style>:root{--font-geist-sans:"Geist";--font-geist-mono:"Geist Mono";}body{min-height:100%;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased;font-family:"Geist",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;background:#f8f5f0;color:#0b1a33}#voiland-root{display:flex;flex-direction:column;min-height:100vh}</style>
<style>${css}</style>
<div id="voiland-root"></div>
<script>${js}</script>
`;
writeFileSync(path.join(root, "preview/dist/voiland.html"), html);
console.log(`preview/dist/voiland.html — ${(html.length / 1024).toFixed(0)} Ko`);
