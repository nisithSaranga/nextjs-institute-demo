import type { Metadata } from "next";
import Link from "next/link";
import { site, services } from "@/content/site";
import { projects } from "@/content/projects";
import { Button } from "@/components/button";
import { Arrow } from "@/components/icons";
import { ServiceCard } from "@/components/service-card";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { ProcessSection } from "@/components/process-section";
import { EnquiryCta } from "@/components/enquiry-cta";
import { HeroCarousel } from "@/components/hero-carousel";

export const metadata: Metadata = {
  title: { absolute: "Websites, IT Support & Networks | Nexora Technologies" },
  description: site.pageDescriptions.home,
};

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <HeroCarousel>
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="blue-dot" />
            {site.hero.eyebrow}
          </p>
          <h1 id="page-title" tabIndex={-1}>
            {site.hero.title} <span>{site.hero.accent}</span>
          </h1>
          <p className="hero-description">{site.hero.description}</p>
          <div className="actions">
            <Button href="/services">Explore Services</Button>
            <Button href="/contact" variant="secondary">
              Discuss Your Project
            </Button>
          </div>
          <p className="hero-footnote">
            Built around your goals. Explained in plain language.
          </p>
        </div>
      </HeroCarousel>
      <div className="container capability-strip">
        {services.map((service) => (
          <Link key={service.id} href={`/services#${service.id}`}>
            <span>{service.number}</span>
            {service.title}
            <Arrow />
          </Link>
        ))}
      </div>
      <section className="section light">
        <div className="container intro-grid">
          <SectionHeading
            eyebrow={site.introduction.eyebrow}
            title={site.introduction.title}
          />
          <div data-reveal>
            <p className="lead-copy">{site.introduction.description}</p>
            <Link href="/about" className="text-link mt-7">
              Meet Nexora
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <section className="section soft" id="home-services">
        <div className="container">
          <div className="section-top">
            <SectionHeading
              eyebrow="What we do"
              title="The right help, where you need it."
            />
            <Link href="/services" className="text-link">
              All services
              <Arrow />
            </Link>
          </div>
          <div className="three-grid">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>
      <section className="section dark" id="home-projects">
        <div className="container">
          <div className="section-top">
            <SectionHeading
              eyebrow="Ideas in practice"
              title="A look at what’s possible."
              description="Selected website concepts, designed around different business needs."
            />
            <Link href="/projects" className="text-link">
              Explore all concepts
              <Arrow />
            </Link>
          </div>
          <div className="two-grid">
            {projects.slice(0, 2).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
      <ProcessSection />
      <EnquiryCta />
    </main>
  );
}
