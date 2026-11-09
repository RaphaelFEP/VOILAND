"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CalendarDays, Loader2 } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  useWatch,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
} from "react-hook-form";
import type { z } from "zod";

import {
  CONSENT_VERSION,
  contactFieldNames,
  type ContactFields,
  type LeadProduct,
  type LeadRequest,
  type LeadResponse,
} from "@/lib/lead-schema";
import { readAttribution } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { ContactStep } from "./contact-step";
import { FunnelProgress } from "./funnel-progress";
import { FunnelSuccess } from "./funnel-success";

/** Temps de remplissage (anti-spam), calculé à l'envoi. */
function elapsedSince(start: number | null) {
  return start ? Math.max(0, Date.now() - start) : 0;
}

export type FunnelStep<T extends FieldValues> = {
  id: string;
  /** Libellé court pour l'indicateur de progression */
  label: string;
  title: string;
  description?: string;
  fields?: Path<T>[];
  render: (values: T) => ReactNode;
  /** Étape de résultat : bouton principal personnalisé */
  kind?: "question" | "result";
  nextLabel?: string;
};

type Props<T extends FieldValues & ContactFields> = {
  schema: z.ZodType<T>;
  defaultValues: T;
  steps: FunnelStep<T>[];
  product: (values: T) => LeadProduct;
  summarize: (values: T) => { label: string; value: string }[];
  objective?: (values: T) => string;
  contactTitle?: string;
  contactIntro?: string;
  submitLabel?: string;
  className?: string;
  /** Identifiant d'ancrage pour l'accès direct (#diagnostic) */
  id?: string;
  header?: ReactNode;
};

export function LeadFunnel<T extends FieldValues & ContactFields>({
  schema,
  defaultValues,
  steps: questionSteps,
  product,
  summarize,
  objective,
  contactTitle = "Recevez votre analyse personnalisée",
  contactIntro = "Un conseiller étudie vos réponses et vous recontacte pour approfondir votre situation. Sans engagement.",
  submitLabel = "Recevoir mon analyse personnalisée",
  className,
  id,
  header,
}: Props<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema as never) as unknown as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>,
    mode: "onTouched",
    shouldFocusError: true,
  });
  const values = useWatch({ control: form.control }) as T;

  const steps: FunnelStep<T>[] = [
    ...questionSteps,
    {
      id: "contact",
      label: "Coordonnées",
      title: contactTitle,
      fields: contactFieldNames as unknown as Path<T>[],
      render: () => <ContactStep intro={contactIntro} />,
    },
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<LeadResponse, { ok: true }> | null>(null);
  const startedAt = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Accessibilité : focus sur le titre de l'étape à chaque changement.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const root = rootRef.current;
    if (root && root.getBoundingClientRect().top < 80) {
      root.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [index, result, reduce]);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  const go = (delta: number) => {
    setDirection(delta);
    setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + delta)));
  };

  const next = async () => {
    if (step.fields?.length) {
      const ok = await form.trigger(step.fields, { shouldFocus: true });
      if (!ok) return;
    }
    go(1);
  };

  const send = async (v: T) => {
    setStatus("sending");
    setServerError(null);
    const payload: LeadRequest = {
      product: product(v),
      objective: objective?.(v),
      contact: {
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        phone: v.phone,
        callbackSlot: v.callbackSlot,
      },
      diagnostic: summarize(v).filter((d) => d.value !== ""),
      consents: { contact: true, marketing: !!v.consentMarketing, version: CONSENT_VERSION },
      tracking: readAttribution(),
      website: v.website ?? "",
      elapsedMs: elapsedSince(startedAt.current),
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as LeadResponse;
      if (!data.ok) {
        setStatus("error");
        setServerError(data.error);
        return;
      }
      setStatus("idle");
      setResult(data);
    } catch {
      setStatus("error");
      setServerError(
        "Connexion impossible. Vérifiez votre réseau puis réessayez : vos réponses sont conservées.",
      );
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLast) void form.handleSubmit(send)(e);
    else void next();
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -28 }),
  };

  return (
    <div
      ref={rootRef}
      id={id}
      className={cn("glass glass-strong scroll-mt-28 rounded-[32px] p-5 sm:p-8", className)}
    >
      {header}
      {result ? (
        <FunnelSuccess
          ref={headingRef}
          result={result}
          firstName={values.firstName}
          lastName={values.lastName}
          email={values.email}
        />
      ) : (
        <FormProvider {...form}>
          <FunnelProgress steps={steps.map((s) => s.label)} current={index} />
          <form onSubmit={onSubmit} noValidate className="relative mt-6">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <m.div
                key={step.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-xl font-semibold leading-snug tracking-tight text-ink outline-none sm:text-2xl"
                >
                  {step.title}
                </h3>
                {step.description ? (
                  <p className="mt-2 text-[0.95rem] text-muted">{step.description}</p>
                ) : null}
                <div className="mt-6">{step.render(values)}</div>
              </m.div>
            </AnimatePresence>

            {serverError ? (
              <p role="alert" className="mt-6 rounded-2xl bg-[#fdecea] p-4 text-sm font-medium text-[#8a1c12] ring-1 ring-[#f3b8b0]">
                {serverError}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              {index > 0 ? (
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden /> Retour
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}
              <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                {step.kind === "result" ? (
                  <Link
                    href="/rendez-vous"
                    className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium text-ink underline-offset-4 hover:underline"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden /> Réserver directement
                  </Link>
                ) : null}
                <button
                  type="submit"
                  className="btn btn-primary group whitespace-normal text-center"
                  disabled={status === "sending"}
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {status === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Envoi en cours…
                      </>
                    ) : (
                      <>
                        {isLast ? submitLabel : step.nextLabel ?? "Continuer"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
