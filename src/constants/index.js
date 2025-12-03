import socially from "../assets/projects/project-1.jpg";
import project2 from "../assets/projects/project-2.jpg";
import aitodopro from "../assets/projects/aitodopro.png";
import wiseadvicesai from "../assets/projects/wiseadvicesai.jpg";
import Xclone from "../assets/projects/X-clone.png";
import Netflix from "../assets/projects/Netflix.png";

export const NAME = "Niresh"
export const WEBSITE_URL = "https://niresh.in/"
export const LINKEDIN_URL = "https://www.linkedin.com/in/the-niresh/"
export const GITHUB_URL = "https://github.com/the-niresh"
export const INSTAGRAM_URL = "https://www.instagram.com/the_niresh/"
export const TWITTER_URL = "https://x.com/the_niresh"
export const CV_URL = "https://drive.google.com/file/d/1KsB9mBeA8Zr_33fVSMbS6Ie_y4X-_G7s/view?usp=drive_link"
export const PROJECT_1_URL = "https://nire-twitter-clone.onrender.com/"
export const NETFLIX_CLONE_URL = "https://netflix-clone-kqqz.onrender.com/"
export const SOCIALLY_CLONE_URL = "https://nextjs-socially-one.vercel.app/"
export const TODO_PRO_URL = "https://todo-render-ooo8.onrender.com/"
export const AI_TODO_PRO_URL = "https://todo-pro-iota.vercel.app/"
export const WISEADVICES_AI_URL = "https://wiseadvices-ai.vercel.app/"

// export const HERO_CONTENT_1 = `I am a full stack developer with a knack for crafting robust and scalable web applications. With 3 years of hands-on industrial experience, I have honed my skills in front-end technologies like React, Next.js & Tailwind-CSS, as well as back-end technologies like Node.js, RestAPI's, PostgreSQL, and MongoDB.`;

// export const HERO_CONTENT_2 = ` In recent times,I've been exploring AI technologies and integrating them into web applications to enhance user interactions and automate complex processes. I gained experie in Vector Database, and automation tools.`
// export const HERO_CONTENT_3 = ` My goal is to leverage my expertise to create innovative solutions that drive business growth and deliver exceptional user experiences.`

export const HERO_CONTENT_1 = `I'm an AI-focused full stack developer with experience in the IT industry and multiple end-to-end freelance projects delivered independently. I build scalable web applications using React, Next.js, Tailwind, Node.js, Convex, PostgreSQL, and MongoDB.`;

export const HERO_CONTENT_2 = `Recently, my work has centered on AI product development and automation — integrating LLMs, building intelligent features, working with vector databases, and creating workflow automations using tools like n8n.`;

export const HERO_CONTENT_3 = `My focus is on building practical, high-impact solutions that automate operations, enhance user experience, and help businesses move faster with AI.`;  

export const ABOUT_TEXT = `I am a full stack developer with a passion for creating efficient and user-friendly web applications. With 3 years of professional experience, I have worked with a variety of technologies, including React, Next.js, Node.js, n8n, TailwindCSS, RestAPI, Convex, PostgreSQL, and MongoDB. I have also worked with other few technologies like Tailwind, Redis, Bootstrap Cypress, Docker, AWS, & Concourse. My journey in web development began with a deep curiosity for how things work, and it has evolved into a career where I continuously strive to learn and adapt to new challenges. I thrive in collaborative environments and enjoy solving complex problems to deliver high-quality solutions. Outside of coding, I enjoy staying active, exploring new technologies, learning new stuffs & SuDoKu.`;

export const EXPERIENCES = [
  {
    year: "2023 - 2024",
    role: "Senior Software Developer",
    company: "TATA ELXSI",
    description: `Designed and developed the Employee History & Status Portal using React, Node, MongoDB, Express, and Redis. Engineered a responsive UI with advanced features leveraging React libraries for comprehensive analysis on over 15k datasets.`,
    technologies: ["React", "Node", "MongoDB", "Express", "Redis", "Bootstrap"],
  },
  {
    year: "2021 - 2023",
    role: "Software Developer",
    company: "TATA ELXSI",
    description: `Contributed in developing an all JavaScript-based automation tool that certifies OTT apps on TV based on API implementation and integration using Node.js/Express.js in Backend and Lightning.js in Frontend. Automated testing processes using Cypress. Fixed over 250+ software bugs and optimized backend logic in Node.js and Lightning.js systems.`,
    technologies: ["Node", "Express","Lightning.js", "Cypress", "RestAPI"],
  },
  {
    year: "2021 - 2021",
    role: "Software Developer - Intern",
    company: "Sandeza Inc.",
    description: `Worked on AWS to build voice agents for businesses using Node.js/Express.js in the backend as a Trainee. Trained on Node.js and AWS services like S3, Lambda, EC2, and CloudWatch.`,
    technologies: ["Node", "Express","AWS", "S3", "EC2", "Lambda", "CloudWatch"],
  },
];

export const PROJECTS = [

  {
    title: "AI-Todo-Pro",
    image: aitodopro,
    url: AI_TODO_PRO_URL,
    description:
      "AI Powered Todo list app that allows users to create, manage, and organize tasks collaboratively. It utilizes AI to suggest ideas to fragment the todo list based on user input and provides real-time updates on task progress.",
    technologies: ["Next.js", "Supabase", "OpenAi-API", "OAuth", "GCP", "Tailwind", "Shadcn-UI"],
  },
  {
    title: "WiseAdvices-AI",
    image: wiseadvicesai,
    url: WISEADVICES_AI_URL,
    description:
      "AI Powered App, Advices you with the best possible way and best practices on respective topics.",
    technologies: ["Next.js", "Supabase", "Clerk", "OpenAi-API", "Anthropic-API", "Tailwind", "Shadcn-UI"],
  },
  {
    title: "Todo-Pro..!!",
    image: project2,
    url: TODO_PRO_URL,
    description:
      "Todo App: An application for managing todos collaboratively, with features such as task creation, assignment, and progress tracking like sprint board.",
    technologies: ["React", "Node", "MongoDB", "Express", "Socket.io", "Tailwind", "AG-Grid"],
  },
  {
    title: "Social Media App",
    url: SOCIALLY_CLONE_URL,
    image: socially,
    description:
      "A fully functional social media website with features like product listing, shopping cart, and user authentication.",
    technologies: ["Next.js", "Typescript", "Tailwind", "prisma", "Shadcn-UI", "clerk"],
  },
  {
    title: "Netflix-clone",
    url: NETFLIX_CLONE_URL,
    image: Netflix,
    description:"This is just a clone of an OTT platform Netflix with MERN stack and Tailwind CSS",
    technologies: ["React", "Node", "MongoDB", "Express", "Tailwind"],
  },
  {
    title: "Twitter(X)-clone",
    url: PROJECT_1_URL,
    image: Xclone,
    description:
      "This is just a clone of X formerly known as Twitter with MERN stack and Tailwind CSS",
    technologies: ["React", "Node", "MongoDB", "Express", "Tailwind", "DaisyUI"],
  },
];

export const CONTACT = {
  address: "12/155-1, Mohan Nagar, Salem-30",
  phoneNo: "+91 9488186900",
  email: "niresh@yeahscene.com",
};
