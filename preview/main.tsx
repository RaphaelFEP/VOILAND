import { useEffect, type ComponentType } from "react";
import { createRoot } from "react-dom/client";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";

import * as Home from "@/app/page";
import * as Mutuelle from "@/app/mutuelle/page";
import * as Prevoyance from "@/app/prevoyance/page";
import * as Emprunteur from "@/app/assurance-emprunteur/page";
import * as Epargne from "@/app/assurance-vie-per/page";
import * as Contact from "@/app/contact/page";
import * as RendezVous from "@/app/rendez-vous/page";
import * as Mentions from "@/app/mentions-legales/page";
import * as Confidentialite from "@/app/politique-de-confidentialite/page";
import * as Cookies from "@/app/cookies/page";
import * as Reclamations from "@/app/reclamations-mediation/page";
import * as Reglementaire from "@/app/informations-reglementaires/page";
import NotFound from "@/app/not-found";

import { go, useRouterState } from "./shims/router";

type PageModule = { default: ComponentType; metadata?: { title?: unknown } };

const routes: Record<string, PageModule> = {
  "/": Home,
  "/mutuelle": Mutuelle,
  "/prevoyance": Prevoyance,
  "/assurance-emprunteur": Emprunteur,
  "/assurance-vie-per": Epargne,
  "/contact": Contact,
  "/rendez-vous": RendezVous,
  "/mentions-legales": Mentions,
  "/politique-de-confidentialite": Confidentialite,
  "/cookies": Cookies,
  "/reclamations-mediation": Reclamations,
  "/informations-reglementaires": Reglementaire,
};

// L'API serveur n'existe pas dans la prévisualisation : réponse de démonstration.
const realFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.endsWith("/api/leads")) {
    await new Promise((r) => setTimeout(r, 700));
    const ref = `VFP-${Date.now().toString(36).toUpperCase()}-DEMO`;
    return new Response(JSON.stringify({ ok: true, mode: "demo", reference: ref }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return realFetch(input, init);
};

function App() {
  const { path, anchor, nonce } = useRouterState();
  const mod = routes[path];
  const Page = mod?.default ?? NotFound;

  useEffect(() => {
    const t = mod?.metadata?.title;
    const name = typeof t === "string" ? t : null;
    document.title = name ? `${name} | Voiland Finances & Patrimoine` : "Voiland Finances & Patrimoine";
    if (anchor) {
      requestAnimationFrame(() =>
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } else {
      window.scrollTo(0, 0);
    }
  }, [path, anchor, nonce, mod]);

  // Liens <a href="/…"> hors composant Link
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as Element).closest?.("a");
      const href = a?.getAttribute("href");
      if (!a || !href || !href.startsWith("/") || a.target === "_blank") return;
      e.preventDefault();
      go(href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <a
        href="#contenu"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("contenu")?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Aller au contenu
      </a>
      <div aria-hidden className="ambient-bg" />
      <Providers>
        <SiteHeader />
        <main id="contenu" className="flex-1" tabIndex={-1}>
          <div key={`${path}-${nonce}`} className="page-in">
            <Page />
          </div>
        </main>
        <SiteFooter />
      </Providers>
    </>
  );
}

createRoot(document.getElementById("voiland-root")!).render(<App />);
