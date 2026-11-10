export type ProductId = "mutuelle" | "prevoyance" | "emprunteur" | "epargne";

export type Product = {
  id: ProductId;
  href: string;
  navLabel: string;
  universe: string;
  cardLabel: string;
  title: string;
  hook: string;
  subtitle: string;
  cta: string;
  targets: string[];
  analysis: string[];
  seoTitle: string;
  seoDescription: string;
};

export const products: Record<ProductId, Product> = {
  mutuelle: {
    id: "mutuelle",
    href: "/mutuelle",
    navLabel: "Mutuelle",
    universe: "Santé",
    cardLabel: "Mutuelle santé",
    title: "Votre mutuelle est-elle vraiment adaptée à vos besoins ?",
    hook: "Des remboursements alignés sur vos vrais postes de dépenses.",
    subtitle:
      "Optique, dentaire, hospitalisation, dépassements d'honoraires : nous comparons votre couverture actuelle à vos besoins réels pour vous aider à payer le juste prix.",
    cta: "Comparer ma couverture",
    targets: [
      "Particuliers",
      "Familles",
      "Travailleurs indépendants",
      "Professions libérales",
      "Seniors",
    ],
    analysis: [
      "Niveaux de remboursement poste par poste",
      "Adéquation avec vos priorités de santé",
      "Cotisation au regard des garanties",
      "Conditions de changement de contrat",
    ],
    seoTitle: "Mutuelle santé : comparez et optimisez votre couverture",
    seoDescription:
      "Diagnostic mutuelle gratuit : vérifiez si votre complémentaire santé correspond à vos besoins (optique, dentaire, hospitalisation) pour particuliers, familles, indépendants et seniors.",
  },
  prevoyance: {
    id: "prevoyance",
    href: "/prevoyance",
    navLabel: "Prévoyance",
    universe: "Prévoyance",
    cardLabel: "Prévoyance",
    title:
      "En cas d'arrêt de travail, combien de temps vos revenus sont-ils protégés ?",
    hook: "Maintenir vos revenus et couvrir vos charges en cas d'arrêt.",
    subtitle:
      "Indépendants, dirigeants et professions libérales : évaluez l'écart entre vos charges et vos garanties actuelles, puis faites vérifier votre protection.",
    cta: "Vérifier ma protection",
    targets: [
      "Indépendants",
      "Dirigeants",
      "Kinésithérapeutes",
      "Médecins",
      "Avocats",
      "Autres professions libérales",
    ],
    analysis: [
      "Indemnités journalières et délais de franchise",
      "Couverture de vos frais professionnels",
      "Invalidité et barème applicable à votre métier",
      "Protection de vos proches (décès)",
    ],
    seoTitle: "Prévoyance indépendants et professions libérales",
    seoDescription:
      "Évaluez votre protection en cas d'arrêt de travail : indemnités journalières, frais professionnels, invalidité. Outil pédagogique pour indépendants, dirigeants et professions libérales.",
  },
  emprunteur: {
    id: "emprunteur",
    href: "/assurance-emprunteur",
    navLabel: "Assurance emprunteur",
    universe: "Assurance emprunteur",
    cardLabel: "Assurance emprunteur",
    title: "Et si votre assurance de crédit vous coûtait trop cher ?",
    hook: "Estimer en une minute l'économie possible sur votre assurance de prêt.",
    subtitle:
      "Estimez en moins d'une minute l'économie possible en changeant d'assurance de prêt, puis faites-la vérifier gratuitement sur vos véritables échéances.",
    cta: "Estimer mon économie",
    targets: [
      "Propriétaires de leur résidence principale",
      "Investisseurs locatifs",
      "Professionnels",
      "Primo-accédants",
    ],
    analysis: [
      "Économie réelle sur vos véritables échéances",
      "Équivalence des garanties exigées par la banque",
      "Quotités et garanties (décès, PTIA, ITT, IPT, IPP)",
      "Démarches de changement de contrat",
    ],
    seoTitle: "Assurance emprunteur : estimez votre économie en 1 minute",
    seoDescription:
      "Combien pourriez-vous économiser sur votre assurance de prêt ? Estimation immédiate avec fourchette, puis vérification gratuite à garanties équivalentes.",
  },
  epargne: {
    id: "epargne",
    href: "/assurance-vie-per",
    navLabel: "Assurance-vie & PER",
    universe: "Épargne & Retraite",
    cardLabel: "Épargne & Retraite",
    title: "Votre épargne suit-elle la bonne trajectoire ?",
    hook: "Projeter votre capital et préparer votre retraite.",
    subtitle:
      "Assurance-vie ou Plan d'Épargne Retraite : visualisez l'effet du temps et des intérêts composés sur votre épargne, puis faites-la analyser.",
    cta: "Faire analyser mon épargne",
    targets: [
      "Épargnants",
      "Futurs retraités",
      "Professions libérales",
      "Dirigeants",
      "Familles",
    ],
    analysis: [
      "Frais de vos contrats existants",
      "Allocation et niveau de risque",
      "Cohérence avec votre horizon de placement",
      "Cadre fiscal applicable à votre situation",
    ],
    seoTitle: "Assurance-vie et PER : simulez la trajectoire de votre épargne",
    seoDescription:
      "Calculatrice d'épargne : capital initial, épargne mensuelle, horizon et taux d'intérêt. Parcours distincts assurance-vie et PER, à titre illustratif.",
  },
};

export const productList: Product[] = [
  products.mutuelle,
  products.prevoyance,
  products.emprunteur,
  products.epargne,
];

export const mainNav = [
  { href: "/", label: "Accueil" },
  ...productList.map((p) => ({ href: p.href, label: p.navLabel })),
  { href: "/contact", label: "Contact" },
];

export const legalNav = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
  { href: "/reclamations-mediation", label: "Réclamations & médiation" },
  {
    href: "/informations-reglementaires",
    label: "Informations réglementaires",
  },
];
