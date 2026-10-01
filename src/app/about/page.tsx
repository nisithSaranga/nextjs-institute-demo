import type { Metadata } from "next";
import {
  EvidenceHero,
  EvidenceHeading,
  EvidenceCta,
} from "@/components/evidence-page";
import { EvidenceCarousel } from "@/components/evidence-carousel";
import { principles, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: site.pageDescriptions.about,
};

const focusAreas = [
  {
    number: "01",
    title: "Websites",
    description:
      "Clear, responsive websites built around how customers understand and contact your business.",
  },
  {
    number: "02",
    title: "IT support",
    description:
      "Practical troubleshooting, setup and maintenance guidance for the computers you rely on.",
  },
  {
    number: "03",
    title: "Networks",
    description:
      "Wired and wireless workspace connections planned around your devices and day-to-day use.",
  },
];

const principleMarks = ["C", "M", "P"];

export default function About() {
  return (
    <main
      id="main"
      className="evidence-page evidence-about about-reference"
      tabIndex={-1}
    >
      <EvidenceHero
        eyebrow="Nexora Technologies"
        title="Technology that works around your business."
        description="Websites, computer support and networks approached with clear communication, practical choices and an understandable handover."
        image="development"
      />

      <section className="evidence-section evidence-light about-story">
        <div className="container">
          <EvidenceHeading
            eyebrow="Our story"
            title="A practical technology partner."
          >
            {site.about.description}
          </EvidenceHeading>

          <p className="about-story-copy">{site.about.scope}</p>

          <div className="about-milestones">
            {focusAreas.map((item) => (
              <article key={item.number} data-reveal>
                <strong>{item.number}</strong>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="evidence-section evidence-dark about-principles">
        <div className="container evidence-cards">
          {principles.map((item, index) => (
            <article
              className="evidence-card"
              data-reveal
              key={item.title}
            >
              <span className="evidence-icon" aria-hidden="true">
                {principleMarks[index]}
              </span>

              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="evidence-section evidence-light about-gallery">
        <div className="container">
          <EvidenceHeading
            eyebrow="Gallery"
            title="Technology in the spaces where work happens."
          >
            Illustrative workspaces and equipment selected to show
            Nexora&apos;s areas of focus. These are not photographs of client
            engagements.
          </EvidenceHeading>

          <EvidenceCarousel />
        </div>
      </section>

      <EvidenceCta />
    </main>
  );
}