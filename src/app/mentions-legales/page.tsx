import Link from "next/link";

import { LegalPage } from "@/components/legal/legal-page";
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
        Le site est édité par {company.legalName}, {company.legalForm}, SIREN {company.siren} (SIRET{" "}
        {company.siret}), immatriculée au RCS sous le numéro {company.rcs}
        {company.address ? `, dont l'adresse est ${company.address}` : ""}.
      </p>
      <p>
        Activité : {company.activity}.
        {company.vatNumber ? (
          <>
            <br />
            Numéro de TVA intracommunautaire : {company.vatNumber}.
          </>
        ) : null}
        <br />
        Téléphone : {contact.phone} — E-mail : {contact.email}.
      </p>
      <p>Directeur de la publication : {company.publicationDirector}.</p>

      <h2>Activité réglementée</h2>
      <p>
        {regulatory.status}
        {regulatory.mandator ? `, agissant pour le compte de ${regulatory.mandator}` : ""}, immatriculé
        au registre unique des intermédiaires en assurance, banque et finance (ORIAS) sous le numéro{" "}
        {regulatory.orias}, vérifiable sur www.orias.fr.
      </p>
      <p>
        Responsabilité civile professionnelle conforme à l&apos;article L.512-6 du Code des assurances :{" "}
        {regulatory.professionalLiabilityInsurer}, contrat n° {regulatory.professionalLiabilityPolicy} —{" "}
        {regulatory.professionalLiabilityCoverage}.
      </p>
      <p>
        Autorité de contrôle : Autorité de Contrôle Prudentiel et de Résolution (ACPR), 4 place de
        Budapest, CS 92459, 75436 Paris Cedex 09.
      </p>
      <p>
        Le détail des informations réglementaires figure sur la page{" "}
        <Link href="/informations-reglementaires">Informations réglementaires</Link>.
      </p>

      {hosting.name ? (
        <>
          <h2>Hébergement</h2>
          <p>
            {[hosting.name, hosting.address, hosting.contact].filter(Boolean).join(" — ")}.
          </p>
        </>
      ) : null}

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
        Voir la <Link href="/politique-de-confidentialite">politique de confidentialité</Link> et la{" "}
        <Link href="/cookies">politique cookies</Link>.
      </p>
    </LegalPage>
  );
}
