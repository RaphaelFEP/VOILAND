import type { ProductId } from "@/config/products";

export type FaqItem = { question: string; answer: string };

export const homeFaq: FaqItem[] = [
  {
    question: "Comment se déroule un premier échange avec le cabinet ?",
    answer:
      "Vous pouvez commencer par l'un de nos diagnostics en ligne ou réserver directement un créneau. Lors du premier échange, je fais le point sur votre situation personnelle et professionnelle, vos contrats en cours et vos objectifs, avant de vous proposer une analyse détaillée.",
  },
  {
    question: "Comment le cabinet est-il rémunéré ?",
    answer:
      "Les modalités de rémunération du cabinet (commissions versées par les organismes d'assurance, honoraires ou combinaison des deux) vous sont communiquées avant toute recommandation, conformément à la réglementation applicable à la distribution d'assurance. Elles figurent également dans nos informations réglementaires.",
  },
  {
    question: "Puis-je changer de mutuelle en cours d'année ?",
    answer:
      "Pour un contrat individuel, la résiliation est en principe possible à tout moment après la première année de souscription, sans frais ni pénalités. Les contrats collectifs obligatoires d'entreprise obéissent à des règles différentes. Nous vérifions votre situation avant toute démarche.",
  },
  {
    question: "Puis-je changer d'assurance emprunteur en cours de prêt ?",
    answer:
      "Oui : depuis la loi Lemoine, l'assurance d'un crédit immobilier peut être changée à tout moment, sans frais, à condition que le nouveau contrat présente un niveau de garanties au moins équivalent à celui exigé par la banque. L'économie réelle ne peut être chiffrée qu'à partir d'une offre alternative et d'une vérification de ces garanties.",
  },
  {
    question: "Quelle différence entre une assurance-vie et un PER ?",
    answer:
      "L'assurance-vie est une enveloppe d'épargne disponible, aux usages multiples (projets, transmission, complément de revenus). Le Plan d'Épargne Retraite est conçu pour la retraite : l'épargne est en principe bloquée jusqu'à la retraite, sauf cas de déblocage anticipé prévus par la loi, et les versements peuvent être déductibles du revenu imposable dans certaines limites. Leurs fiscalités sont distinctes et doivent être étudiées séparément.",
  },
  {
    question: "Pourquoi une prévoyance quand on est indépendant ou libéral ?",
    answer:
      "Les régimes obligatoires des travailleurs non salariés prévoient des indemnités souvent limitées, avec des délais de carence, et ne couvrent généralement pas les frais professionnels qui continuent de courir pendant un arrêt. Un contrat de prévoyance permet de maintenir vos revenus, de couvrir vos charges et de protéger vos proches.",
  },
  {
    question: "Les résultats des simulateurs sont-ils fiables ?",
    answer:
      "Nos simulateurs sont des outils pédagogiques. Ils reposent sur vos saisies et sur des hypothèses que vous pouvez modifier ; ils ne constituent ni un conseil, ni une offre, ni une garantie de résultat. Seule une étude personnalisée de vos contrats permet de formuler une recommandation.",
  },
  {
    question: "Que deviennent les informations que je transmets ?",
    answer:
      "Elles sont utilisées uniquement pour traiter votre demande et vous recontacter, et enregistrées dans notre outil de gestion de la relation client. Vous pouvez à tout moment exercer vos droits d'accès, de rectification ou d'effacement. Le détail figure dans notre politique de confidentialité.",
  },
];

