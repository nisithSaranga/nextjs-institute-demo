import Image from "next/image";
import type { CSSProperties } from "react";
import type { PageImage } from "@/content/page-images";

export function EditorialImage({
  image,
  priority = false,
  decorative = false,
}: {
  image: PageImage;
  priority?: boolean;
  decorative?: boolean;
}) {
  return (
    <div
      className="editorial-image"
      style={
        {
          "--image-position": image.position,
          "--image-mobile-position": image.mobilePosition,
        } as CSSProperties
      }
    >
      <Image
        src={image.src}
        alt={decorative ? "" : image.alt}
        fill
        sizes="(min-width: 960px) 55vw, 100vw"
        preload={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}
