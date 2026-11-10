import Link from "next/link";

import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Informations réglementaires",
  description: "Informations réglementaires du distributeur : statut, ORIAS, RC professionnelle, rémunération, médiation.",
  path: "/informations-reglementaires",
});

export default function InformationsReglementairesPage() {
  const { company, regulatory, advisor } = siteConfig;
  return (
    <LegalPage title="Informations réglementaires du distributeur" href="/informations-reglementaires">
      <p>
        Ces informations vous sont communiquées en application des règles applicables à la
        distribution d&apos;assurances (Code des assurances).
      </p>

      <h2>Identité du distributeur</h2>
      <ul>
        <li>Dénomination : {company.legalName}</li>
        <li>Forme juridique : {company.legalForm}</li>
        <li>
          SIREN : {company.siren} — SIRET : {company.siret} — RCS : {company.rcs}
        </li>
        <li>Activité : {company.activity}</li>
        {company.address ? <li>Adresse : {company.address}</li> : null}
      </ul>

      <h2>Statut et immatriculation</h2>
      <ul>
        <li>Statut : {regulatory.status}</li>
        {regulatory.mandator ? <li>Intermédiaire mandant : {regulatory.mandator}</li> : null}
        <li>
          Numéro ORIAS : {regulatory.orias}
          {regulatory.oriasSince ? `, inscription en qualité de MIA depuis le ${regulatory.oriasSince}` : ""} —
          vérifiable sur www.orias.fr
        </li>
        {regulatory.otherStatuses ? <li>Autres statuts : {regulatory.otherStatuses}</li> : null}
        {regulatory.cifAssociation ? <li>Association professionnelle : {regulatory.cifAssociation}</li> : null}
      </ul>

      <h2>Garanties professionnelles</h2>
      <ul>
        <li>
          Responsabilité civile professionnelle : {regulatory.professionalLiabilityInsurer} — contrat n°{" "}
          {regulatory.professionalLiabilityPolicy}
        </li>
        <li>Montants et territoire : {regulatory.professionalLiabilityCoverage}</li>
        {regulatory.financialGuarantee ? <li>Garantie financière : {regulatory.financialGuarantee}</li> : null}
      </ul>

      <h2>Mode d&apos;exercice et partenaires</h2>
      <p>
        {regulatory.partners ??
          `En qualité de mandataire d'intermédiaire d'assurance, ${advisor.name} agit au nom et pour le compte de son intermédiaire mandant. La liste des entreprises d'assurance partenaires vous est communiquée sur simple demande.`}
      </p>
      {regulatory.capitalLinks ? <p>Liens capitalistiques : {regulatory.capitalLinks}</p> : null}

      <h2>Rémunération</h2>
      {regulatory.remuneration ? <p>{regulatory.remuneration}</p> : null}
      <p>
        La nature et les modalités de la rémunération perçue au titre de chaque contrat vous sont
        communiquées avant sa conclusion.
      </p>

      <h2>Réclamations, médiation, contrôle</h2>
      <p>
        Voir la page <Link href="/reclamations-mediation">Réclamations et médiation</Link>. Autorité de
        contrôle : ACPR, 4 place de Budapest, CS 92459, 75436 Paris Cedex 09.
      </p>
    </LegalPage>
  );
}
