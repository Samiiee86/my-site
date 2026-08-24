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
  industries: string[];
  segments: { name: string; desc: string }[];
  contact: { label: string; cta: string };
  erp: string[];
};

export type PlainNav = { kind: "plain"; key: string; label: string };

export type NavEntry = PanelMenu | GridMenu | PlainNav;

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
    kind: "panel",
    key: "products",
    label: "Products",
    width: 989,
    cols: "318px 318px",
    gap: "28px",
    railWidth: 264,
    groups: [
      {
        caption: "Agent platforms",
        rich: true,
        items: [
          {
            name: "KaneAI",
            icon: "/img/products/kaneai.svg",
            desc: "World's first end-to-end software testing agent",
          },
          {
            name: "Kane CLI",
            icon: "/img/products/kane-cli.svg",
            desc: "Natural-language E2E flows, run locally",
            badge: "New",
          },
          {
            name: "Agent Testing",
            icon: "/img/products/agent-testing.svg",
            desc: "Test AI agents across chat, voice and video",
          },
          {
            name: "Test Management",
            icon: "/img/products/test-management.svg",
            desc: "AI-native unified test management",
          },
          {
            name: "SmartUI",
            icon: "/img/products/smartui.svg",
            desc: "AI-native visual UI testing on cloud",
          },
          {
            name: "Accessibility Testing Agent",
            icon: "/img/products/accessibility-testing.svg",
            desc: "Test the accessibility of websites and web apps",
          },
        ],
      },
      {
        caption: "Test clouds",
        rich: true,
        items: [
          {
            name: "Agentic Test Cloud",
            icon: "/img/products/agentic-test-cloud.svg",
            desc: "Autonomous end-to-end testing at scale",
          },
          {
            name: "Real Devices Cloud",
            icon: "/img/products/real-devices-cloud.svg",
            desc: "Web and mobile on real devices",
          },
          {
            name: "Test Automation Cloud",
            icon: "/img/products/test-automation-cloud.svg",
            desc: "Run automation on a scalable grid",
          },
          {
            name: "Native App Automation Cloud",
            icon: "/img/products/native-app-automation.svg",
            desc: "End-to-end native app automation",
          },
          {
            name: "HyperExecute",
            icon: "/img/products/hyperexecute.svg",
            desc: "Blazing fast AI-native automation cloud",
          },
          {
            name: "Browser Cloud",
            icon: "/img/products/browser-cloud.svg",
            desc: "Browser infrastructure for AI agents",
          },
        ],
      },
    ],
    rail: [
      {
        caption: "Tools & extensions",
        items: [
          "MCP Server",
          "Accessibility DevTools",
          "Tunnel & local testing",
          "Browser extensions",
        ],
      },
      {
        caption: "Set up & connect",
        items: ["Integrations & plugins", "Browsers & devices supported"],
      },
    ],
  },
  {
    kind: "grid",
    key: "solutions",
    label: "Solutions",
    width: 1012,
    useCases: [
      "Cross browser testing",
      "Responsive testing",
      "Mobile app testing",
      "Performance testing",
      "Geo-location testing",
      "API testing",
      "Local page testing",
      "Test case management",
      "Accessibility testing",
      "Visual regression testing",
      "IVR & voice testing",
      "Low code testing",
      "End-to-end flow automation",
      "Continuous testing",
      "Regression testing",
      "Mobile web testing",
    ],
    industries: [
      "Retail & e-commerce",
      "Financial services",
      "Healthcare",
      "Media & entertainment",
      "Travel & hospitality",
      "Insurance",
    ],
    segments: [
      { name: "Enterprise", desc: "Governance, SSO and scale" },
      { name: "Professional services", desc: "We migrate your suite" },
    ],
    contact: { label: "Get a Quote?", cta: "Contact Our Experts" },
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
    key: "agents",
    label: "AI Agents",
    width: 765,
    cols: "224px 224px",
    gap: "28px",
    railWidth: 216,
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
    cardsCaption: "Newest agent",
    cards: [
      {
        name: "Kane CLI",
        desc: "Natural-language E2E flows from your terminal",
        image: "/img/kane-cli-card.png",
        cta: "Learn more",
      },
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
  { kind: "plain", key: "pricing", label: "Pricing" },
];
