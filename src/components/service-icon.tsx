export function ServiceIcon({
  name,
}: {
  name: "web" | "computer" | "network";
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="service-icon"
    >
      {name === "web" && (
        <>
          <rect x="4" y="5" width="24" height="22" rx="3" />
          <path d="M4 11h24M8 8h1m3 0h1m-1 8-3 3 3 3m8-6 3 3-3 3m-3-8-2 10" />
        </>
      )}
      {name === "computer" && (
        <>
          <rect x="3" y="4" width="26" height="19" rx="3" />
          <path d="M10 28h12m-6-5v5M3 18h26m-16-7 2 2 4-4" />
        </>
      )}
      {name === "network" && (
        <>
          <rect x="12" y="3" width="8" height="7" rx="2" />
          <rect x="2" y="22" width="8" height="7" rx="2" />
          <rect x="22" y="22" width="8" height="7" rx="2" />
          <path d="M16 10v6M6 22v-6h20v6" />
          <circle cx="16" cy="25" r="3" />
          <path d="M16 16v6" />
        </>
      )}
    </svg>
  );
}
