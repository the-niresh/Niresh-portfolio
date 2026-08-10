import autonerds from "../assets/projects/autonerds.png";
import foodspector from "../assets/projects/foodspector.png";
import chemlaxx from "../assets/projects/chemlaxx.png";
import alientrade from "../assets/projects/alientrade.png";
import agentdeck from "../assets/projects/agentdeck.svg";
import cex from "../assets/projects/cex.png";

export const NAME = "Niresh"
export const WEBSITE_URL = "https://niresh.in/"
export const LINKEDIN_URL = "https://www.linkedin.com/in/the-niresh/"
export const GITHUB_URL = "https://github.com/the-niresh"
export const INSTAGRAM_URL = "https://www.instagram.com/the_niresh/"
export const TWITTER_URL = "https://x.com/the_niresh"
export const WHATSAPP_URL = "https://wa.me/+919488186900"
export const CV_URL = "https://drive.google.com/file/d/1Fux0I_RjHHCyumTS6KjX-aPrMoWLuPav/view?usp=sharing" // Upload Nire-AA-CV.pdf and replace ID

export const AUTONERDS_URL = "https://autonerds-ai.vercel.app"
export const FOODSPECTOR_URL = "https://foodspector.pro"
export const ALIEN_TRADE_URL = "https://alien-trade-web.vercel.app"
export const AGENT_DECK_URL = "https://agent.niresh.tech"
export const CHEMLAX_URL = "https://chem-laxx.vercel.app"
export const CEX_URL = "https://cex.niresh.tech"
export const CEX_REPO_URL = "https://github.com/the-niresh/cex"

// Engineer-first positioning (2026-07-24). Real work only — no fabricated claims.
export const HERO_CONTENT_1 = `Full-stack & AI systems engineer. I build production systems end to end — a multi-tenant SaaS, autonomous agents, and the infrastructure behind them. Ex-Tata Elxsi.`;

export const HERO_CONTENT_2 = `Ship with React, Next.js, Node.js, Convex, PostgreSQL on Cloudflare and AWS — and the parts that actually matter in production: auth, tenant isolation, data integrity, background jobs, tests, and cost control.`;

export const HERO_CONTENT_3 = `Currently building FoodSpector — a multi-tenant food-compliance platform — and autonomous developer tooling for shipping software with AI agents.`;

export const ABOUT_TEXT = `Full-stack and AI systems engineer. I build production systems end to end — frontend (React / Next.js), backend (Node.js / Convex / Postgres), and the infrastructure around them (auth, background jobs, object storage, tests, CI/CD). Comfortable with the hard parts most demos skip: multi-tenant isolation, data integrity, retries, and edge cases. Previously a Senior Engineer at Tata Elxsi — fixed 250+ bugs, built UIs over 15k+ record datasets, and helped open-source 80% of a product. Now building FoodSpector (a multi-tenant compliance platform) and autonomous/AI tooling on the side. I own problems end to end.`;

export const ABOUT_TECHNOLOGIES = ["React", "Next.js", "TypeScript", "Node.js", "Express.js", "Convex", "PostgreSQL", "Supabase", "Neon", "MongoDB", "Prisma", "Redis", "Cloudflare Workers", "R2", "Docker", "AWS", "CI/CD", "n8n", "OpenAI", "Anthropic", "LLMs", "Playwright", "Cypress", "Socket.io", "Shadcn-UI", "Tailwind", "OAuth", "Webhooks", "Stripe", "Kafka"];

export const SKILLS = {
  systems_ai: ["Multi-tenant architecture & authorization design", "LLM integrations (OpenAI/Anthropic, streaming, guardrails)", "Autonomous agents & background job pipelines", "Secure webhook-based systems"],
  backend_data: ["REST APIs, third-party integrations", "JavaScript/TypeScript (advanced data transformations)", "Convex, Postgres/SQL, Supabase", "Authentication, permissions & tenant isolation"],
  frontend: ["React.js, Next.js, TypeScript, Tailwind, Redux, Shadcn-UI"],
  infra_testing: ["Cloudflare Workers/R2, AWS, Docker, Redis, Kafka, CI/CD", "Playwright, Cypress, Cucumber", "Responsive design, cross-browser, Git"],
};

export const EXPERIENCES = [
  {
    year: "2025 - Present",
    role: "Founding Engineer",
    company: "FoodSpector · YeahScene",
    description: `Building FoodSpector, a multi-tenant food-compliance SaaS, end to end:\n- One Convex backend enforcing three separate authorization models (store membership, record ownership, engagement-scoped third-party audits) with tenant isolation.\n- Auto-generated compliance PDF reports via a Cloudflare Workers + R2 + queue pipeline.\n- 450+ backend tests guarding data integrity; immutable, tamper-evident audit records.`,
    technologies: ["Next.js", "React", "TypeScript", "Convex", "Cloudflare Workers", "R2", "Tailwind", "Playwright", "LLMs"],
  },
  {
    year: "2023 - 2024",
    role: "Senior Engineer",
    company: "TATA ELXSI",
    description: `Designed Employee History & Status Portal using React, Node.js, MongoDB, Express.js, Redis:\n- Responsive UI for 15k+ datasets, integrated REST APIs.\n- Reduced response times via Redis caching; exceeded benchmarks.\n- Fixed backend bugs, mentored juniors.\nContributed to open-sourcing TV-OTT tool: Node.js/Express.js, Lightning.js, Cypress; open-sourced 80%.`,
    technologies: ["React", "Node.js", "MongoDB", "Express.js", "Redis", "REST APIs", "Lightning.js", "Cypress", "CI/CD"],
  },
  {
    year: "2021 - 2023",
    role: "Engineer",
    company: "TATA ELXSI",
    description: `Developed OTT certification tool using Node.js/Express.js, Lightning.js, Cypress/Cucumber:\n- Automated APIs, fixed 250+ bugs, optimized boot-up by 30s.\n- Extended tests to 40+ features (30% contribution).\n- Improved load times beyond thresholds.`,
    technologies: ["Node.js", "Express.js", "Lightning.js", "Cypress", "REST APIs", "CI/CD", "Cucumber"],
  },
  {
    year: "2021",
    role: "Software Developer - Intern",
    company: "Sandeza Inc.",
    description: `Built voice agents on AWS with Node.js/Express.js:\n- Trained on S3, Lambda, EC2, CloudWatch.`,
    technologies: ["Node.js", "Express.js", "AWS", "S3", "Lambda", "EC2", "CloudWatch"],
  },
];

