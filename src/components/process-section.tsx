import { process } from "@/content/site";
import { SectionHeading } from "./section-heading";

export function ProcessSection() {
  return (
    <section className="section light process-section">
      <div className="container">
        <SectionHeading
          eyebrow="A clear way forward"
          title="From the first conversation to a useful handover."
        />
        <ol className="process-grid">
          {process.map((step, index) => (
            <li key={step.title} data-reveal data-stagger={index * 70}>
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
