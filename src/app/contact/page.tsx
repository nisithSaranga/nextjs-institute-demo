import type { Metadata } from "next";
import { EvidenceHero, EvidenceHeading, EvidenceFaq } from "@/components/evidence-page";
import { TabbedEnquiry } from "@/components/tabbed-enquiry";
import { contact, telephoneHref, whatsappHref } from "@/content/contact";
import { faqs, site } from "@/content/site";
import Link from "next/link";
export const metadata: Metadata = { title: "Contact", description: site.pageDescriptions.contact };
export default function Contact() {
    return <main id="main" className="evidence-page evidence-contact" tabIndex={-1}>
  <EvidenceHero eyebrow="Start a conversation" title="Contact Nexora" description="Tell us what you are working on or what is getting in the way. Choose an enquiry type and prepare a message to review in WhatsApp." image="workspace"/>
  <section className="evidence-section evidence-light">
    <div className="container evidence-contact-grid">
    <div>
    <EvidenceHeading eyebrow="Contact details" title="Let's talk."/>
    <div className="evidence-contact-list">
    <div>
    <span aria-hidden="true">01</span>
    <p>
    <strong>Phone</strong>
    <a href={telephoneHref}>{contact.displayNumber}</a>
    </p>
    </div>
    <div>
    <span aria-hidden="true">02</span>
    <p>
    <strong>WhatsApp</strong>
    <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">{contact.displayNumber}<span className="sr-only"> (opens a new tab)</span>
    </a>
    </p>
    </div>
    <div>
    <span aria-hidden="true">03</span>
    <p>
    <strong>Website projects</strong>
    <Link href="/services#websites">Planning, development and redesign</Link>
    </p>
    </div>
    <div>
    <span aria-hidden="true">04</span>
    <p>
    <strong>IT support</strong>
    <Link href="/support">Computer setup and troubleshooting</Link>
    </p>
    </div>
    <div>
    <span aria-hidden="true">05</span>
    <p>
    <strong>Network enquiries</strong>
    <Link href="/services#networks">Wired and wireless workspace setup</Link>
    </p>
    </div>
    </div>
    <a className="btn btn-primary" href={whatsappHref()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp<span className="sr-only"> (opens a new tab)</span>
    </a>
    </div>
    <TabbedEnquiry />
    </div>
    </section>
  <section className="evidence-section evidence-dark">
    <div className="container evidence-split">
    <figure className="contact-context-image" data-reveal>
    <img loading="lazy" decoding="async" src="/images/nexora/workspace.webp" alt="Illustrative desk and workspace"/>
    <figcaption>Illustrative workspace. Contact Nexora by phone or WhatsApp to discuss your requirements.</figcaption>
    </figure>
    <div>
    <EvidenceHeading eyebrow="Helpful information" title="Before you get in touch."/>
    <EvidenceFaq items={[faqs[0], faqs[2], faqs[3]]}/>
    </div>
    </div>
    </section>
 </main>;
}
