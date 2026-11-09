# Intégration HubSpot

L'envoi des demandes est réalisé **côté serveur** par la route `POST /api/leads`
(`src/app/api/leads/route.ts` → `src/lib/hubspot.ts`). Aucune clé n'est exposée au navigateur.

## Modes de fonctionnement

| Mode | Activation | Comportement |
|---|---|---|
| **Démonstration** (défaut) | aucune variable | La demande est validée, rien n'est transmis. Un log serveur sans donnée personnelle est émis et l'écran de confirmation affiche « Mode démonstration ». |
| **CRM** (recommandé) | `HUBSPOT_ACCESS_TOKEN` | Création ou mise à jour du contact (dédoublonnage par e-mail) + note rattachée au contact contenant le diagnostic. |
| **Formulaires** | `HUBSPOT_PORTAL_ID` + `HUBSPOT_FORM_GUID` | Soumission à un formulaire HubSpot (API Forms v3), avec consentements RGPD natifs et rattachement du cookie `hubspotutk` si présent. |

## Activer le mode CRM

1. HubSpot → *Paramètres → Intégrations → Applications privées* → créer une application.
2. Scopes : `crm.objects.contacts.read`, `crm.objects.contacts.write`.
3. Copier le jeton dans `HUBSPOT_ACCESS_TOKEN` (variable serveur de l'hébergeur, jamais `NEXT_PUBLIC_`).
4. Créer les propriétés personnalisées ci-dessous (*Paramètres → Propriétés → Contact*, groupe « Voiland »).
   Tant qu'elles n'existent pas, l'intégration se replie automatiquement sur les propriétés standard
   (nom, prénom, e-mail, téléphone) et le diagnostic reste disponible dans la note.

### Propriétés envoyées

| Propriété | Type HubSpot | Contenu |
|---|---|---|
| `firstname`, `lastname`, `email`, `phone` | standard | Coordonnées |
| `hs_lead_status` | standard | `NEW` à la création (statut du prospect) |
| `lifecyclestage` | standard | `lead` à la création |
| `voiland_produit` | Texte | Produit demandé |
| `voiland_objectif` | Texte | Objectif déclaré |
| `voiland_source_trafic` | Texte | Source lisible (Google Ads, recherche naturelle, référent, direct…) |
| `voiland_utm_source` / `_medium` / `_campaign` / `_term` / `_content` | Texte | Paramètres UTM (première visite de la session) |
| `voiland_page_conversion` | Texte | URL de la page d'envoi |
| `voiland_creneau_rappel` | Texte | Créneau de rappel souhaité |
| `voiland_diagnostic` | Texte multiligne | Réponses pertinentes du diagnostic |
| `voiland_consentement_marketing` | Case à cocher unique (true/false) | Consentement aux communications |
| `voiland_date_demande` | Date et heure | Horodatage de la demande |
| `voiland_reference` | Texte | Référence affichée au prospect (VFP-…) |

La date de création du contact (`createdate`) est gérée nativement par HubSpot.
Le préfixe `voiland_` est modifiable via `HUBSPOT_PROPERTY_PREFIX`.

> Le consentement marketing est conservé comme propriété. Pour piloter les statuts d'abonnement
> officiels HubSpot, utilisez le mode Formulaires avec `HUBSPOT_SUBSCRIPTION_TYPE_ID`, ou l'API
> *Communication Preferences*.

## Prise de rendez-vous

`NEXT_PUBLIC_HUBSPOT_MEETINGS_URL` (ex. `https://meetings-eu1.hubspot.com/votre-lien`) :

- page `/rendez-vous` : agenda intégré, chargé **uniquement** après action / consentement « services tiers » ;
- écran de confirmation des tunnels : bouton « Choisir un créneau » pré-rempli (prénom, nom, e-mail).

Sans cette variable, un mode démonstration explicite est affiché avec une alternative « Être rappelé(e) ».

## Code de suivi HubSpot

`NEXT_PUBLIC_HUBSPOT_PORTAL_ID` (+ `NEXT_PUBLIC_HUBSPOT_REGION=eu1` le cas échéant) :
le script n'est chargé qu'après consentement « Suivi de la relation commerciale ». Le retrait du
consentement recharge la page pour le décharger.

## Anti-spam et sécurité

- Validation Zod côté serveur (schéma partagé `src/lib/lead-schema.ts`).
- Pot de miel (`website`) et délai minimal de remplissage : rejet silencieux des robots.
- Contrôle d'origine (même domaine) et limitation de débit par IP (5 demandes / 10 min, en mémoire).
  En production multi-instances, remplacer `src/lib/rate-limit.ts` par un stockage partagé.
- Pour un niveau supérieur, ajouter Cloudflare Turnstile ou hCaptcha (vérification serveur dans la route).
