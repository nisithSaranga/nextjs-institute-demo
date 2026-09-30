"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

// Native details supplies keyboard operation and a JavaScript-free fallback.
export function MobileMenu({ children }: { children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  const pendingNavigation = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (details.current) details.current.open = false;
    if (!pendingNavigation.current) return;
    pendingNavigation.current = false;
    const frame = requestAnimationFrame(() =>
      document.getElementById("page-title")?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && details.current?.open) {
        details.current.open = false;
        details.current.querySelector("summary")?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      const menu = details.current;
      if (menu?.open && !menu.contains(event.target as Node)) {
        const focusInside = menu.contains(document.activeElement);
        menu.open = false;
        if (focusInside) menu.querySelector("summary")?.focus();
      }
    };
    const desktop = matchMedia("(min-width: 960px)");
    const resize = () => {
      if (desktop.matches && details.current?.open) {
        const focusInside = details.current.contains(document.activeElement);
        details.current.open = false;
        if (focusInside)
          document.querySelector<HTMLAnchorElement>(".brand")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
      desktop.removeEventListener("change", resize);
    };
  }, []);

  return (
    <details ref={details} className="mobile-menu">
      <summary
        aria-label="Toggle navigation menu"
        aria-controls="mobile-navigation"
      >
        <span className="menu-lines" aria-hidden="true" />
      </summary>
      <div
        id="mobile-navigation"
        className="mobile-panel"
        onClick={(event) => {
          const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
            "a",
          );
          if (
            !link ||
            !details.current ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const destination = new URL(link.href);
          pendingNavigation.current =
            destination.origin === location.origin &&
            destination.pathname.replace(/\/$/, "") !==
              pathname.replace(/\/$/, "");
          details.current.open = false;
          details.current.querySelector("summary")?.focus();
        }}
      >
        {children}
      </div>
    </details>
  );
}
