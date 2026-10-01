import type { Metadata } from "next";
import { EvidenceHero, EvidenceHeading, EvidenceSteps, EvidenceFaq } from "@/components/evidence-page";
import { serviceDetails } from "@/content/reference-pages";
import { faqs, site } from "@/content/site";
import { whatsappHref } from "@/content/contact";
export const metadata: Metadata = { title: "Services", description: site.pageDescriptions.services };
export default function Services() {
    return <main id="main" className="evidence-page" tabIndex={-1}>
  <EvidenceHero eyebrow="Practical solutions for small businesses" title="Our Services" description="Explore website development, everyday computer support and network setup. Start with your needs and agree a clear scope." image="development"/>
  <section className="evidence-section evidence-light">
    <div className="container service-detail-grid">{serviceDetails.map((service, index) => <article id={service.id} className={`service-detail ${index ? "service-detail-dark" : ""}`} key={service.id} data-reveal>
        <img loading="lazy" decoding="async" className="service-detail-image" src={`/images/nexora/${service.image}.webp`} alt={service.alt}/>
        <div className="service-detail-title">
        <p className="eyebrow">0{index + 1} &bull; {service.badge}</p>
        <h2>{service.title}</h2>
        <span aria-hidden="true">0{index + 1}</span>{service.subtitle && <p>{service.subtitle}</p>}</div>{service.groups.map(group => <section className="service-detail-group" key={group.title} id={group.id}>
            <h3>{group.title}</h3>
            <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
            </section>)}<a className="btn btn-primary" href={whatsappHref(service.message)} target="_blank" rel="noopener noreferrer">Discuss this service<span className="sr-only"> (opens WhatsApp in a new tab)</span>
        </a>
        </article>)}</div>
    </section>
  <section className="evidence-section evidence-dark">
    <div className="container">
    <EvidenceHeading eyebrow="Working together" title="A clear path from idea to handover."/>
    <EvidenceSteps items={[{ label: "01", title: "Understand the need", description: "Describe your business, the current setup and the outcome you want." }, { label: "02", title: "Agree the approach", description: "Review the options, dependencies and scope before work begins." }, { label: "03", title: "Build, check and explain", description: "Review the result together and walk through the essentials for ongoing use." }]}/>
    </div>
    </section>
  <section className="evidence-section evidence-light">
    <div className="container">
    <EvidenceHeading eyebrow="At a glance" title="Which service fits your next step?"/>
    <div className="evidence-table-wrap" role="region" aria-label="Service comparison" tabIndex={0}>
    <table className="evidence-table">
    <caption className="sr-only">Website and IT service comparison</caption>
    <thead>
    <tr>
    <th scope="col">Focus</th>
    <th scope="col">Website development</th>
    <th scope="col">IT support &amp; networks</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <th scope="row">Starting point</th>
    <td>A new site or a clearer online presence</td>
    <td>A device issue or a connected workspace</td>
    </tr>
    <tr>
    <th scope="row">Typical work</th>
    <td>Structure, responsive pages and enquiry paths</td>
    <td>Diagnosis, configuration and practical checks</td>
    </tr>
    <tr>
    <th scope="row">Handover</th>
    <td>Page walkthrough and editing guidance</td>
    <td>Setup notes and everyday care guidance</td>
    </tr>
    <tr>
    <th scope="row">First step</th>
    <td colSpan={2}>Share your requirements. Scope and costs are agreed before work begins.</td>
    </tr>
    </tbody>
    </table>
    </div>
    </div>
    </section>
  <section className="evidence-section evidence-dark">
    <div className="container">
    <EvidenceFaq items={faqs.slice(0, 2)}/>
    </div>
    </section>
 </main>;
}