export const PROJECTS = [
  {
    title: "cex — Spot Exchange in Rust",
    image: cex,
    url: CEX_URL,
    repo: CEX_REPO_URL,
    description: "A centralised spot exchange, built end to end: order book, matching, settlement, live market data and a trading screen.\n- The exchange is one deterministic state machine — apply(state, command) → events — running single-threaded over a durable Redis command log, so the whole state can be rebuilt by replaying it.\n- Money never becomes a float. Prices and quantities are integers everywhere, including in the browser, which parses the JSON text itself because JSON.parse would round a 64-bit integer first.\n- Four processes: engine owns state, api speaks HTTP, ws fans out market data, persist writes history to Postgres. The engine never waits on the database.\n- A gap in the market-data feed is assumed, not hoped against: every update carries a sequence number, and a book that misses one is marked stale until a fresh snapshot arrives.\n- 412 Rust tests, plus a Playwright suite that registers, deposits and trades against the real exchange — no mock backend anywhere.",
    technologies: ["Rust", "Tokio", "Axum", "Redis", "PostgreSQL", "SQLx", "WebSocket", "React", "TypeScript", "Playwright", "Docker", "Traefik"],
  },
  {
    title: "FoodSpector — Multi-tenant Food-Compliance SaaS",
    image: foodspector,
    url: FOODSPECTOR_URL,
    description: "A multi-tenant compliance platform for the food industry — audits, checklists, and immutable records.\n- One Convex backend enforcing three separate authorization models with strict tenant isolation.\n- Auto-generated PDF reports via a Cloudflare Workers + R2 + queue pipeline.\n- 450+ backend tests; tamper-evident records (corrections make a new version, never a silent edit).",
    technologies: ["Next.js", "React", "TypeScript", "Convex", "Cloudflare Workers", "R2", "Tailwind", "Playwright", "LLMs"],
  },
  {
    title: "Alien-Trade — Autonomous Trading Agent",
    image: alientrade,
    url: ALIEN_TRADE_URL,
    description: "An autonomous crypto-trading agent (BNB Hack 2026).\n- Deterministic Python decision core, Convex real-time state bus, and a cockpit PWA.\n- Drawdown-first discipline: validated honestly — including recording when flat cash beat the live strategy.\n- Built for reliability and ops rigor over hype.",
    technologies: ["Python", "Convex", "PWA", "BNB Chain", "Real-time", "Testing"],
  },
  {
    title: "agent-deck — Self-Hosted Agent Orchestration Platform",
    image: agentdeck,
    url: AGENT_DECK_URL,
    description: "A self-hosted kanban board for running coding agents, forked and hardened after the upstream project sunset.\n- Rust: Tokio, Axum, SQLx, Postgres — 30+ crates, real .sql migrations.\n- Found and fixed 3 real security holes upstream never patched (invitation bypass, OAuth redirect validation, open registration).\n- Runs in production on my own VPS behind Traefik + Let's Encrypt.",
    technologies: ["Rust", "Tokio", "Axum", "Postgres", "SQLx", "Traefik"],
  },
  {
    title: "Universal Automation-Connected Chatbot",
    image: autonerds,
    url: AUTONERDS_URL,
    description: "Universal chatbot connecting to n8n/Zapier/Make.com workflows via secure webhooks.\n- Solves redundant rebuilding for agencies: a single interface reusable across clients.\n- Focuses on logic and integration over UI.",
    technologies: ["Next.js", "Convex", "n8n", "Tailwind", "Shadcn-UI", "Webhooks", "LLMs", "Auth", "Payments"],
  },
  {
    title: "Chemical Industry AI Decision Chatbot",
    image: chemlaxx,
    url: CHEMLAX_URL,
    description: "AI chatbot for chemical selection based on constraints (budget, quantity, environment).\n- Recommends solutions, reduces trial-and-error, ensures consistency.\n- Streaming responses, structured reasoning, guardrails for high-impact decisions.",
    technologies: ["Next.js", "OpenAI/Anthropic APIs", "Convex", "Shadcn-UI", "Tailwind"],
  },
];

// Home address removed for privacy (2026-07-24).
export const CONTACT = {
  phoneNo: "+91 9488186900",
  email: "niresh@yeahscene.com",
};
