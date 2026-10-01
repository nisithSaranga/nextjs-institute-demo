import type { Metadata } from "next";
import { EvidenceHero, EvidenceHeading } from "@/components/evidence-page";
import { EvidenceCarousel } from "@/components/evidence-carousel";
import { ServiceIcon } from "@/components/service-icon";
import { whatsappHref } from "@/content/contact";
export const metadata: Metadata = { title: "IT Support & Networks", description: "Computer troubleshooting, device care and network setup for your workspace." };
export default function Support() {
    return <main id="main" className="evidence-page" tabIndex={-1}>
  <EvidenceHero eyebrow="Practical technical support" title="IT Support & Networks" description="Help with the computers, software and connections you rely on. Start with the issue, understand the options and agree the next step." image="it-support"/>
  <section className="evidence-section evidence-light">
    <div className="container">
    <EvidenceHeading eyebrow="1. Computer support" title="Keep everyday work moving.">From an unfamiliar error to a connection that keeps dropping, a clear description and a few careful checks help define the work.</EvidenceHeading>
    <div className="evidence-cards">{[{ icon: "computer" as const, title: "Diagnostics", text: "Investigate slowdowns, software problems and recurring faults before choosing a solution." }, { icon: "web" as const, title: "Device care", text: "Discuss setup, updates, maintenance and sensible hardware options for your existing devices." }, { icon: "network" as const, title: "Network support", text: "Review coverage, connectivity and equipment configuration around your workspace." }].map(item => <article className="evidence-card" data-reveal key={item.title}>
        <span className="evidence-icon">
        <ServiceIcon name={item.icon}/>
        </span>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
        </article>)}</div>
    <a className="btn btn-primary support-action" href={whatsappHref("Hello Nexora, I need help with a computer or network issue. Here is what is happening:")} target="_blank" rel="noopener noreferrer">Discuss a support issue<span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </a>
    </div>
    </section>
  <section className="evidence-section evidence-dark">
    <div className="container">
    <EvidenceHeading eyebrow="2. Equipment & workspaces" title="The tools behind your working day.">Illustrative equipment and workspace images. This gallery shows service areas, not a product catalogue or completed client work.</EvidenceHeading>
    </div>
    <EvidenceCarousel triple/>
    </section>
  <section className="evidence-section evidence-light">
    <div className="container evidence-split support-standards">
    <div>
    <EvidenceHeading eyebrow="A considered approach" title="Understand the issue. Agree the next step.">We start with your current setup and explain the options in plain language. Scope, access requirements and any equipment costs are discussed before work begins.</EvidenceHeading>
    </div>
    <img loading="lazy" decoding="async" data-reveal src="/images/nexora/it-support.webp" alt="Illustrative computer-support workspace"/>
    </div>
    </section>
 </main>;
}
