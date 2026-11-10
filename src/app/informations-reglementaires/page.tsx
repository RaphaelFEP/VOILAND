import { LegalPage } from "@/components/legal/legal-page";
import { ToComplete as T } from "@/components/ui/to-complete";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Informations réglementaires",
  description: "Informations réglementaires du distributeur : statut, ORIAS, rémunération, partenaires, médiation.",
  path: "/informations-reglementaires",
});

export default function InformationsReglementairesPage() {
  const { company, regulatory } = siteConfig;
  return (
    <LegalPage title="Informations réglementaires du distributeur" href="/informations-reglementaires">
      <p>
        Ces informations vous sont communiquées en application des règles applicables à la
        distribution d&apos;assurances (Code des assurances) et, le cas échéant, à
        l&apos;intermédiation en opérations de banque et au conseil en investissements financiers.
      </p>

      <h2>Identité du distributeur</h2>
      <ul>
        <li>Dénomination : <T value={company.legalName} label="raison sociale" /></li>
        <li>Forme juridique : <T value={company.legalForm} label="forme juridique" /></li>
        <li>SIREN : <T value={company.siren} label="SIREN" /> — SIRET : <T value={company.siret} label="SIRET" /> — RCS : <T value={company.rcs} label="numéro RCS" /></li>
        <li>Activité : <T value={company.activity} label="activité" /></li>
        <li>Siège : <T value={company.address} label="adresse" /></li>
      </ul>

      <h2>Statut et immatriculation</h2>
      <ul>
        <li>Statut : <T value={regulatory.status} label="statut" /></li>
        <li>Intermédiaire mandant : <T value={regulatory.mandator} label="nom, statut et n° ORIAS du mandant" /></li>
        <li>Numéro ORIAS : <T value={regulatory.orias} label="numéro ORIAS" />, inscription en qualité de MIA depuis le{" "}<T value={regulatory.oriasSince} label="date d'inscription" /> — vérifiable sur www.orias.fr</li>
        <li>Autres statuts : <T value={regulatory.otherStatuses} label="IOBSP, CIF… le cas échéant" /></li>
        <li>Association professionnelle (CIF) : <T value={regulatory.cifAssociation} label="association agréée, le cas échéant" /></li>
      </ul>

      <h2>Garanties professionnelles</h2>
      <ul>
        <li>Responsabilité civile professionnelle : <T value={regulatory.professionalLiabilityInsurer} label="assureur" /> — contrat n° <T value={regulatory.professionalLiabilityPolicy} label="numéro de contrat" /></li>
        <li>Montants et territoire : <T value={regulatory.professionalLiabilityCoverage} label="montants de garantie" /></li>
        <li>Garantie financière : <T value={regulatory.financialGuarantee} label="garant, le cas échéant (non requise en l'absence de maniement de fonds)" /></li>
      </ul>

      <h2>Mode d&apos;exercice et partenaires</h2>
      <p>
        Nature de l&apos;analyse et liens avec les organismes d&apos;assurance :{" "}
        <T value={regulatory.partners} label="analyse fondée sur un nombre suffisant de contrats / obligation contractuelle de travailler avec une ou plusieurs entreprises — liste des partenaires sur demande ou ci-dessous" />
      </p>
      <p>
        Liens capitalistiques : <T value={regulatory.capitalLinks} label="détention > 10 % (dans un sens ou dans l'autre) avec une entreprise d'assurance — ou mention de l'absence de tels liens" />
      </p>

      <h2>Rémunération</h2>
      <p>
        <T value={regulatory.remuneration} label="nature de la rémunération : commission incluse dans la prime, honoraires payés par le client, autre type de rémunération ou combinaison" />
      </p>
      <p>
        Les modalités précises de rémunération applicables à chaque recommandation vous sont
        communiquées avant la conclusion du contrat.
      </p>

      <h2>Réclamations, médiation, contrôle</h2>
      <p>
        Voir la page <a href="/reclamations-mediation">Réclamations et médiation</a>. Médiateur
        compétent : <T value={regulatory.mediator} label="médiateur compétent" />. Autorité de contrôle :
        ACPR, 4 place de Budapest, CS 92459, 75436 Paris Cedex 09.
      </p>
    </LegalPage>
  );
}
