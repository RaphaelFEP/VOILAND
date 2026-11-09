export { usePathname } from "./router";
export const useRouter = () => ({ push: (h: string) => import("./router").then((m) => m.go(h)) });