export const productFaq: Record<ProductId, FaqItem[]> = {
  mutuelle: [
    {
      question: "Comment savoir si ma mutuelle est adaptée ?",
      answer:
        "Comparez vos principaux postes de dépenses de santé (optique, dentaire, spécialistes, hospitalisation) aux niveaux de remboursement de votre contrat, exprimés le plus souvent en pourcentage de la base de remboursement de la Sécurité sociale. Un contrat adapté couvre bien ce que vous utilisez réellement, sans payer pour ce dont vous n'avez pas besoin.",
    },
    {
      question: "Qu'est-ce que le « 100 % Santé » ?",
      answer:
        "Le dispositif 100 % Santé permet d'accéder, avec un contrat responsable, à une sélection d'équipements d'optique, de prothèses dentaires et d'aides auditives sans reste à charge. Les équipements hors de ce panier sont remboursés selon les garanties de votre contrat.",
    },
    {
      question: "Je suis indépendant : ma cotisation est-elle déductible ?",
      answer:
        "Sous certaines conditions, les cotisations des contrats dits « Madelin » souscrits par les travailleurs non salariés sont déductibles du bénéfice imposable, dans des limites fixées par la loi. Nous vérifions votre éligibilité lors de l'analyse.",
    },
  ],
  prevoyance: [
    {
      question: "Qu'est-ce qu'une franchise en prévoyance ?",
      answer:
        "C'est le nombre de jours d'arrêt pendant lesquels aucune indemnité n'est versée par le contrat. Une franchise courte coûte plus cher mais protège dès le début de l'arrêt ; elle doit être choisie en fonction de votre épargne de précaution et des délais de votre régime obligatoire.",
    },
    {
      question: "Mes frais professionnels sont-ils couverts pendant un arrêt ?",
      answer:
        "Pas automatiquement. La garantie « frais généraux » ou « frais professionnels » est spécifique : elle rembourse tout ou partie des charges fixes du cabinet (loyer, salaires, crédits…) pendant l'arrêt, selon les conditions du contrat.",
    },
    {
      question: "Pourquoi le barème d'invalidité est-il si important ?",
      answer:
        "Le taux d'invalidité peut être apprécié de façon fonctionnelle ou professionnelle. Pour un professionnel de santé ou un métier manuel, un barème tenant compte de la profession exercée peut faire une grande différence. C'est un point que nous examinons systématiquement.",
    },
  ],
  emprunteur: [
    {
      question: "Quand puis-je changer d'assurance de prêt ?",
      answer:
        "À tout moment pour les crédits immobiliers, sans frais, en application de la loi Lemoine, sous réserve que le nouveau contrat présente des garanties au moins équivalentes à celles exigées par votre banque. La banque dispose d'un délai réglementaire pour répondre à votre demande.",
    },
    {
      question: "Vais-je devoir remplir un questionnaire de santé ?",
      answer:
        "Pas toujours. Le questionnaire médical a été supprimé sous conditions, notamment lorsque la part assurée par personne ne dépasse pas un certain montant et que le prêt se termine avant un âge défini par la loi. Dans les autres cas, il reste requis.",
    },
    {
      question: "Comment l'économie est-elle estimée ?",
      answer:
        "Le simulateur compare le coût restant de votre contrat (votre cotisation si vous la connaissez, sinon un contrat bancaire moyen) au coût d'une assurance déléguée moyenne, calculée sur le capital restant dû selon votre âge. Le résultat est une estimation indicative avec une fourchette : il est ensuite vérifié sur votre tableau d'amortissement puis confirmé par un devis d'assureur, à garanties équivalentes.",
    },
    {
      question: "Pourquoi l'économie réelle peut-elle être différente ?",
      answer:
        "Le tarif d'une assurance de prêt dépend aussi de votre état de santé, de votre profession, de vos activités sportives et des garanties exigées par votre banque. Ces éléments ne sont pas pris en compte dans une estimation en ligne : c'est l'objet de la vérification gratuite.",
    },
  ],
  epargne: [
    {
      question: "Le rendement affiché est-il garanti ?",
      answer:
        "Non. Le simulateur utilise un taux d'intérêt constant que vous choisissez. Les supports en unités de compte présentent un risque de perte en capital et les performances passées ne préjugent pas des performances futures.",
    },
    {
      question: "Pourquoi les frais ont-ils autant d'importance ?",
      answer:
        "Les frais de gestion sont prélevés chaque année sur l'encours : sur un horizon long, quelques dixièmes de point se composent et peuvent représenter un écart significatif. Le simulateur est présenté hors frais pour rester lisible : nous intégrons les frais réels de vos contrats lors de l'analyse.",
    },
    {
      question: "Assurance-vie ou PER : lequel choisir ?",
      answer:
        "Ils ne répondent pas aux mêmes objectifs et peuvent être complémentaires. Le choix dépend de votre horizon, de votre besoin de disponibilité, de votre tranche marginale d'imposition et de vos objectifs de transmission. Nous étudions ces deux parcours de façon distincte.",
    },
  ],
};
