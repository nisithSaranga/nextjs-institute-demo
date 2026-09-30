import Link from "next/link";
import type { Project } from "@/content/projects";
import { ProjectPreview } from "./project-preview";
import { Arrow } from "./icons";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className="project-card" data-reveal data-stagger={index * 90}>
      <Link
        href={`/projects#${project.id}`}
        aria-label={`Explore ${project.name} concept`}
      >
        <ProjectPreview project={project} />
      </Link>
      <div className="project-card-copy">
        <div className="flex items-center justify-between gap-3">
          <p className="project-category">{project.category}</p>
          <span className="concept-tag">Concept</span>
        </div>
        <h3>
          <Link href={`/projects#${project.id}`}>
            {project.name}
            <Arrow />
          </Link>
        </h3>
        <p>{project.summary}</p>
      </div>
    </article>
  );
}
