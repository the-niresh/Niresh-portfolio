import project2 from "../assets/projects/project-2.jpg";
import aitodopro from "../assets/projects/aitodopro.png";
import wiseadvicesai from "../assets/projects/wiseadvicesai.jpg";
import autonerds from "../assets/projects/autonerds.png";
import foodspector from "../assets/projects/foodspector.png";
import chemlaxx from "../assets/projects/chemlaxx.png";

export const NAME = "Niresh"
export const WEBSITE_URL = "https://niresh.in/"
export const LINKEDIN_URL = "https://www.linkedin.com/in/the-niresh/"
export const GITHUB_URL = "https://github.com/the-niresh"
export const INSTAGRAM_URL = "https://www.instagram.com/the_niresh/"
export const TWITTER_URL = "https://x.com/the_niresh"
export const WHATSAPP_URL = "https://wa.me/+919488186900"
export const CV_URL = "https://drive.google.com/file/d/YOUR_AI_CV_PDF_ID/view?usp=drive_link" // Upload Nire-AA-CV.pdf and replace ID

export const TODO_PRO_URL = "https://todo-render-ooo8.onrender.com/"
export const AI_TODO_PRO_URL = "https://todo-pro-iota.vercel.app/"
export const WISEADVICES_AI_URL = "https://wiseadvices-ai.vercel.app/"
// New project URLs
export const AUTONERDS_URL = "https://autonerds-ai.vercel.app"
export const FOODSPECTOR_URL = "https://foodspector.vercel.app"
export const CHEMLAX_URL = "https://chem-laxx.vercel.app"

export const HERO_CONTENT_1 = `AI Automation Engineer and Full Stack Developer specializing in APIs, LLMs, and n8n workflows. Hands-on with production-grade automations for real business processes.`;

export const HERO_CONTENT_2 = `Build scalable apps with React, Next.js, Node.js, Convex, PostgreSQL, Supabase; integrate AI for efficiency via n8n workflows, error handling, third-party APIs.`;

export const HERO_CONTENT_3 = `Deliver high-impact solutions: automate operations, enhance decisions, reduce manual work by 30-40% in freelance projects for food auditing and chemicals.`;

export const ABOUT_TEXT = `AI Automation Engineer with expertise in production-grade n8n workflows, API-driven automations, and AI systems. Full-stack skills: React.js/Next.js frontend, Node.js/Express.js backend, databases (MongoDB, PostgreSQL, Supabase, Convex), tools (Redis, Docker, AWS, Cypress). Focus on reliability—edge cases, failures, retries. Track record: fixed 250+ bugs, optimized for 15k+ datasets, open-sourced 80% of product, delivered freelance apps solving real processes. Own problems end-to-end in collaborative environments.`;
export const ABOUT_TECHNOLOGIES = ["n8n", "React", "Node.js", "Next.js", "Convex", "Supabase", "Neon", "MongoDB", "Mongoose", "PostgreSQL", "Express.js", "TypeScript", "Redux", "Redis", "Socket.io", "Shadcn-UI", "Clerk", "OAuth", "Webhooks", "Make.com", "Zapier", "OpenAI", "Anthropic", "LLMs", "Chatbots", "AWS", "Google Cloud", "Docker", "CI/CD", "Jenkins", "Concourse", "Kafka", "Cypress", "Cucumber", "Puppeteer", "Lightning.js", "Postman", "Stripe", "Slack", "ClickUp", "Zoho", "Typeform", "S3", "Lambda", "EC2", "CloudWatch", "AG-Grid"];

export const SKILLS = {
  automation_ai: ["n8n (complex workflows, webhooks, error handling, retries)", "LLM integrations (OpenAI, streaming, guardrails)", "AI chatbots for operational workflows", "Secure webhook-based systems"],
  backend_data: ["REST APIs, third-party integrations", "JavaScript (advanced data transformations)", "Convex, Postgres/SQL, Supabase", "Authentication & permissions design"],
  tools_platforms: ["Zoho, ClickUp, Slack, Stripe, Typeform (integrations)", "Git, Postman", "Node.js, Next.js (for automation services)"],
  frontend: ["React.js, JavaScript, Typescript, HTML, CSS, Tailwind, Redux, Next.js"],
  backend: ["Node.js, Express.js, Restful APIs, MongoDB, PostgreSQL"],
  other: ["AWS, Docker, Redis, Kafka, CI/CD, Jenkins, Concourse", "Testing & Automation: Cypress, Cucumber, Glue", "Agile Methodologies, Responsive Design, Git, Cross-Browser Compatibility"]
};

export const EXPERIENCES = [
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
    title: "Universal Automation-Connected Chatbot",
    image: autonerds,
    url: AUTONERDS_URL,
    description: "Universal chatbot connecting to n8n/Zapier/Make.com workflows via secure webhooks.\n- Solves redundant rebuilding for agencies: single interface reusable across clients.\n- Reduces dev time 35%, revenue boost 30%, 40% faster AI delivery.\n- Focuses on logic over UI.",
    technologies: ["Next.js", "n8n", "Webhooks", "AI Integrations", "Supabase/Clerk"],
  },
  {
    title: "FoodSpector: Food Auditing WebApp",
    image: foodspector,
    url: FOODSPECTOR_URL,
    description: "App for freelance inspectors managing audits, replacing paper/WhatsApp.\n- Checklists with photos/notes, offline, auto-scoring, tamper-proof PDFs, dashboards.\n- FSSAI/HACCP compliant; 40+ auditors in TN/Karnataka.\n- Prioritizes correctness, reduces disputes.",
    technologies: ["React/Next.js", "Node.js", "Supabase/PostgreSQL", "n8n", "Puppeteer"],
  },
  {
    title: "Chemical Industry AI Decision Chatbot",
    image: chemlaxx,
    url: CHEMLAX_URL,
    description: "AI chatbot for chemical selection based on constraints (budget, quantity, environment).\n- Recommends solutions, reduces trial-error, ensures consistency.\n- Streaming responses, structured reasoning, guardrails for high-impact decisions.",
    technologies: ["Next.js", "OpenAI/Anthropic APIs", "Supabase", "Tailwind", "Shadcn-UI"],
  },
  {
    title: "AI-Todo-Pro",
    image: aitodopro,
    url: AI_TODO_PRO_URL,
    description: "AI todo app for collaborative tasks.\n- AI suggests fragmentation; real-time updates.",
    technologies: ["Next.js", "Supabase", "OpenAI-API", "OAuth", "GCP", "Tailwind", "Shadcn-UI"],
  },
  {
    title: "WiseAdvices-AI",
    image: wiseadvicesai,
    url: WISEADVICES_AI_URL,
    description: "AI advice app on best practices.",
    technologies: ["Next.js", "Supabase", "Clerk", "OpenAI-API", "Anthropic-API", "Tailwind", "Shadcn-UI"],
  },
  {
    title: "Todo-Pro..!!",
    image: project2,
    url: TODO_PRO_URL,
    description: "Collaborative todo with sprint tracking.",
    technologies: ["React", "Node", "MongoDB", "Express", "Socket.io", "Tailwind", "AG-Grid"],
  },
];

export const CONTACT = {
  address: "12/155-1, Mohan Nagar, Salem-30",
  phoneNo: "+91 9488186900",
  email: "niresh@yeahscene.com",
};