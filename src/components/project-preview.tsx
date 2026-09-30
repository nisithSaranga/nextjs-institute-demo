import Image from "next/image";
import type { Project } from "@/content/projects";

// A code-rendered visual study, not a screenshot of a completed customer website.
// It contains no fake links or buttons. The enclosing card supplies any navigation.
export function ProjectPreview({
  project,
  expanded = false,
}: {
  project: Project;
  expanded?: boolean;
}) {
  const sections =
    project.theme === "restaurant"
      ? ["Explore the menu", "The dining experience", "Plan your visit"]
      : project.theme === "advisory"
        ? ["Find your service", "How we work", "Start a conversation"]
        : [
            "Describe the issue",
            "Understand the assessment",
            "Ask for support",
          ];
  return (
    <div
      className={`project-preview preview-${project.theme}${expanded ? " preview-expanded" : ""}`}
      role="img"
      aria-label={`${project.name}: ${project.category} concept preview`}
    >
      <div className="preview-window" aria-hidden="true">
        <div className="preview-toolbar">
          <span />
          <span />
          <span />
          <i>Design concept</i>
        </div>
        <div className="preview-brand">
          {project.name}
          <span>Thoughtfully considered.</span>
        </div>
        {expanded && (
          <div className="mock-navigation">
            {sections.map((section) => (
              <span key={section}>{section}</span>
            ))}
          </div>
        )}
        <div className="preview-content">
          <div className="preview-copy">
            <span className="preview-kicker">{project.category}</span>
            <strong>{project.headline}</strong>
            <span className="preview-rule" />
          </div>
          {project.theme === "restaurant" ? (
            <Image
              src={project.image!}
              alt=""
              width={600}
              height={700}
              className="preview-photo"
              sizes="(max-width: 640px) 160px, 320px"
            />
          ) : project.theme === "advisory" && expanded ? (
            <div className="mock-advisory">
              <small>A clear starting point</small>
              <b>Understand the challenge.</b>
              <span>Explore the options.</span>
              <span>Agree the next step.</span>
            </div>
          ) : project.theme === "advisory" ? (
            <div className="preview-architecture">
              <span />
              <span />
              <span />
            </div>
          ) : (
            <div className="preview-device">
              <div>
                <span>↗</span>
                <i />
                <i />
                <i />
              </div>
              <span />
            </div>
          )}
        </div>
        {expanded && (
          <div className="mock-sections">
            {sections.map((section, index) => (
              <div key={section}>
                <span className="mock-section-rule" />
                <strong>{section}</strong>
                <p>{project.features[index]}</p>
              </div>
            ))}
          </div>
        )}
        <div className="preview-bottom">
          <span>
            {project.theme === "restaurant"
              ? "Seasonal menus"
              : project.theme === "advisory"
                ? "A clearer perspective"
                : "Understand · Assess · Resolve"}
          </span>
          <span>Considered, from the start.</span>
        </div>
      </div>
    </div>
  );
}
