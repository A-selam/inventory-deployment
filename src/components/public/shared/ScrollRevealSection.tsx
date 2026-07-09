"use client";

import { type PropsWithChildren, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ScrollRevealSectionProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  threshold?: number;
}>;

export default function ScrollRevealSection({
  children,
  className,
  delay = 0,
  threshold = 0.2,
}: ScrollRevealSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "motion-reduce:transform-none motion-reduce:opacity-100 transition-all duration-1000 ease-out will-change-transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
