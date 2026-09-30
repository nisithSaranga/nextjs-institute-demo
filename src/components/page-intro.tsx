import { EditorialImage } from "./editorial-image";
import { pageImages } from "@/content/page-images";

export function PageIntro({
  eyebrow,
  title,
  description,
  page,
}: {
  eyebrow: string;
  title: string;
  description: string;
  page: "about" | "services" | "projects" | "contact";
}) {
  return (
    <section
      className={`page-intro page-intro-${page}`}
      aria-labelledby="page-title"
    >
      <div className="intro-photograph">
        <EditorialImage image={pageImages[page]} priority decorative />
      </div>
      <div className="intro-shade" aria-hidden="true" />
      <div className="container intro-content">
        <div className="page-intro-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title" tabIndex={-1}>
            {title}
          </h1>
          <p className="intro-description">{description}</p>
        </div>
      </div>
    </section>
  );
}
