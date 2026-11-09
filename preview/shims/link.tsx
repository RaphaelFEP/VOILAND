import type { AnchorHTMLAttributes, ReactNode } from "react";
import { go, toHash } from "./router";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string };
  onNavigate?: () => void;
  prefetch?: unknown;
  children?: ReactNode;
};

export default function Link({ href, onNavigate, onClick, prefetch: _p, ...rest }: Props) {
  void _p;
  const h = typeof href === "string" ? href : href.pathname ?? "/";
  return (
    <a
      href={toHash(h)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        onNavigate?.();
        go(h);
      }}
      {...rest}
    />
  );
}
