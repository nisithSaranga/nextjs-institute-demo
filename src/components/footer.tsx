import Link from "next/link";
import { site, services } from "@/content/site";
import { contact, telephoneHref, whatsappHref } from "@/content/contact";
import { Brand } from "./brand";
import { NavigationLinks } from "./navigation-links";
import { ChatIcon } from "./icons";

export function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Brand />
              <p className="mt-6 max-w-72">{site.tagline}</p>
              <p className="mt-3 max-w-80">{site.description}</p>
            </div>
            <div>
              <h2>Explore</h2>
              <NavigationLinks location="Footer" />
            </div>
            <div>
              <h2>What we do</h2>
              <ul className="grid gap-3">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link href={`/services#${service.id}`}>
                      {service.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Start a conversation</h2>
              <a className="contact-number" href={telephoneHref}>
                {contact.displayNumber}
              </a>
              <a
                className="footer-whatsapp"
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChatIcon />
                WhatsApp ↗<span className="sr-only"> (opens a new tab)</span>
              </a>
              <p className="mt-2 text-xs">WhatsApp opens in a new tab.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {site.name}.
            </span>
            <span>Web. Support. Connected.</span>
          </div>
        </div>
      </footer>
      <a
        className="floating-chat"
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Nexora on WhatsApp (opens a new tab)"
        title="WhatsApp — opens a new tab"
      >
        <ChatIcon />
      </a>
    </>
  );
}
