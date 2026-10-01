// Editable Nexora adaptations of the saved reference's inner-page patterns.
// These describe service scope, not completed engagements or qualifications.
export const serviceDetails: {
    id: string;
    image: string;
    alt: string;
    badge: string;
    title: string;
    subtitle?: string;
    message: string;
    groups: {
        id?: string;
        title: string;
        items: string[];
    }[];
}[] = [
    { id: "websites", image: "development", alt: "Illustrative laptop displaying development work", badge: "Website development", title: "Website design & development", message: "Hello Nexora, I would like to discuss a website for my business.", groups: [
            { title: "What we can work on", items: ["Business goals and the purpose of each page", "A clear sitemap and straightforward navigation", "Content planning around your products or services", "Layouts that adapt to phones, tablets and desktops", "Readable typography and a consistent visual direction", "Accessible links, controls and enquiry forms", "Page titles, descriptions and basic search metadata", "Image preparation and sensible loading behaviour", "Review, launch preparation and a practical handover"] },
            { title: "A practical approach", items: ["Clear scope: agree which pages and features are needed before building.", "Useful content: help visitors understand your business and take the next step.", "Maintainable choices: consider how the site will be updated after launch."] },
            { title: "Part of the conversation", items: ["Your existing brand, logo and available content", "Examples that communicate the direction you like", "The devices your visitors are likely to use", "Hosting and domain requirements, agreed separately", "Editing guidance and any ongoing support needs"] },
            { title: "A good starting point for", items: ["A small business preparing its first website", "An existing website that needs a clearer structure", "A service business improving its mobile enquiry journey"] }
        ] },
    { id: "it-support", image: "it-support", alt: "Illustrative computer maintenance workspace", badge: "Connected workspaces", title: "IT support & networks", subtitle: "Understand the issue. Plan a sensible next step.", message: "Hello Nexora, I would like help with IT support or network setup. Here is my current setup:", groups: [
            { title: "Computer support & maintenance", items: ["Discuss the symptoms and when the issue occurs", "Review your current computer and software setup", "Check everyday performance and recurring slowdowns", "Investigate operating-system and application issues", "Review driver and software setup requirements", "Plan a new computer's initial configuration", "Consider hardware upgrade or replacement options", "Check connected printers and everyday peripherals", "Discuss storage needs and file organisation", "Review backup options and recovery expectations", "Identify practical maintenance priorities", "Explain checks before making configuration changes", "Agree access and any work that affects your files", "Review the result against the original issue", "Leave practical device-care and setup guidance"] },
            { id: "networks", title: "Network setup & troubleshooting", items: ["Plan wired and Wi-Fi connections around the workspace", "Review router, switch and access-point requirements", "Investigate weak coverage or unreliable connections", "Configure agreed equipment and check device access", "Discuss guest networks and basic access separation", "Document useful settings and explain the handover"] }
        ] }
];
export const capabilities = [
    { title: "Website planning", description: "Purpose, page structure and useful content", image: "workspace" },
    { title: "Development", description: "Responsive pages and clear enquiry journeys", image: "development" },
    { title: "Computer care", description: "Troubleshooting and practical maintenance", image: "it-support" },
    { title: "Networks", description: "Connected devices and workspace setup", image: "networking" }
];

// All photographs are local illustrative stock; credits remain in docs/ASSETS.md.
export const evidencePhotos = {
  workspace: { src: '/images/nexora/workspace.webp', alt: 'A laptop displaying website code in a workspace', position: 'center 55%', mobilePosition: '72% center' },
  development: { src: '/images/nexora/development.webp', alt: 'A laptop and code editor on a desk', position: 'center 55%', mobilePosition: '40% center' },
  'it-support': { src: '/images/nexora/it-support.webp', alt: 'Technicians examining the internal components of a laptop', position: 'center 56%', mobilePosition: '64% center' },
  networking: { src: '/images/nexora/networking.webp', alt: 'Ethernet cables connected to a compact network switch', position: 'center 52%', mobilePosition: '65% center' },
  restaurant: { src: '/images/nexora/restaurant.webp', alt: 'An illustrative restaurant interior', position: 'center', mobilePosition: 'center' },
} as const;
export const evidenceGallery = ['workspace', 'it-support', 'networking', 'development', 'restaurant', 'networking', 'workspace', 'it-support'] as const;
