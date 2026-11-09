import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

export default function dynamic<P extends object>(
  loader: () => Promise<unknown>,
  opts?: { loading?: () => ReactNode; ssr?: boolean },
) {
  const L = lazy(async () => {
    const m = (await loader()) as { default?: ComponentType<P> } | ComponentType<P>;
    const C = typeof m === "function" ? m : (m as { default: ComponentType<P> }).default;
    return { default: C };
  });
  return function Dynamic(props: P) {
    return (
      <Suspense fallback={opts?.loading ? opts.loading() : null}>
        <L {...props} />
      </Suspense>
    );
  };
}
