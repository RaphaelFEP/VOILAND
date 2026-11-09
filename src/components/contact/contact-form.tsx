"use client";

import { z } from "zod";

import { SelectField, TextAreaField } from "@/components/funnel/fields";
import { LeadFunnel, type FunnelStep } from "@/components/funnel/lead-funnel";
import { contactDefaults, contactFieldsSchema, type LeadProduct } from "@/lib/lead-schema";

const subjects = {
  contact: "Question générale",
  mutuelle: "Mutuelle santé",
  prevoyance: "Prévoyance",
  emprunteur: "Assurance emprunteur",
  "assurance-vie": "Assurance-vie",
  per: "Plan d'Épargne Retraite",
} as const satisfies Record<LeadProduct, string>;

const schema = contactFieldsSchema.extend({
  subject: z.enum(Object.keys(subjects) as [LeadProduct, ...LeadProduct[]]),
  message: z
    .string()
    .trim()
    .min(10, { error: "Décrivez votre demande en quelques mots (10 caractères minimum)." })
    .max(2000, { error: "2 000 caractères maximum." }),
});
type Values = z.infer<typeof schema>;

const steps: FunnelStep<Values>[] = [
  {
    id: "demande",
    label: "Votre demande",
    title: "Comment pouvons-nous vous aider ?",
    fields: ["subject", "message"],
    render: () => (
      <div className="space-y-5">
        <SelectField
          name="subject"
          label="Sujet"
          options={Object.entries(subjects).map(([value, label]) => ({ value, label }))}
        />
        <TextAreaField
          name="message"
          label="Votre message"
          placeholder="Votre situation, votre question, vos disponibilités…"
        />
      </div>
    ),
  },
];

export function ContactForm() {
  return (
    <LeadFunnel<Values>
      schema={schema}
      defaultValues={{ ...contactDefaults, subject: "contact", message: "" }}
      steps={steps}
      product={(v) => v.subject}
      objective={(v) => subjects[v.subject]}
      contactTitle="Vos coordonnées"
      contactIntro="Nous vous répondons dans les meilleurs délais."
      submitLabel="Envoyer ma demande"
      summarize={(v) => [
        { label: "Sujet", value: subjects[v.subject] },
        { label: "Message", value: v.message },
      ]}
    />
  );
}
