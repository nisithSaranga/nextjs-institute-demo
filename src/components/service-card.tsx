import Link from "next/link";
import { services } from "@/content/site";
import { Arrow } from "./icons";
import { ServiceIcon } from "./service-icon";

export function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  return (
    <article className="service-card" data-reveal data-stagger={index * 80}>
      <div className="flex items-center justify-between">
        <ServiceIcon name={service.icon} />
        <span className="item-number">/{service.number}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      <Link className="text-link" href={`/services#${service.id}`}>
        Explore {service.shortTitle.toLowerCase()}
        <Arrow />
      </Link>
    </article>
  );
}
