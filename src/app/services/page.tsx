import type { Metadata } from "next";
import { site, services, faqs } from "@/content/site";
import { PageIntro } from "@/components/page-intro";
import { SectionHeading } from "@/components/section-heading";
import { ServiceIcon } from "@/components/service-icon";
import { WhatsAppLink } from "@/components/button";
import { EnquiryCta } from "@/components/enquiry-cta";
import { EditorialImage } from "@/components/editorial-image";
import { pageImages } from "@/content/page-images";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: site.pageDescriptions.services,
};

export default function Services() {
  return (
    <main id="main" className="inner-page services-page" tabIndex={-1}>
      <PageIntro
        page="services"
        eyebrow="Our services"
        title="Useful solutions. Clearly explained."
        description="A focused set of services for your online presence, everyday computers and connected workspace. Start with the problem you want to solve."
      />
      <nav className="service-jump-nav" aria-label="Service categories">
        <div className="container">
          {services.map((service) => (
            <Link key={service.id} href={`#${service.id}`}>
              <ServiceIcon name={service.icon} />
              {service.shortTitle}
              <span aria-hidden="true">↓</span>
            </Link>
          ))}
        </div>
      </nav>
      <div className="light">
        {services.map((service) => (
          <section
            key={service.id}
            id={service.id}
            className="service-detail section"
          >
            <div className="container service-detail-grid">
              <div data-reveal>
                <div className="service-detail-label">
                  <ServiceIcon name={service.icon} />
                  <span>Service / {service.number}</span>
                </div>
                <h2>{service.title}</h2>
                <p className="body-copy mt-6">{service.description}</p>
                <div className="service-fit">
                  <h3>A good starting point</h3>
                  <p>{service.situations}</p>
                </div>
                <WhatsAppLink
                  message={`Hello Nexora Technologies, ${service.enquiry}`}
                >
                  Discuss {service.shortTitle.toLowerCase()}
                </WhatsAppLink>
              </div>
              <div className="service-visual" data-reveal data-stagger="90">
                <EditorialImage image={pageImages[service.id]} />
                <div className="included-panel">
                  <p className="eyebrow">What we can help with</p>
                  <h3>A practical scope of work.</h3>
                  <ul className="check-list">
                    {service.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="panel-note">
                    The exact scope is agreed after we understand your
                    requirements.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
      <section className="section soft">
        <div className="container faq-grid">
          <SectionHeading
            eyebrow="Before we begin"
            title="A few useful answers."
          />
          <div className="faq-list" data-reveal>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <EnquiryCta />
    </main>
  );
}
