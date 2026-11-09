# Voiland Finances & Patrimoine — site web

Site commercial premium (Liquid Glass + mascotte animée + génération de leads) pour un cabinet
d'assurances de personnes, d'épargne et de retraite.

**Stack** : Next.js 16 (App Router, Turbopack, Cache Components) · TypeScript · Tailwind CSS 4 ·
Motion · Lucide · React Hook Form · Zod · Recharts.

```bash
npm install
cp .env.example .env.local   # facultatif : sans variable, tout fonctionne en mode démonstration
npm run dev                  # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

## Pages

| Route | Contenu |
|---|---|
| `/` | Hero + mascotte + cartes flottantes, choix de l'objectif, 4 univers, pourquoi Voiland, méthode, professions, FAQ, CTA |
| `/mutuelle` | Diagnostic mutuelle (profil, âge, cotisation, priorités, besoin) → lecture indicative → coordonnées |
| `/prevoyance` | Outil pédagogique prévoyance (profession, revenus, charges, garanties, besoin) → écart mensuel, autonomie |
| `/assurance-emprunteur` | Simulateur dans le hero → coût restant indicatif (cotisations constantes) + graphique → demande d'étude |
| `/assurance-vie-per` | Simulateur de projection (parcours AV / PER distincts, brut/net, euros constants, scénarios) → tunnel |
| `/contact`, `/rendez-vous` | Formulaire de contact, agenda HubSpot (chargé avec consentement) |
| Pages légales | Mentions légales, confidentialité, cookies, réclamations & médiation, informations réglementaires |
| SEO | `sitemap.xml`, `robots.txt`, `manifest`, image Open Graph, JSON-LD (InsuranceAgency, FAQPage, BreadcrumbList) |

## À compléter avant mise en ligne

1. **Données du cabinet** : `src/config/site.ts`. Chaque valeur `null` s'affiche sur le site sous la forme
   « [À compléter : …] » (raison sociale, SIREN, ORIAS, statut, médiateur, rémunération, partenaires…).
   Aucune donnée réglementaire n'a été inventée.
2. **Pages légales** : modèles à faire valider par un professionnel (bandeau d'avertissement affiché).
3. **HubSpot** : voir [`docs/HUBSPOT.md`](docs/HUBSPOT.md).
4. **Mascotte officielle** : voir [`docs/MASCOTTE-3D.md`](docs/MASCOTTE-3D.md).
5. `NEXT_PUBLIC_SITE_URL` pour les URL canoniques et le sitemap.

## Architecture

```
src/
  app/                    Routes, métadonnées, sitemap, robots, OG, API /api/leads
  components/
    mascot/               <Mascot/> + rendus svg | image | (model) + scène de parallaxe
    funnel/               Moteur de tunnel générique (étapes, progression, validation, envoi, confirmation)
    simulators/           Parcours métier (mutuelle, prévoyance, emprunteur, épargne) + graphiques lazy-loadés
    consent/              Gestion du consentement (CNIL : refus aussi simple que l'acceptation, 6 mois)
    home/ product/ legal/ layout/ ui/ seo/
  config/                 site.ts (données cabinet), products.ts (4 univers, navigation)
  content/faq.ts          FAQ (accueil + produits)
  lib/
    calc/                 Calculs purs et testables (emprunteur, épargne, prévoyance)
    lead-schema.ts        Schéma Zod partagé client/serveur
    hubspot.ts            Intégration serveur (server-only)
```

### Tunnel de conversion

`LeadFunnel` enchaîne : objectif → questions → **première information utile** → proposition
d'analyse → coordonnées (consentement recontact obligatoire, marketing facultatif et **non précoché**)
→ confirmation + prise de rendez-vous. Validation par étape, messages d'erreur reliés aux champs
(`aria-describedby`), focus déplacé sur le titre de chaque étape, réponses conservées en cas d'erreur
réseau, lien « Réserver directement » pour ne jamais bloquer le parcours.

### Principes de conformité appliqués aux simulateurs

- Aucun tarif, garantie, rendement, témoignage, partenaire ou statistique commerciale inventé.
- Emprunteur : économie **estimée avec fourchette** (contrat actuel vs assurance déléguée moyenne sur capital restant dû), présentée comme indicative. Les grilles d'hypothèses sont dans `src/config/emprunteur-hypotheses.ts` et doivent être calibrées avec les tarifs réels des partenaires.
- Épargne : hypothèses modifiables et non garanties, avertissement sur le risque de perte en capital,
  fiscalité AV et PER présentée séparément et non intégrée aux calculs.
- Prévoyance : résultats indicatifs, régime obligatoire non présumé.

## Design system

Tokens dans `src/app/globals.css` (`@theme`) : crème `#f8f5f0`, bleu nuit `#0b1a33`, pêche / corail /
rose issus de la mascotte, Geist. Utilitaires `.glass` (flou + saturation, liseré lumineux par masque,
reflet spéculaire, lumière qui suit le pointeur via `data-spotlight`), `.glass-ink`, `.btn-*`, `.field`,
`.range`. Palette des graphiques validée (séparation daltonisme et contraste ≥ 3:1) dans
`src/components/simulators/series.ts`.

## Performance & accessibilité

- Toutes les pages sont prérendues statiquement ; seule `/api/leads` est dynamique.
- Animations d'entrée du hero et des transitions de page en CSS (contenu visible avant hydratation).
- Mascotte en SVG inline animée en CSS ; parallaxe uniquement sur pointeur précis.
- Recharts chargé à la demande (`next/dynamic`) uniquement dans les simulateurs.
- `prefers-reduced-motion` respecté (CSS + `MotionConfig reducedMotion="user"`).
- Audit axe-core WCAG 2.1 AA : 0 violation sur les pages principales.
