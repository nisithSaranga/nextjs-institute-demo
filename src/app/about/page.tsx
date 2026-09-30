import type { Metadata } from "next";
import { EditorialImage } from "@/components/editorial-image";
import { pageImages } from "@/content/page-images";
import { ServiceIcon } from "@/components/service-icon";
import { site, principles } from "@/content/site";
import { PageIntro } from "@/components/page-intro";
import { SectionHeading } from "@/components/section-heading";
import { ProcessSection } from "@/components/process-section";
import { EnquiryCta } from "@/components/enquiry-cta";

export const metadata: Metadata = {
  title: "About",
  description: site.pageDescriptions.about,
};

export default function About() {
  return (
    <main id="main" className="inner-page about-page" tabIndex={-1}>
      <PageIntro
        page="about"
        eyebrow="About Nexora"
        title={site.about.title}
        description={site.about.description}
      />
      <section className="section light">
        <div className="container about-grid">
          <figure className="about-focus-photo" data-reveal>
            <EditorialImage image={pageImages["it-support"]} />
            <figcaption>
              From the website people visit to the devices you work with.
            </figcaption>
          </figure>
          <div data-reveal>
            <p className="eyebrow">Our focus</p>
            <h2>{site.about.focusTitle}</h2>
            <p className="body-copy mt-6">{site.about.focus}</p>
            <p className="body-copy mt-5">{site.about.scope}</p>
          </div>
        </div>
      </section>
      <section className="section dark">
        <div className="container">
          <SectionHeading
            eyebrow="How we work"
            title="Principles that keep things simple."
          />
          <div className="three-grid">
            {principles.map((principle, index) => (
              <article
                className="principle-card"
                key={principle.title}
                data-reveal
                data-stagger={index * 80}
              >
                <div className={`principle-symbol principle-symbol-${index}`}>
                  <ServiceIcon
                    name={(["network", "web", "computer"] as const)[index]}
                  />
                </div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ProcessSection />
      <EnquiryCta />
    </main>
  );
}
