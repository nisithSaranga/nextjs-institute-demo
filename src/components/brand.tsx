import Link from "next/link";
import { site } from "@/content/site";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label={`${site.name} home`}>
      <svg
        className="brand-mark"
        aria-hidden="true"
        viewBox="0 0 40 40"
        fill="none"
      >
        <rect width="40" height="40" rx="11" fill="#2864ed" />
        <path d="M11 28V12h5l8 11V12h5v16h-5l-8-11v11z" fill="white" />
      </svg>
      <span>
        {site.wordmark}
        <small>Technologies</small>
      </span>
    </Link>
  );
}
