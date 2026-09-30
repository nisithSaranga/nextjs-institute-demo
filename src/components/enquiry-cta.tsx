import { site } from "@/content/site";
import { Button } from "./button";

export function EnquiryCta() {
  return (
    <section className="enquiry-cta">
      <div className="container">
        <div className="cta-inner" data-reveal>
          <div>
            <p className="eyebrow">{site.cta.eyebrow}</p>
            <h2>{site.cta.title}</h2>
            <p>{site.cta.description}</p>
          </div>
          <Button href="/contact" variant="light">
            Discuss Your Project
          </Button>
        </div>
      </div>
    </section>
  );
}
