import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "glass" | "light";

const variants: Record<Variant, string> = {
  primary: "btn btn-primary",
  glass: "btn btn-glass",
  light: "btn btn-light",
};

type Common = { variant?: Variant; icon?: ReactNode; className?: string };

export function ButtonLink({
  variant = "primary",
  icon,
  className,
  children,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(variants[variant], "group", className)} {...props}>
      <span className="relative z-10">{children}</span>
      {icon ? (
        <span
          aria-hidden
          className="relative z-10 -mr-1 inline-flex transition-transform duration-300 group-hover:translate-x-0.5"
        >
          {icon}
        </span>
      ) : null}
    </Link>
  );
}

export function Button({
  variant = "primary",
  icon,
  className,
  children,
  type = "button",
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(variants[variant], "group", className)}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
      {icon ? (
        <span
          aria-hidden
          className="relative z-10 -mr-1 inline-flex transition-transform duration-300 group-hover:translate-x-0.5"
        >
          {icon}
        </span>
      ) : null}
    </button>
  );
}
