import { ArrowRight } from "lucide-react";

import { Mascot } from "@/components/mascot/mascot";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <section className="pb-20 pt-36">
      <Container className="max-w-2xl text-center">
        <div className="mx-auto h-56 w-44">
          <Mascot className="h-full w-full" wave={false} />
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink">Page introuvable</h1>
        <p className="mt-4 text-lg text-muted">
          Cette page n&apos;existe pas ou a été déplacée. Notre robot vous raccompagne.
        </p>
        <ButtonLink href="/" className="mt-8" icon={<ArrowRight className="h-4 w-4" />}>
          Retour à l&apos;accueil
        </ButtonLink>
      </Container>
    </section>
  );
}
