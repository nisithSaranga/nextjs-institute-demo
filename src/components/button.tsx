import Link from "next/link";
import type { ReactNode } from "react";
import { whatsappHref } from "@/content/contact";
import { Arrow, ChatIcon } from "./icons";

export function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
}) {
  return (
    <Link className={`btn btn-${variant}`} href={href}>
      {children}
      <Arrow />
    </Link>
  );
}

export function WhatsAppLink({
  message,
  children = "Chat on WhatsApp",
  className = "",
}: {
  message?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`btn btn-whatsapp ${className}`}
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ChatIcon />
      <span>
        {children}
        <small>Opens a new tab</small>
      </span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
