"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

export function NavigationLinks({
  location,
}: {
  location: "Main" | "Mobile" | "Footer";
}) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  return (
    <nav
      aria-label={`${location} navigation`}
      className={`${location.toLowerCase()}-links`}
    >
      {site.navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
