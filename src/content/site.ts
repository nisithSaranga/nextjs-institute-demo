// Main editing point for branding, navigation, services, process and page copy.
export const site = {
  name: "Nexora Technologies",
  wordmark: "nexora",
  tagline: "Thoughtful technology. Practical solutions.",
  description:
    "Website design and development, computer support and network setup for small businesses.",
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
  hero: {
    eyebrow: "Websites · IT support · Networks",
    title: "Technology that works for",
    accent: "your business.",
    description:
      "A better website. A smoother workday. A more connected workspace. We help small businesses make technology simpler, one practical solution at a time.",
  },
  introduction: {
    eyebrow: "A practical technology partner",
    title: "Less friction. More room to do your thing.",
    description:
      "Your technology should help you get on with business. Nexora brings web development, everyday computer support and network setup into one clear conversation — starting with what you need, not a list of products.",
  },
  cta: {
    eyebrow: "Let’s make it work",
    title: "Have a project in mind? Or a problem to untangle?",
    description:
      "Tell us what you’re working on. We’ll help you figure out a sensible next step.",
  },
  about: {
    title: "Good technology starts with understanding your business.",
    description:
      "Nexora Technologies is built around a straightforward idea: small businesses deserve websites and IT that are useful, understandable and easy to look after.",
    focusTitle: "One conversation. A clearer way forward.",
    focus:
      "A website that no longer reflects your business. A computer that slows down your day. A connection that drops where you need it most. These are different problems, but they all start with listening, checking the details and agreeing on a plan.",
    scope:
      "Our focus is websites, computer maintenance and small-business networks. We explain the options, agree the scope before work begins and leave you with practical guidance for what comes next.",
    image: "/images/nexora/development.webp",
    imageAlt: "A laptop with a code editor open in a simple desktop workspace.",
  },
  pageDescriptions: {
    home: "Practical websites, IT support and network solutions for small businesses from Nexora Technologies.",
    about:
      "Learn how Nexora approaches small-business technology with clear communication, maintainable solutions and practical support.",
    services:
      "Explore website design and development, IT support and computer maintenance, and network setup and troubleshooting.",
    projects:
      "Explore three clearly labelled website concepts for restaurant, professional-services and computer-repair businesses.",
    contact:
      "Discuss a website, computer support or network project with Nexora. Call or prepare an enquiry to review and send in WhatsApp.",
  },
};

export const services = [
  {
    id: "websites" as const,
    number: "01",
    title: "Website design & development",
    shortTitle: "Websites",
    icon: "web" as const,
    summary:
      "A clear, responsive website that helps people understand your business and take the next step.",
    description:
      "From a first business website to a considered redesign, we turn your content and goals into a site that feels natural to use. The focus is clear structure, readable pages and a straightforward path to enquiry.",
    situations:
      "For a business launching online, outgrowing a basic website or making its services easier to find on mobile.",
    includes: [
      "Page structure, content planning and visual direction",
      "Responsive design for phones, tablets and desktops",
      "Accessible navigation, forms and basic page metadata",
      "Build review, launch preparation and editing guidance",
    ],
    enquiry:
      "I’d like to discuss website design and development for my business.",
  },
  {
    id: "it-support" as const,
    number: "02",
    title: "IT support & computer maintenance",
    shortTitle: "IT support",
    icon: "computer" as const,
    summary:
      "Make everyday computer problems easier to understand, resolve and prevent.",
    description:
      "When devices interrupt your work, the first step is to understand what is happening. We help diagnose computer issues, work through software and hardware options, and plan sensible maintenance around the way you work.",
    situations:
      "For slow computers, recurring software issues, new device setup or a workspace that needs a more organised maintenance routine.",
    includes: [
      "Computer troubleshooting and performance checks",
      "Operating system, driver and software setup",
      "Hardware upgrade and replacement guidance",
      "Backup planning and everyday device-care guidance",
    ],
    enquiry:
      "I need help with IT support or computer maintenance. Here is the issue:",
  },
  {
    id: "networks" as const,
    number: "03",
    title: "Network setup & troubleshooting",
    shortTitle: "Networks",
    icon: "network" as const,
    summary:
      "Connect your workspace with a network planned around your devices and day-to-day use.",
    description:
      "A useful network starts with knowing what needs to connect and where. We help plan wired and wireless setups, configure equipment and investigate connection issues without jumping straight to unnecessary replacements.",
    situations:
      "For a new workspace, weak Wi-Fi coverage, unreliable connections or devices that need to share a network.",
    includes: [
      "Wired and Wi-Fi network planning",
      "Router, switch and access-point configuration",
      "Connectivity checks and fault isolation",
      "Guest-network guidance and documented settings",
    ],
    enquiry:
      "I’d like help with network setup or troubleshooting. Here is what I need:",
  },
];

export const principles = [
  {
    title: "Clear communication",
    description:
      "Plain-language updates, agreed priorities and room to ask questions. You should know what is happening and why.",
  },
  {
    title: "Maintainable solutions",
    description:
      "Simple structures, documented choices and a handover you can use. We consider what happens after the initial setup.",
  },
  {
    title: "Practical support",
    description:
      "Start with the issue and the tools you already have. Choose an approach that fits your work, rather than adding complexity.",
  },
];

export const process = [
  {
    title: "Understand",
    description:
      "Share your goals, your current setup and what is getting in the way.",
  },
  {
    title: "Plan",
    description:
      "Review the options and agree on the scope, priorities and next steps.",
  },
  {
    title: "Build & check",
    description:
      "Develop or configure the solution, with practical checks and your feedback.",
  },
  {
    title: "Hand over",
    description:
      "Walk through the result, document the essentials and discuss ongoing needs.",
  },
];

export const faqs = [
  {
    question: "Can you help if I’m not sure which service I need?",
    answer:
      "Yes. Describe the problem or the outcome you want. A short conversation can help identify whether the next step is a website review, a computer check or a closer look at your network.",
  },
  {
    question: "What should I prepare for a website discussion?",
    answer:
      "Bring a short description of your business, the pages you have in mind and any existing brand material. A few examples of websites you like are useful too. You do not need a finished brief to start.",
  },
  {
    question: "How are scope and costs agreed?",
    answer:
      "We first discuss the work and any dependencies, then agree on a scope and proposed cost before starting. Hardware, hosting and other third-party requirements are discussed separately where relevant.",
  },
  {
    question: "Should I share passwords in my enquiry?",
    answer:
      "No. An initial description of the issue is enough. Please leave out passwords, private files and sensitive account information. Any access needed for the work can be discussed later.",
  },
];
