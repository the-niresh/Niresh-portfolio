import project1 from "../assets/projects/project-1.jpg";
import project2 from "../assets/projects/project-2.jpg";
import portfolio from "../assets/projects/project-3.jpg";
import Xclone from "../assets/projects/X-clone.png";

export const NAME = "Niresh"
export const WEBSITE_URL = "https://niresh.in/"
export const LINKEDIN_URL = "https://www.linkedin.com/in/the-niresh/"
export const GITHUB_URL = "https://github.com/the-niresh"
export const INSTAGRAM_URL = "https://www.instagram.com/the_niresh/"
export const TWITTER_URL = "https://x.com/the_niresh"
export const CV_URL = "https://drive.google.com/file/d/1KsB9mBeA8Zr_33fVSMbS6Ie_y4X-_G7s/view?usp=drive_link"
export const PROJECT_1_URL = "https://nire-twitter-clone.onrender.com"

export const HERO_CONTENT = `I am a passionate full stack developer with a knack for crafting robust and scalable web applications. With 3 years of hands-on experience, I have honed my skills in front-end technologies like React and Next.js, as well as back-end technologies like Node.js, RestAPI, PostgreSQL, and MongoDB. My goal is to leverage my expertise to create innovative solutions that drive business growth and deliver exceptional user experiences.`;

export const ABOUT_TEXT = `I am a dedicated and versatile full stack developer with a passion for creating efficient and user-friendly web applications. With 3 years of professional experience, I have worked with a variety of technologies, including React, Next.js, Node.js, RestAPI, PostgreSQL, and MongoDB. I have also worked with other few technologies like Tailwind, Redis, Bootstrap Cypress, Docker, AWS, & Concourse. My journey in web development began with a deep curiosity for how things work, and it has evolved into a career where I continuously strive to learn and adapt to new challenges. I thrive in collaborative environments and enjoy solving complex problems to deliver high-quality solutions. Outside of coding, I enjoy staying active, exploring new technologies, learning new stuffs & SuDoKu.`;

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
];

export const PROJECTS = [
  {
    title: "E-Commerce Website",
    image: project1,
    description:
      "A fully functional e-commerce website with features like product listing, shopping cart, and user authentication.",
    technologies: ["HTML", "CSS", "React", "Node.js", "MongoDB"],
  },
  {
    title: "Twitter(X)-clone",
    url: PROJECT_1_URL,
    image: Xclone,
    description:
      "This is just a clone of X formerly known as Twitter with MERN stack and Tailwind CSS",
    technologies: ["React", "Node", "MongoDB", "Express", "Tailwind"],
  },
  {
    title: "Task Management App",
    image: project2,
    description:
      "An application for managing tasks and projects, with features such as task creation, assignment, and progress tracking.",
    technologies: ["HTML", "CSS", "Angular", "Firebase"],
  },
  {
    title: "Personal Portfolio",
    url: WEBSITE_URL,
    image: portfolio,
    description:
      "Built a personal portfolio website that you're currently going through with React & Tailwind.",
    technologies: ["React", "Tailwind","HTML", "CSS"],
  },
];

export const CONTACT = {
  address: "12/155-1, Mohan Nagar, Salem-30",
  phoneNo: "+91 9488186900",
  email: "nireshine@gmail.com",
};
