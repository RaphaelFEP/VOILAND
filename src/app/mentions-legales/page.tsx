import { LegalPage } from "@/components/legal/legal-page";
import { ToComplete as T } from "@/components/ui/to-complete";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Mentions légales",
  description: "Mentions légales du site Voiland Finances & Patrimoine.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  const { company, contact, regulatory, hosting } = siteConfig;
  return (
    <LegalPage title="Mentions légales" href="/mentions-legales">
      <h2>Éditeur du site</h2>
      <p>
        Le site est édité par <T value={company.legalName} label="raison sociale" />,{" "}
        <T value={company.legalForm} label="forme juridique" />, SIREN{" "}
        <T value={company.siren} label="SIREN" /> (SIRET <T value={company.siret} label="SIRET" />), dont
        l&apos;adresse est <T value={company.address} label="adresse" />.
      </p>
      <p>
        Activité : <T value={company.activity} label="activité" />.
        <br />
        Numéro de TVA intracommunautaire : <T value={company.vatNumber} label="numéro de TVA" />.
        <br />
        Téléphone : <T value={contact.phone} label="téléphone" /> — E-mail :{" "}
        <T value={contact.email} label="e-mail" />.
      </p>
      <p>
        Directeur de la publication : <T value={company.publicationDirector} label="directeur de la publication" />.
      </p>

      <h2>Activité réglementée</h2>
      <p>
        <T value={regulatory.status} label="statut réglementaire" />, agissant pour le compte de{" "}
        <T value={regulatory.mandator} label="intermédiaire mandant (nom, statut, n° ORIAS)" />, immatriculé au registre unique
        des intermédiaires en assurance, banque et finance (ORIAS) sous le numéro{" "}
        <T value={regulatory.orias} label="numéro ORIAS" />, vérifiable sur www.orias.fr.
      </p>
      <p>
        Responsabilité civile professionnelle conforme à l&apos;article L.512-6
        du Code des assurances : <T value={regulatory.professionalLiabilityInsurer} label="assureur RC Pro" />,
        contrat n° <T value={regulatory.professionalLiabilityPolicy} label="numéro de contrat" /> —{" "}
        <T value={regulatory.professionalLiabilityCoverage} label="montants de garantie" />.
      </p>
      <p>
        Autorité de contrôle : Autorité de Contrôle Prudentiel et de Résolution (ACPR), 4 place de
        Budapest, CS 92459, 75436 Paris Cedex 09.
      </p>
      <p>
        Le détail des informations réglementaires figure sur la page{" "}
        <a href="/informations-reglementaires">Informations réglementaires</a>.
      </p>

      <h2>Hébergement</h2>
      <p>
        <T value={hosting.name} label="nom de l'hébergeur" /> — <T value={hosting.address} label="adresse de l'hébergeur" /> —{" "}
        <T value={hosting.contact} label="contact de l'hébergeur" />.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, éléments graphiques, mascotte, logo,
        simulateurs) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou
        représentation, totale ou partielle, sans autorisation préalable écrite est interdite.
      </p>

      <h2>Simulateurs et informations</h2>
      <p>
        Les simulateurs et diagnostics proposés sur ce site sont fournis à titre indicatif et
        pédagogique. Ils reposent sur les informations saisies par l&apos;utilisateur et sur des
        hypothèses explicitement présentées. Ils ne constituent ni un conseil, ni une offre de
        contrat, ni un engagement de résultat.
      </p>

      <h2>Données personnelles et cookies</h2>
      <p>
        Voir la <a href="/politique-de-confidentialite">politique de confidentialité</a> et la{" "}
        <a href="/cookies">politique cookies</a>.
      </p>
    </LegalPage>
  );
}
