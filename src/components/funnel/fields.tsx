"use client";

import { Check } from "lucide-react";
import { useId, type ReactNode } from "react";
import { get, useFormContext, type FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";

function useFieldError(name: string) {
  const {
    formState: { errors },
  } = useFormContext<FieldValues>();
  const err = get(errors, name) as { message?: string } | undefined;
  return err?.message;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#b42318]">
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[#b42318]" />
      {message}
    </p>
  );
}

export function FieldShell({
  label,
  hint,
  htmlFor,
  error,
  errorId,
  hintId,
  children,
  optional,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  error?: string;
  errorId: string;
  hintId: string;
  children: ReactNode;
  optional?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
        <span>{label}</span>
        {optional ? <span className="text-xs font-normal text-subtle">Facultatif</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function TextField({
  name,
  label,
  hint,
  type = "text",
  autoComplete,
  placeholder,
  optional,
  className,
  inputMode,
}: {
  name: string;
  label: string;
  hint?: ReactNode;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  optional?: boolean;
  className?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const { register } = useFormContext();
  const id = useId();
  const error = useFieldError(name);
  const errorId = `${id}-err`;
  const hintId = `${id}-hint`;
  return (
    <FieldShell
      label={label}
      hint={hint}
      htmlFor={id}
      error={error}
      errorId={errorId}
      hintId={hintId}
      optional={optional}
      className={className}
    >
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(hint && hintId, error && errorId) || undefined}
        className="field"
        {...register(name)}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  name,
  label,
  hint,
  optional,
  className,
  placeholder,
}: {
  name: string;
  label: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const { register } = useFormContext();
  const id = useId();
  const error = useFieldError(name);
  return (
    <FieldShell
      label={label}
      hint={hint}
      htmlFor={id}
      error={error}
      errorId={`${id}-err`}
      hintId={`${id}-hint`}
      optional={optional}
      className={className}
    >
      <textarea
        id={id}
        rows={4}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className="field resize-y"
        {...register(name)}
      />
    </FieldShell>
  );
}

/** Champ numérique avec suffixe (€, €/mois, ans…). Vide → undefined. */
export function NumberField({
  name,
  label,
  hint,
  suffix = "€",
  optional,
  className,
  placeholder,
  min = 0,
  max,
  step = 1,
}: {
  name: string;
  label: string;
  hint?: ReactNode;
  suffix?: string;
  optional?: boolean;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const { register } = useFormContext();
  const id = useId();
  const error = useFieldError(name);
  const errorId = `${id}-err`;
  const hintId = `${id}-hint`;
  return (
    <FieldShell
      label={label}
      hint={hint}
      htmlFor={id}
      error={error}
      errorId={errorId}
      hintId={hintId}
      optional={optional}
      className={className}
    >
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hint && hintId, error && errorId) || undefined}
          className="field pr-20 tabular-nums"
          {...register(name, {
            setValueAs: (v: unknown) =>
              v === "" || v === null || v === undefined ? undefined : Number(String(v).replace(",", ".")),
          })}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-subtle"
        >
          {suffix}
        </span>
      </div>
    </FieldShell>
  );
}

type Option = { value: string; label: string; description?: string; icon?: ReactNode };

/** Groupe de cartes radio (choix unique), navigable au clavier. */
export function ChoiceCards({
  name,
  legend,
  hint,
  options,
  columns = 2,
  size = "md",
}: {
  name: string;
  legend: string;
  hint?: string;
  options: Option[];
  columns?: 1 | 2 | 3;
  size?: "sm" | "md";
}) {
  const { register } = useFormContext();
  const id = useId();
  const error = useFieldError(name);
  return (
    <fieldset aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}>
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div
        className={cn(
          "mt-3 grid gap-2.5",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-3",
        )}
      >
        {options.map((o) => (
          <label key={o.value} className="group relative cursor-pointer">
            <input type="radio" value={o.value} className="peer sr-only" {...register(name)} />
            <span
              className={cn(
                "flex h-full items-center gap-3 rounded-2xl bg-white/70 ring-1 ring-line transition-all duration-300",
                "group-hover:bg-white group-hover:ring-ink/20",
                "peer-checked:bg-white peer-checked:ring-2 peer-checked:ring-ink peer-checked:shadow-[0_10px_30px_-14px_rgb(11_26_51/0.45)]",
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                size === "md" ? "min-h-14 px-4 py-3" : "min-h-12 px-3.5 py-2.5",
              )}
            >
              {o.icon ? (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-peach-2 text-coral-ink">
                  {o.icon}
                </span>
              ) : null}
              <span className="flex-1">
                <span className="block text-[0.95rem] font-medium leading-snug text-ink">{o.label}</span>
                {o.description ? (
                  <span className="mt-0.5 block text-xs leading-snug text-muted">{o.description}</span>
                ) : null}
              </span>
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-3 grid h-5 w-5 scale-50 place-items-center rounded-full bg-ink text-white opacity-0 transition-all duration-300 peer-checked:scale-100 peer-checked:opacity-100"
            >
              <Check className="h-3 w-3" />
            </span>
          </label>
        ))}
      </div>
      <FieldError id={`${id}-err`} message={error} />
    </fieldset>
  );
}

/** Puces à choix multiples (cases à cocher). */
export function MultiChoice({
  name,
  legend,
  hint,
  options,
}: {
  name: string;
  legend: string;
  hint?: string;
  options: Option[];
}) {
  const { register } = useFormContext();
  const id = useId();
  const error = useFieldError(name);
  return (
    <fieldset aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}>
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type="checkbox" value={o.value} className="peer sr-only" {...register(name)} />
            <span
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full bg-white/70 px-4 text-sm font-medium text-ink-2 ring-1 ring-line transition-all duration-300",
                "hover:bg-white peer-checked:bg-ink peer-checked:text-white peer-checked:ring-ink",
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={`${id}-err`} message={error} />
    </fieldset>
  );
}

export function SelectField({
  name,
  label,
  hint,
  options,
  className,
  optional,
}: {
  name: string;
  label: string;
  hint?: ReactNode;
  options: { value: string; label: string }[];
  className?: string;
  optional?: boolean;
}) {
  const { register } = useFormContext();
  const id = useId();
  const error = useFieldError(name);
  return (
    <FieldShell
      label={label}
      hint={hint}
      htmlFor={id}
      error={error}
      errorId={`${id}-err`}
      hintId={`${id}-hint`}
      className={className}
      optional={optional}
    >
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230b1a33%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10"
        {...register(name)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({
  name,
  children,
  required,
}: {
  name: string;
  children: ReactNode;
  required?: boolean;
}) {
  const { register } = useFormContext();
  const id = useId();
  const error = useFieldError(name);
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          aria-required={required || undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md accent-[#0b1a33]"
          {...register(name)}
        />
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-muted">
          {children}
        </label>
      </div>
      <FieldError id={`${id}-err`} message={error} />
    </div>
  );
}
