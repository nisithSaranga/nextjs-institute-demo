"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function MobileMenu({ children }: { children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  const exitAnimation = useRef<Animation | null>(null);
  const navigating = useRef(false);
  const pathname = usePathname();

  function close(restoreFocus = true) {
    const menu = details.current;
    if (!menu) return;
    exitAnimation.current?.cancel();
    exitAnimation.current = null;
    if (restoreFocus) menu.querySelector("summary")?.focus();
    const panel = menu.querySelector<HTMLElement>(".mobile-panel");
    if (restoreFocus && menu.open && panel && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const animation = panel.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }],
        { duration: 350, easing: "ease", fill: "forwards" },
      );
      exitAnimation.current = animation;
      animation.onfinish = () => {
        menu.open = false;
        animation.cancel();
        exitAnimation.current = null;
      };
    } else {
      menu.open = false;
    }
  }

  useEffect(() => {
    close(false);
    if (navigating.current) {
      navigating.current = false;
      document.getElementById("page-title")?.focus({ preventScroll: true });
    }
  }, [pathname]);

  useEffect(() => {
    const menu = details.current;
    if (!menu) return;
    const originalOverflow = document.body.style.overflow;
    const toggle = () => {
      document.body.style.overflow = menu.open ? "hidden" : originalOverflow;
    };
    const key = (event: KeyboardEvent) => {
      if (!menu.open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "Tab") {
        const nodes = [...menu.querySelectorAll<HTMLElement>("summary, a[href], button")]
          .filter((node) => !node.classList.contains("drawer-backdrop"));
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const desktop = matchMedia("(min-width: 981px)");
    const resize = () => { if (desktop.matches) close(false); };
    menu.addEventListener("toggle", toggle);
    document.addEventListener("keydown", key);
    desktop.addEventListener("change", resize);
    return () => {
      exitAnimation.current?.cancel();
      menu.removeEventListener("toggle", toggle);
      document.removeEventListener("keydown", key);
      desktop.removeEventListener("change", resize);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <details className="mobile-menu" ref={details}>
      <summary aria-label="Toggle navigation menu" aria-controls="mobile-navigation"
        onClick={(event) => {
          if (details.current?.open) { event.preventDefault(); close(); }
        }}>
        <span className="menu-lines" aria-hidden="true" />
      </summary>
      <button className="drawer-backdrop" type="button" tabIndex={-1}
        aria-label="Close navigation" onClick={() => close()} />
      <div id="mobile-navigation" className="mobile-panel" onClick={(event) => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a");
        if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const destination = new URL(link.href);
        navigating.current = destination.origin === location.origin
          && destination.pathname.replace(/\/$/, "") !== pathname.replace(/\/$/, "");
        close();
      }}>
        {children}
      </div>
    </details>
  );
}
