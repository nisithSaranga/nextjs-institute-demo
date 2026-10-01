import Link from "next/link";
import type { Metadata } from "next";
import { EvidenceHero, EvidenceHeading, EvidenceCta } from "@/components/evidence-page";
import { capabilities } from "@/content/reference-pages";
export const metadata: Metadata = { title: "Our Approach", description: "Explore Nexora's service capabilities and illustrative technology environments." };
export default function Approach() {
    return <main id="main" className="evidence-page" tabIndex={-1}>
  <EvidenceHero eyebrow="Nexora Technologies" title="Our Approach & Capabilities" description="Bring your website, computers and connections into one clear conversation, with practical choices and an understandable handover."/>
  <section className="evidence-section evidence-light">
    <div className="container">
    <EvidenceHeading eyebrow="Service capabilities" title="Focus areas for your business.">These cards describe what we work on. The images are illustrative, not employee profiles.</EvidenceHeading>
    <div className="capability-grid">{capabilities.map(item => <article data-reveal key={item.title}>
        <img loading="lazy" decoding="async" src={`/images/nexora/${item.image}.webp`} alt={`Illustrative ${item.title.toLowerCase()} setting`}/>
        <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        </div>
        </article>)}</div>
    </div>
    </section>
  <section className="evidence-section evidence-dark">
    <div className="container">
    <EvidenceHeading eyebrow="Technology in context" title="Ideas for connected businesses.">A visual collection of workspaces and technology, using illustrative stock photography. These images do not represent clients, partnerships or completed engagements.</EvidenceHeading>
    <div className="context-gallery">{["workspace", "development", "it-support", "networking", "restaurant", "workspace", "development"].map((photo, index) => <figure data-reveal key={index}>
        <img loading="lazy" decoding="async" src={`/images/nexora/${photo}.webp`} alt={`Illustrative technology setting ${index + 1}`} style={{ objectPosition: index > 4 ? "75% center" : "center" }}/>
        </figure>)}</div>
    <p className="context-projects">For example website layouts, explore our <Link href="/projects">clearly labelled concept projects</Link>.</p>
    </div>
    </section>
  <EvidenceCta />
 </main>;
}
