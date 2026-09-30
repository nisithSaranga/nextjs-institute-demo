// Local stock photography, not Nexora premises or staff. Credits: docs/ASSETS.md.
export const pageImages = {
  about: {
    src: "/images/nexora/development.webp",
    alt: "A laptop and code editor in a considered desktop workspace.",
    position: "50% 55%",
    mobilePosition: "40% center",
  },
  services: {
    src: "/images/nexora/networking.webp",
    alt: "Ethernet cables connecting a compact network switch.",
    position: "70% center",
    mobilePosition: "65% center",
  },
  projects: {
    src: "/images/nexora/workspace.webp",
    alt: "Website code on a laptop screen.",
    position: "75% center",
    mobilePosition: "75% center",
  },
  contact: {
    src: "/images/nexora/development.webp",
    alt: "A laptop on a desk ready for project planning.",
    position: "center 65%",
    mobilePosition: "40% center",
  },
  websites: {
    src: "/images/nexora/workspace.webp",
    alt: "Website development code displayed on a laptop.",
    position: "70% center",
    mobilePosition: "70% center",
  },
  "it-support": {
    src: "/images/nexora/it-support.webp",
    alt: "Technicians inspecting the internal components of a laptop.",
    position: "center 65%",
    mobilePosition: "65% center",
  },
  networks: {
    src: "/images/nexora/networking.webp",
    alt: "Connected Ethernet ports on a small network switch.",
    position: "center",
    mobilePosition: "60% center",
  },
} as const;
export type PageImage = {
  src: string;
  alt: string;
  position: string;
  mobilePosition: string;
};
