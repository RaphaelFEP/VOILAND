import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

type GlassProps<T extends ElementType> = {
  as?: T;
  tone?: "default" | "strong" | "soft";
  spotlight?: boolean;
} & Omit<ComponentProps<T>, "as">;

/**
 * Surface « Liquid Glass » : translucidité, flou, liseré lumineux et reflet
 * qui suit le pointeur (data-spotlight, piloté par <Spotlight />).
 */
export function Glass<T extends ElementType = "div">({
  as,
  tone = "default",
  spotlight = true,
  className,
  ...props
}: GlassProps<T>) {
  const Comp = (as ?? "div") as ElementType;
  return (
    <Comp
      data-spotlight={spotlight ? "" : undefined}
      className={cn(
        "glass rounded-[var(--radius-glass)]",
        tone === "strong" && "glass-strong",
        tone === "soft" && "glass-soft",
        className,
      )}
      {...props}
    />
  );
}
