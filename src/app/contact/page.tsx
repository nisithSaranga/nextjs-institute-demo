import type { Metadata } from "next";
import {
  EvidenceHero,
  EvidenceHeading,
  EvidenceFaq,
} from "@/components/evidence-page";
import { TabbedEnquiry } from "@/components/tabbed-enquiry";
import {
  contact,
  telephoneHref,
  whatsappHref,
} from "@/content/contact";
import { faqs, site } from "@/content/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: site.pageDescriptions.contact,
};

export default function Contact() {
  return (
    <main
      id="main"
      className="evidence-page evidence-contact"
      tabIndex={-1}
    >
      <EvidenceHero
        eyebrow="Start a conversation"
        title="Contact Nexora"
        description="Tell us what you are working on or what is getting in the way. Choose an enquiry type and prepare a message to review in WhatsApp."
        image="workspace"
      />

      {/* Contact details + enquiry form */}
      <section className="evidence-section evidence-light">
        <div className="container evidence-contact-grid">
          <div>
            <EvidenceHeading
              eyebrow="Contact details"
              title="Let's talk."
            />

            <div className="evidence-contact-list">
              <div>
                <span aria-hidden="true">01</span>
                <p>
                  <strong>Phone</strong>
                  <a href={telephoneHref}>
                    {contact.displayNumber}
                  </a>
                </p>
              </div>

              <div>
                <span aria-hidden="true">02</span>
                <p>
                  <strong>WhatsApp</strong>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.displayNumber}
                    <span className="sr-only">
                      {" "}
                      (opens a new tab)
                    </span>
                  </a>
                </p>
              </div>

              <div>
                <span aria-hidden="true">03</span>
                <p>
                  <strong>Website projects</strong>
                  <Link href="/services#websites">
                    Planning, development and redesign
                  </Link>
                </p>
              </div>

              <div>
                <span aria-hidden="true">04</span>
                <p>
                  <strong>IT support</strong>
                  <Link href="/support">
                    Computer setup and troubleshooting
                  </Link>
                </p>
              </div>

              <div>
                <span aria-hidden="true">05</span>
                <p>
                  <strong>Network enquiries</strong>
                  <Link href="/services#networks">
                    Wired and wireless workspace setup
                  </Link>
                </p>
              </div>
            </div>

            <a
              className="reference-whatsapp-button"
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
              <span className="sr-only">
                {" "}
                (opens a new tab)
              </span>
            </a>
          </div>

          <TabbedEnquiry />
        </div>
      </section>

      {/* Map + FAQ */}
      <section className="evidence-section evidence-dark contact-map-faq">
        <div className="container contact-map-faq-grid">
          <div className="contact-map-wrap" data-reveal>
            <iframe
              className="contact-map"
              src="https://www.google.com/maps?q=Independence+Square,+Colombo,+Sri+Lanka&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Example Nexora location in Colombo, Sri Lanka"
            />
          </div>

          <div className="contact-faq-column">
            <EvidenceHeading
              eyebrow="FAQ"
              title="Frequently asked questions."
            />

            <EvidenceFaq
              items={[
                faqs[0],
                faqs[2],
                faqs[3],
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}