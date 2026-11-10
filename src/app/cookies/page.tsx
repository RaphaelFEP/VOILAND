import { ConsentPreferencesButton } from "@/components/consent/consent-banner";
import { LegalPage } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Politique cookies",
  description: "Traceurs utilisés sur le site Voiland Finances & Patrimoine et gestion de vos choix.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage title="Politique cookies" href="/cookies">
      <h2>Notre approche</h2>
      <p>
        Aucun traceur non essentiel n&apos;est déposé sans votre accord. Refuser est aussi simple
        qu&apos;accepter, et vous pouvez modifier vos choix à tout moment. Votre choix est conservé
        6 mois, après quoi il vous est à nouveau demandé.
      </p>
      <p>
        <ConsentPreferencesButton className="btn btn-glass" />
      </p>

      <h2>Stockages strictement nécessaires (sans consentement)</h2>
      <ul>
        <li>
          <strong>voiland-consent</strong> (stockage local du navigateur) : mémorise vos choix en matière
          de cookies — 6 mois.
        </li>
        <li>
          <strong>voiland-attribution</strong> (stockage de session) : mémorise la source de votre visite
          (paramètres de campagne, site référent) pendant la session ; transmis uniquement si vous
          envoyez un formulaire. <em>Qualification à valider avec votre conseil.</em>
        </li>
      </ul>

      <h2>Traceurs soumis à consentement</h2>
      <ul>
        <li>
          <strong>Services tiers — agenda Calendly</strong> : affichage du module de prise de
          rendez-vous intégré, susceptible de déposer des traceurs Calendly.
        </li>
        <li>
          <strong>Suivi de la relation commerciale — HubSpot</strong> (cookies <code>hubspotutk</code>,{" "}
          <code>__hstc</code>, <code>__hssc</code>…) : mesure des pages consultées et rattachement de la
          visite à votre demande.
        </li>
      </ul>
      <p>
        Ces traceurs ne sont actifs que s&apos;ils sont configurés sur le site et si vous les avez
        acceptés. La liste exacte et les durées de vie doivent être tenues à jour selon la
        configuration réelle.
      </p>
    </LegalPage>
  );
}
