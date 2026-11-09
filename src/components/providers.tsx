"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { useEffect, type ReactNode } from "react";

import { ConsentBanner } from "@/components/consent/consent-banner";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { Spotlight } from "@/components/ui/spotlight";
import { captureAttribution } from "@/lib/tracking";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ConsentProvider>
          {children}
          <ConsentBanner />
          <Spotlight />
        </ConsentProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
