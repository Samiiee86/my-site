/* One config for the whole header. Adding a product is a data change here —
   never a layout change. Every panel width is the sum of its own contents. */

export type RichItem = {
  name: string;
  icon: string;
  desc: string;
  badge?: string;
};
export type PlainItem = { name: string };

export type Group =
  | { caption: string; rich: true; items: RichItem[] }
  | { caption: string; rich?: false; items: PlainItem[] };

export type RailBlock = { caption: string; items: string[] };
export type Card = {
  name: string;
  desc: string;
  image: string;
  cta?: string;
};

/* a product row in the new Products panel: name, optional one-liner, badge */
export type DescItem = { name: string; desc?: string; badge?: string };

export type ProductsMenu = {
  kind: "products";
  key: string;
  label: string;
  width: number;
  kane: { caption: string; items: DescItem[] };
  agentTest: { caption: string; items: DescItem[] };
  cloud: { caption: string; items: DescItem[] };
  quality: { caption: string; items: DescItem[] };
};

export type PanelMenu = {
  kind: "panel";
  key: string;
  label: string;
  width: number;
  cols: string;
  gap: string;
  railWidth: number;
  groups: Group[];
  rail?: RailBlock[];
  cardsCaption?: string;
  cards?: Card[];
};

export type GridMenu = {
  kind: "grid";
  key: string;
  label: string;
  width: number;
  useCases: string[];
  teamSize: string[];
  quote: { title: string; cta: string };
  aiBuilds: string[];
  erp: string[];
};

export type PlainNav = { kind: "plain"; key: string; label: string };

export type NavEntry = ProductsMenu | GridMenu | PanelMenu | PlainNav;

export const announcement = {
  text: "TestMu Conf '26 is live — 80+ sessions on air now.",
  cta: "Enter event →",
};

export const headerActions = {
  search: "⌘K",
  signIn: "Login",
  sales: "Book a Demo",
  start: "Start now",
};

export const NAV: NavEntry[] = [
  {
    kind: "products",
    key: "products",
    label: "Products",
    width: 1080,
    kane: {
      caption: "AI writes it. Kane proves it.",
      items: [
        { name: "KaneAI", desc: "The testing agent. Licensed per agent." },
        {
          name: "Kane CLI",
          desc: "Free terminal companion to KaneAI.",
          badge: "New",
        },
      ],
    },
    agentTest: {
      caption: "Test the AI agents you build",
      items: [
        { name: "Conversational agents", desc: "Chat, voice and phone" },
        { name: "Video agents", desc: "Screen-share and video sessions" },
        { name: "IVR & voice", desc: "Phone trees and voice journeys" },
        {
          name: "Agent Assurance",
          desc: "Grades every criterion against observed evidence",
          badge: "Waitlist",
        },
      ],
    },
    cloud: {
      caption: "Run tests on cloud",
      items: [
        { name: "Automation", desc: "Selenium, Cypress and Playwright" },
        { name: "HyperExecute", desc: "Fastest execution grid" },
        { name: "Live Testing", desc: "Manual cross-browser sessions" },
        { name: "Real Device Cloud", desc: "Web and mobile on real devices" },
        { name: "App Automation", desc: "Native iOS and Android automation" },
        { name: "Browser Cloud", desc: "Infrastructure for AI agents" },
      ],
    },
    quality: {
      caption: "Quality and management",
      items: [
        { name: "Test Manager", desc: "Cases, runs and coverage" },
        { name: "SmartUI", desc: "Visual regression testing" },
        { name: "Accessibility Testing", desc: "WCAG audits, automated" },
        { name: "Performance Testing", desc: "JMeter load testing" },
      ],
    },
  },
  {
    kind: "grid",
    key: "solutions",
    label: "Solutions",
    width: 1080,
    useCases: [
      "Cross browser testing",
      "Mobile app testing",
      "Web application testing",
      "Responsive testing",
      "API testing",
      "Functional testing",
      "Regression testing",
      "Automated UI testing",
      "Continuous testing",
      "Shift left testing",
      "Codeless testing",
      "Low code testing",
      "Geolocation testing",
      "Localization testing",
      "Local page testing",
    ],
    teamSize: [
      "Startups",
      "Growing teams",
      "Enterprise",
      "Public sector",
      "Professional services",
    ],
    quote: { title: "Not sure which plan?", cta: "Get a quote" },
    aiBuilds: ["Vibe coding", "Lovable", "Bolt", "v0", "Cursor", "Replit"],
    erp: [
      "Salesforce",
      "SAP",
      "Oracle",
      "Workday",
      "ServiceNow",
      "NetSuite",
      "Dynamics 365",
      "Coupa",
    ],
  },
  {
    kind: "panel",
    key: "resources",
    label: "Resources",
    width: 919,
    cols: "190px 190px 190px",
    gap: "28px",
    railWidth: 232,
    groups: [
      {
        caption: "Developers",
        items: [
          { name: "Documentation" },
          { name: "API reference" },
          { name: "Languages & frameworks" },
          { name: "GitHub repositories" },
          { name: "Status page" },
          { name: "Changelog" },
        ],
      },
      {
        caption: "Learn",
        items: [
          { name: "Blog" },
          { name: "Learning Hub" },
          { name: "Customer stories" },
          { name: "Webinars" },
          { name: "Certifications" },
          { name: "Testing glossary" },
        ],
      },
      {
        caption: "Company",
        items: [
          { name: "About us" },
          { name: "Careers" },
          { name: "Partners" },
          { name: "Community" },
          { name: "Press" },
          { name: "LambdaTest is TestMu AI" },
        ],
      },
    ],
    rail: [
      {
        caption: "What's new",
        items: [
          "TestMu Conf /26",
          "Live webinars this week",
          "Open QA job board",
        ],
      },
    ],
  },
  {
    kind: "panel",
    key: "agents",
    label: "AI Agents",
    width: 925,
    cols: "224px 224px",
    gap: "28px",
    railWidth: 376,
    groups: [
      {
        caption: "Automate with agents",
        items: [
          { name: "AI agent testing" },
          { name: "AI test authoring" },
          { name: "AI visual testing" },
          { name: "AI test planning" },
          { name: "AI root cause analysis" },
          { name: "AI accessibility testing" },
        ],
      },
      {
        caption: "Agent operations",
        items: [
          { name: "AI test orchestration" },
          { name: "AI test insights" },
          { name: "AI flaky test detection" },
          { name: "AI regression analysis" },
          { name: "AI coverage analysis" },
          { name: "AI performance analysis" },
        ],
      },
    ],
    cardsCaption: "New product",
    cards: [
      {
        name: "Introducing Agent Assurance",
        desc: "Reads your codebase, derives the suite, and grades every criterion against observed evidence.",
        image: "/img/kane-cli-card.png",
        cta: "Join the waitlist",
      },
    ],
  },
  { kind: "plain", key: "pricing", label: "Pricing" },
];
