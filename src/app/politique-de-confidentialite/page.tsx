import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description: "Comment Voiland Finances & Patrimoine collecte et protège vos données personnelles.",
  path: "/politique-de-confidentialite",
});

export default function ConfidentialitePage() {
  const { company, dpo, contact } = siteConfig;
  return (
    <LegalPage title="Politique de confidentialité" href="/politique-de-confidentialite">
      <h2>Responsable du traitement</h2>
      <p>
        {company.legalName}{company.address ? `, ${company.address}` : ""}.
        Contact pour toute question relative à vos données : {dpo.contact ?? contact.email}.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>Identité et coordonnées : prénom, nom, adresse e-mail, téléphone, créneau de rappel souhaité.</li>
        <li>Réponses aux diagnostics et simulateurs que vous choisissez de transmettre (situation professionnelle, revenus, charges, contrats, objectifs).</li>
        <li>Données de provenance : paramètres de campagne (UTM), site référent, page d&apos;arrivée et page de conversion.</li>
        <li>Vos choix en matière de consentement.</li>
      </ul>
      <p>
        Les simulateurs fonctionnent dans votre navigateur : vos saisies ne nous sont transmises que si
        vous envoyez volontairement le formulaire de demande.
      </p>

      <h2>Finalités et bases légales</h2>
      <ul>
        <li>Traiter votre demande et vous recontacter : mesures précontractuelles prises à votre demande.</li>
        <li>Gérer la relation commerciale et le suivi de votre dossier : intérêt légitime du cabinet / exécution du contrat.</li>
        <li>Vous adresser des informations et conseils : consentement, retirable à tout moment.</li>
        <li>Respecter nos obligations réglementaires (devoir de conseil, lutte contre le blanchiment, réclamations) : obligation légale.</li>
        <li>Sécuriser le site et prévenir les abus (anti-spam) : intérêt légitime.</li>
      </ul>

      <h2>Destinataires</h2>
      <p>
        Les données sont destinées aux collaborateurs habilités du cabinet. La prise de rendez-vous
        en ligne s&apos;effectue via Calendly, qui traite les informations saisies lors de la
        réservation. Elles peuvent être hébergées
        dans un outil de gestion de la relation client agissant en qualité de sous-traitant.
        Lorsque cela est nécessaire à l&apos;étude de votre dossier et avec votre accord, certaines
        données peuvent être transmises aux organismes d&apos;assurance consultés.
      </p>
      <p>
        Si un prestataire est amené à traiter des données hors de l&apos;Union européenne, ces
        transferts sont encadrés par des garanties appropriées, notamment les clauses contractuelles
        types de la Commission européenne.
      </p>

      <h2>Durées de conservation</h2>
      <p>
        Les données des prospects sans suite sont conservées au maximum trois ans à compter du
        dernier contact. Celles des clients sont conservées pendant la durée de la relation
        contractuelle, augmentée des délais de prescription légaux et réglementaires.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement, de limitation,
        d&apos;opposition et de portabilité, ainsi que du droit de définir des directives relatives au
        sort de vos données après votre décès. Vous pouvez retirer votre consentement à tout moment.
        Pour les exercer : {dpo.contact ?? contact.email}.
      </p>
      <p>
        Vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr). Vous pouvez également
        vous inscrire sur la liste d&apos;opposition au démarchage téléphonique Bloctel.
      </p>

      <h2>Sécurité</h2>
      <p>
        Les échanges avec le site sont chiffrés (HTTPS). Les clés d&apos;accès au CRM ne sont jamais
        exposées dans votre navigateur : la transmission est réalisée côté serveur.
      </p>
    </LegalPage>
  );
}
