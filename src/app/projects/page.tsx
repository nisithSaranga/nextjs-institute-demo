import type { Metadata } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { PageIntro } from "@/components/page-intro";
import { ProjectPreview } from "@/components/project-preview";
import { Button } from "@/components/button";
import { ConceptDetails } from "@/components/concept-details";

export const metadata: Metadata = {
  title: "Concept Projects",
  description: site.pageDescriptions.projects,
};

export default function Projects() {
  return (
    <main id="main" className="inner-page projects-page" tabIndex={-1}>
      <PageIntro
        page="projects"
        eyebrow="Design explorations"
        title="Different businesses. Thoughtful possibilities."
        description="Three concept websites exploring how design can solve a specific business need. These are design studies, not completed client engagements or live websites."
      />
      <div className="light">
        {projects.map((project, index) => (
          <article
            id={project.id}
            className="section project-detail"
            key={project.id}
          >
            <div className="container">
              <div className="project-detail-heading" data-reveal>
                <div>
                  <p className="eyebrow">
                    0{index + 1} / {project.category}
                  </p>
                  <h2>{project.name}</h2>
                </div>
                <span className="concept-tag">Concept project</span>
              </div>
              <div className="project-detail-grid">
                <div data-reveal>
                  <ProjectPreview project={project} expanded />
                  <p className="preview-caption">
                    HTML/CSS concept preview · Proposed layout, not a live
                    website
                  </p>
                </div>
                <div data-reveal data-stagger="90">
                  <h3>The idea</h3>
                  <p className="body-copy mt-3">{project.goal}</p>
                  <p className="project-audience">
                    <strong>Designed for</strong>
                    {project.audience}
                  </p>
                  <ConceptDetails name={project.name}>
                    <h3 className="mt-7">Proposed features</h3>
                    <ul className="check-list compact">
                      {project.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <p className="body-copy mt-6">{project.direction}</p>
                  </ConceptDetails>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <section className="section soft">
        <div className="container brief-callout" data-reveal>
          <h2>Your business brings a different brief.</h2>
          <p>
            These concepts are starting points for a conversation. Your content,
            audience and priorities should shape the final design.
          </p>
          <Button href="/contact">Discuss a website idea</Button>
        </div>
      </section>
    </main>
  );
}
