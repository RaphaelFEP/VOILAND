import { useSyncExternalStore } from "react";

/** Routeur minimal par hash (#mutuelle…) pour la prévisualisation statique. */
type State = { path: string; anchor: string | null; nonce: number };
let state: State = { path: pathFromHash(), anchor: null, nonce: 0 };
const listeners = new Set<() => void>();

function pathFromHash() {
  const h = typeof location !== "undefined" ? location.hash.replace(/^#/, "") : "";
  return !h || h === "accueil" ? "/" : `/${h}`;
}

function emit(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export const getState = () => state;
export const useRouterState = () => useSyncExternalStore(subscribe, getState, getState);
export const usePathname = () => useRouterState().path;

export function toHash(href: string) {
  if (href.startsWith("#")) return href;
  const [path] = href.split("#");
  return path === "/" || path === "" ? "#accueil" : `#${path.replace(/^\//, "")}`;
}

export function go(href: string) {
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    window.open(href, "_blank", "noopener");
    return;
  }
  const [rawPath, anchor = null] = href.split("#");
  const path = rawPath === "" ? state.path : rawPath || "/";
  if (path === state.path) {
    if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  emit({ path, anchor, nonce: state.nonce + 1 });
  try {
    const h = toHash(path);
    if (location.hash !== h) history.pushState(null, "", h);
  } catch {
    /* hash indisponible : l'état interne suffit */
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", () => {
    const p = pathFromHash();
    if (p !== state.path) emit({ path: p, anchor: null, nonce: state.nonce + 1 });
  });
  window.addEventListener("popstate", () => {
    const p = pathFromHash();
    if (p !== state.path) emit({ path: p, anchor: null, nonce: state.nonce + 1 });
  });
}
