"use client";

import type { ReactNode } from "react";

// Native details works without JS. Escape is an enhancement, not a modal.
export function ConceptDetails({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <details
      className="concept-details"
      onKeyDown={(event) => {
        if (event.key === "Escape" && event.currentTarget.open) {
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary")?.focus();
          event.stopPropagation();
        }
      }}
    >
      <summary>
        <span>
          View Concept <span className="sr-only">— {name}</span>
        </span>
        <span aria-hidden="true" className="disclosure-mark">
          +
        </span>
      </summary>
      <div className="concept-detail-content">{children}</div>
    </details>
  );
}
