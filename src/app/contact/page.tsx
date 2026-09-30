import type { Metadata } from "next";
import { site, services } from "@/content/site";
import { contact, telephoneHref } from "@/content/contact";
import { PageIntro } from "@/components/page-intro";
import { WhatsAppLink } from "@/components/button";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description: site.pageDescriptions.contact,
};

export default function Contact() {
  return (
    <main id="main" className="inner-page contact-page" tabIndex={-1}>
      <PageIntro
        page="contact"
        eyebrow="Start a conversation"
        title="What can we help you move forward?"
        description="A new website, a computer issue or a better-connected workspace. Tell us what you need — a finished brief isn’t required."
      />
      <section className="section soft">
        <div className="container contact-grid">
          <div className="contact-copy">
            <div data-reveal>
              <p className="eyebrow">Let’s talk</p>
              <h2>A simple first step.</h2>
              <p className="body-copy mt-5">
                Call directly or use WhatsApp to start with a short description
                of your project.
              </p>
              <a href={telephoneHref} className="phone-card">
                <span>Call Nexora</span>
                <strong>{contact.displayNumber}</strong>
                <span aria-hidden="true">↗</span>
              </a>
              <WhatsAppLink />
            </div>
            <div className="contact-next" data-reveal>
              <h3>What happens next?</h3>
              <ol>
                <li>Share your goal or describe the issue.</li>
                <li>Review and send your enquiry in WhatsApp.</li>
                <li>Discuss the requirements and agree on next steps.</li>
              </ol>
              <p>
                You stay in control: this form only prepares a draft. It doesn’t
                submit an enquiry to this website.
              </p>
            </div>
          </div>
          <div data-reveal data-stagger="90">
            <EnquiryForm
              services={services.map(({ id, title }) => ({ id, title }))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
