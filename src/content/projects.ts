// Design explorations only. These are not completed client engagements.
export const projects = [
  {
    id: "olive-ember",
    name: "Olive & Ember",
    category: "Restaurant website",
    audience:
      "Diners comparing menus and planning a meal out, often on a phone.",
    theme: "restaurant" as const,
    headline: "Good food. Good company.",
    summary:
      "A welcoming restaurant concept that brings the menu and the dining experience into focus.",
    goal: "Help a visitor get a feel for the restaurant, browse food options on a phone and find a clear route to a reservation enquiry.",
    features: [
      "Readable menu sections with dietary notes",
      "Atmospheric imagery and a simple restaurant story",
      "A prominent reservation-enquiry action",
      "Space for verified location and opening details",
    ],
    direction:
      "Warm neutrals, editorial type and photography give this concept a relaxed, inviting rhythm.",
    image: "/images/nexora/restaurant.webp",
  },
  {
    id: "northline",
    name: "Northline Advisory",
    category: "Professional-services website",
    audience:
      "Business owners looking for a clear explanation of a professional practice’s services.",
    theme: "advisory" as const,
    headline: "Clarity for your next move.",
    summary:
      "A calm, structured concept for a professional practice with a focused service offering.",
    goal: "Make a complex service easy to understand, help visitors identify the right area of support and guide them toward an initial conversation.",
    features: [
      "Separate explanations for each service area",
      "A clear, step-by-step engagement overview",
      "Accessible frequently asked questions",
      "A concise enquiry flow with useful context",
    ],
    direction:
      "A muted blue palette, generous spacing and a strong information hierarchy keep the focus on the offer.",
  },
  {
    id: "circuit-desk",
    name: "Circuit Desk",
    category: "Computer-repair website",
    audience:
      "People with a device problem who need to understand the next step before making an enquiry.",
    theme: "repair" as const,
    headline: "Let’s get you back to work.",
    summary:
      "A practical repair-business concept designed around the problem a visitor needs to solve.",
    goal: "Help people explain a device issue, understand the assessment process and prepare a useful support enquiry without sharing sensitive information.",
    features: [
      "Service navigation based on common device issues",
      "A transparent assessment-process explanation",
      "A guided enquiry with device and issue details",
      "Direct telephone and WhatsApp contact options",
    ],
    direction:
      "Charcoal, mint accents and a simple device illustration make the concept clear and approachable.",
  },
];
export type Project = (typeof projects)[number];
