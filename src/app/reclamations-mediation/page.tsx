import { LegalPage } from "@/components/legal/legal-page";
import { ToComplete as T } from "@/components/ui/to-complete";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Réclamations et médiation",
  description: "Procédure de traitement des réclamations et coordonnées du médiateur compétent.",
  path: "/reclamations-mediation",
});

export default function ReclamationsPage() {
  const { contact, regulatory } = siteConfig;
  return (
    <LegalPage title="Réclamations et médiation" href="/reclamations-mediation">
      <h2>Adresser une réclamation</h2>
      <p>
        Une réclamation est l&apos;expression d&apos;un mécontentement envers le cabinet. Vous pouvez
        nous l&apos;adresser :
      </p>
      <ul>
        <li>par e-mail : <T value={contact.complaintsEmail} label="e-mail dédié aux réclamations" /> ;</li>
        <li>par courrier : <T value={contact.complaintsAddress} label="adresse postale" /> ;</li>
        <li>par téléphone : <T value={contact.phone} label="téléphone" />.</li>
      </ul>

      <h2>Délais de traitement</h2>
      <p>
        Nous accusons réception de votre réclamation dans un délai maximal de dix jours ouvrables à
        compter de son envoi (sauf si la réponse elle-même vous est apportée dans ce délai) et nous y
        répondons dans un délai maximal de deux mois à compter de son envoi, conformément à la
        recommandation de l&apos;ACPR relative au traitement des réclamations.{" "}
        <em>À vérifier au regard des textes en vigueur.</em>
      </p>
      <p>
        Si votre réclamation porte sur un contrat, elle peut également être adressée au service
        réclamations de l&apos;organisme d&apos;assurance concerné, dont les coordonnées figurent dans
        vos documents contractuels.
      </p>

      <h2>Médiation</h2>
      <p>
        Si la réponse apportée ne vous satisfait pas, ou en l&apos;absence de réponse dans le délai de
        deux mois, vous pouvez saisir gratuitement le médiateur compétent :
      </p>
      <p>
        <T value={regulatory.mediator} label="nom et coordonnées du médiateur compétent" />
        {regulatory.mediatorUrl ? (
          <>
            {" "}— <a href={regulatory.mediatorUrl}>{regulatory.mediatorUrl}</a>
          </>
        ) : null}
      </p>
      <p>
        Vous pouvez également utiliser la plateforme européenne de règlement en ligne des litiges
        lorsque le contrat a été conclu en ligne. <em>À vérifier selon la réglementation en vigueur.</em>
      </p>

      <h2>Autorité de contrôle</h2>
      <p>
        Autorité de Contrôle Prudentiel et de Résolution (ACPR), 4 place de Budapest, CS 92459,
        75436 Paris Cedex 09.
      </p>
    </LegalPage>
  );
}
