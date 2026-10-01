import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, services, principles } from "@/content/site";
import { Button, WhatsAppLink } from "@/components/button";
import { SectionHeading } from "@/components/section-heading";
import { EnquiryCta } from "@/components/enquiry-cta";
import { HeroCarousel } from "@/components/hero-carousel";
import { ReferenceGallery } from "@/components/reference-gallery";
export const metadata: Metadata = { title: { absolute: "Websites, IT Support & Networks | Nexora Technologies" }, description: site.pageDescriptions.home };
export default function Home() {
 return <main id="main" className="parity-home" tabIndex={-1}>
  <HeroCarousel><div className="hero-copy"><p className="eyebrow">Websites, computer support and small-business networks</p><h1 id="page-title" tabIndex={-1}>Practical tech.<br/>For your business.</h1><p className="hero-description">Website development, everyday IT support and connected workspaces. Clear advice and practical solutions for your next business step.</p><div className="actions"><Button href="/services">Explore Services</Button><WhatsAppLink>Talk to Us on WhatsApp</WhatsAppLink></div></div></HeroCarousel>
  <section className="parity-facts" aria-label="Nexora capabilities"><div className="container">{[["Websites","Design & build"],["Support","Computer care"],["Networks","Setup & support"],["Practical","Clear advice"]].map(([title,text])=><div className="parity-fact" key={title} data-reveal><strong>{title}</strong><span>{text}</span></div>)}</div></section>
  <section className="section light"><div className="container parity-split"><div data-reveal><p className="eyebrow">Welcome to Nexora</p><h2>Useful technology for your next step.</h2><p>Nexora brings websites, computer support and network setup together, starting with your business and the way you work.</p><Button href="/about">Learn More</Button></div><div data-reveal className="parity-intro-image"><Image src="/images/nexora/development.webp" alt="Illustrative laptop workspace with a code editor" width={1200} height={750}/></div></div></section>
  <section className="section dark" id="home-services"><div className="container"><SectionHeading eyebrow="What we offer" title="Practical solutions for everyday business technology."/><div className="parity-cards">{services.map(s=><article key={s.id} className="parity-card" data-reveal><div className="parity-number">{s.number}</div><h3>{s.title}</h3><p>{s.summary}</p><Link href={"/services#"+s.id}>Explore service &rarr;</Link></article>)}</div></div></section>
  <section className="section light"><div className="container"><SectionHeading eyebrow="Why Nexora" title="Built around clear communication and practical support."/><div className="parity-reasons">{principles.map((p,i)=><div key={p.title} data-reveal><strong>{p.title}</strong><span>{["Clear options and a scope agreed before work begins.","Useful websites and setups that are easier to maintain.","Practical help shaped around the way your business works."][i]}</span></div>)}</div></div></section>
  <section className="section dark"><div className="container"><SectionHeading eyebrow="Technology gallery" title="Websites, devices and connected workspaces."/><ReferenceGallery/><p className="gallery-disclosure">Illustrative stock photography, not Nexora premises or client engagements. <Link href="/projects">Explore our labelled website concepts &rarr;</Link></p></div></section>
  <EnquiryCta/>
 </main>;
}
