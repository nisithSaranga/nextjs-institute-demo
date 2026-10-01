import Image from "next/image";
import type { CSSProperties } from "react";
import { evidencePhotos } from "@/content/reference-pages";
import { whatsappHref } from "@/content/contact";
export function EvidenceHero({ eyebrow, title, description, image = "workspace" }: {
    eyebrow: string;
    title: string;
    description: string;
    image?: keyof typeof evidencePhotos;
}) {
    const photo = evidencePhotos[image];
    return <section className="evidence-hero" aria-labelledby="page-title" style={{ '--evidence-focal': photo.position, '--evidence-mobile-focal': photo.mobilePosition } as CSSProperties}>
    <Image className="evidence-hero-image" src={photo.src} alt="" fill preload sizes="100vw" />
    <div className="container">
    <div className="evidence-hero-copy">
    <p className="eyebrow">{eyebrow}</p>
    <h1 id="page-title" tabIndex={-1}>{title}</h1>
    <p>{description}</p>
    </div>
    </div>
    </section>;
}
export function EvidenceHeading({ eyebrow, title, children }: {
    eyebrow: string;
    title: string;
    children?: React.ReactNode;
}) {
    return <div className="evidence-heading" data-reveal>
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>{children && <p>{children}</p>}</div>;
}
export function EvidenceCta() {
    return <section className="evidence-cta">
    <div className="container" data-reveal>
    <div>
    <p className="eyebrow">Connect with Nexora</p>
    <h2>Let&apos;s discuss your next step.</h2>
    </div>
    <a className="btn btn-primary" href={whatsappHref()} target="_blank" rel="noopener noreferrer">Enquire on WhatsApp<span className="sr-only"> (opens a new tab)</span>
    </a>
    </div>
    </section>;
}
export function EvidenceFaq({ items }: {
    items: {
        question: string;
        answer: string;
    }[];
}) {
    return <div className="evidence-faq">{items.map(item => <details key={item.question}>
        <summary>{item.question}<span aria-hidden="true">+</span>
        </summary>
        <div>
        <p>{item.answer}</p>
        </div>
        </details>)}</div>;
}
export function EvidenceSteps({ items }: {
    items: {
        label: string;
        title: string;
        description: string;
    }[];
}) {
    return <div className="evidence-steps">{items.map((item, index) => <div className="evidence-step" data-reveal key={item.title}>
        <strong>{item.label}</strong>
        <article>
        <span className="step-ghost" aria-hidden="true">0{index + 1}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        </article>
        </div>)}</div>;
}
