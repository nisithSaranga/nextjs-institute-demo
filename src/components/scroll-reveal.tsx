"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !Element.prototype.animate)
      return;
    const home = pathname !== "/projects" && pathname !== "/projects/";
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<Element, Animation>();
    const seen = new Set<Element>();
    const targets = [
      ...document.querySelectorAll<HTMLElement>("main [data-reveal]"),
    ];
    // Initial content stays available immediately, including on restored scroll positions.
    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) seen.add(target);
    });
    // Use pixels: percentage root margins are based on width, even vertically.
    const inset = Math.min(120, Math.round(innerHeight * 0.14));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          observer.unobserve(entry.target);
          if (motion.matches || entry.target.contains(document.activeElement))
            continue;
          const delay = Math.min(
            180,
            Number((entry.target as HTMLElement).dataset.stagger) || 0,
          );
          const animation = entry.target.animate(
            [
              { opacity: 0, transform: home ? "translateY(22px)" : "translateY(24px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: home ? 700 : 720,
              delay: home ? 0 : delay,
              easing: home ? "ease" : "cubic-bezier(.22,.61,.36,1)",
              fill: "backwards",
            },
          );
          animations.set(entry.target, animation);
          animation.onfinish = () => animations.delete(entry.target);
        }
      },
      home ? { threshold: 0.1 } : { rootMargin: `0px 0px -${inset}px 0px`, threshold: 0 },
    );
    targets.forEach((target) => {
      if (!seen.has(target)) observer.observe(target);
    });
    const focus = (event: FocusEvent) => {
      const target = (event.target as HTMLElement).closest("[data-reveal]");
      if (!target) return;
      seen.add(target);
      observer.unobserve(target);
      animations.get(target)?.cancel();
      animations.delete(target);
    };
    const preference = () => {
      if (motion.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    document.addEventListener("focusin", focus);
    motion.addEventListener("change", preference);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      document.removeEventListener("focusin", focus);
      motion.removeEventListener("change", preference);
    };
  }, [pathname]);
  return null;
}
