import type { Metadata } from "next";
import { EvidenceHero, EvidenceHeading, EvidenceCta, EvidenceSteps } from "@/components/evidence-page";
import { EvidenceCarousel } from "@/components/evidence-carousel";
import { principles, site } from "@/content/site";
export const metadata: Metadata = { title: "About", description: site.pageDescriptions.about };
export default function About() {
    return <main id="main" className="evidence-page evidence-about" tabIndex={-1}>
    <EvidenceHero eyebrow="Nexora Technologies" title="Practical technology. A clear purpose." description="Websites, computer support and networks, built around the way your small business works." image="development"/>
    <section className="evidence-section evidence-light">
    <div className="container evidence-split">
    <div>
    <EvidenceHeading eyebrow="Our focus" title="Technology that makes sense.">{site.about.description}</EvidenceHeading>
    <p>{site.about.scope}</p>
    </div>
    <EvidenceSteps items={[{ label: "Web", title: "Your online presence", description: "Clear, responsive websites that make your business easy to understand." }, { label: "IT", title: "Your everyday tools", description: "Practical computer troubleshooting, setup and maintenance guidance." }, { label: "Network", title: "Your connected space", description: "Wired and wireless connections planned around your workspace." }]}/>
    </div>
    </section>
    <section className="evidence-section evidence-dark">
    <div className="container evidence-cards">{principles.map((item, index) => <article className="evidence-card" data-reveal key={item.title}>
        <span className="evidence-icon" aria-hidden="true">{["C", "M", "P"][index]}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        </article>)}</div>
    </section>
    <section className="evidence-section evidence-light">
    <div className="container">
    <EvidenceHeading eyebrow="Gallery" title="The spaces technology supports.">Illustrative workspaces and equipment, selected to show our areas of focus. These are not photographs of client engagements.</EvidenceHeading>
    <EvidenceCarousel />
    </div>
    </section>
    <EvidenceCta />
  </main>;
}
