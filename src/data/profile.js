// Single source for everything the site says about Dorje. Edit here, not in the screens.
const CAREER_START = new Date(2017, 8); // Sep 2017, first .NET job

// LV = full years since the first job; XP = progress through the current year (0-1).
export function career(now = new Date()) {
  const years = (now - CAREER_START) / (365.25 * 24 * 3600 * 1000);
  return { lv: Math.max(1, Math.floor(years)), xp: years % 1 };
}

export const profile = {
  name: "Dorje Lama",
  title: "Senior Software Engineer",
  className: ".NET Engineer",
  guild: "Cloud Pro AI",
  home: "Kathmandu, Nepal",
  summary: [
    "Hi! I am Dorje Lama, a Senior Software Engineer (.NET) at Cloud Pro AI.",
    "I have been building software for the IT and services industry since 2017.",
    "My main weapons: .NET, ASP.NET Core, React, Tailwind CSS, MS SQL, jQuery and IIS.",
    "I studied BSc. CSIT at Trinity International College.",
  ],
  links: {
    email: "dorjelama08@gmail.com",
    linkedin: "https://www.linkedin.com/in/dorjelama/",
    github: "https://github.com/dorjelama",
  },
};

export const jobs = [
  {
    role: "Senior Software Engineer",
    org: "Cloud Pro AI Pvt. Ltd.",
    place: "Maharajgunj, Kathmandu",
    from: "Mar 2024",
    to: "Present",
  },
  {
    role: ".NET Developer",
    org: "Silicon Soft & IT Consultant Pvt. Ltd.",
    place: "Shantinagar, Kathmandu",
    from: "Jul 2020",
    to: "Apr 2024",
  },
  {
    role: "Intern → Junior .NET Developer",
    org: "Channakya Software Pvt. Ltd.",
    place: "Sinamangal, Kathmandu",
    from: "Sep 2017",
    to: "Jul 2020",
  },
];

export const sideQuests = [
  { role: "BSc. CSIT", org: "Trinity International College", from: "2013", to: "2017" },
  { role: ".NET Training", org: "Broadway Infosys", from: "2017", to: "2017" },
  { role: "+2 Science", org: "Himalaya Int'l Model Secondary School", from: "2011", to: "2013" },
];

// icon: a react-icons/md name, resolved in Projects.jsx
export const projects = [
  {
    name: "Collateral Specialists",
    icon: "MdFactCheck",
    stack: ["ASP.NET MVC", "Web API"], // not on the CV, inferred from the repo name: check
    text: "Manages the inspection process customers request. The system assigns a field rep to inspect collateral (properties, equipment, assets), then hands over to the business firm for analysis, reports and follow-ups, tracking status and results between banks, field reps and the firm.",
  },
  {
    name: "Real Estate Management System",
    icon: "MdHomeWork",
    stack: [".NET Core API", "ReactJS", "Tailwind CSS"],
    text: "A full solution for the real estate sector: property listings, secure user authentication, and search and filter options, with a .NET Core API backend and a React + Tailwind frontend.",
  },
  {
    name: "Ayurbeda Information Management System",
    icon: "MdLocalFlorist",
    stack: ["ASP.NET Core MVC", "jQuery", "Bootstrap", "MS SQL"],
    text: "Manages Ayurvedic information: patient records, treatment plans, herbal remedies, wellness tracking and pharmacy inventory. I also designed the SQL database.",
  },
  {
    name: "Channakya Base",
    icon: "MdAccountBalance",
    stack: ["ASP.NET MVC", "AJAX", "MS SQL"],
    text: "A complete system for financial institutions covering setup, financial transactions and reporting. It uses AJAX to avoid full-page post-backs. I designed the database: queries, stored procedures, functions and views.",
  },
];

// shortcut: levels are self-rated defaults, tune them to taste (0-100).
// logo: file name in src/assets, or null for a text badge.
export const skills = [
  { name: "C#", level: 90, logo: "CSharp.png" },
  { name: ".NET / ASP.NET Core", level: 90, logo: "dotnet.png" },
  { name: "ASP.NET MVC", level: 88, logo: null },
  { name: "Web API", level: 85, logo: null },
  { name: "MS SQL", level: 85, logo: "mssql.png" },
  { name: "ADO.NET", level: 78, logo: null },
  { name: "JavaScript", level: 80, logo: "Javascript.png" },
  { name: "jQuery", level: 80, logo: "jQuery.png" },
  { name: "React", level: 72, logo: "react.png" },
  { name: "Tailwind CSS", level: 75, logo: "tailwindcss.png" },
  { name: "NUnit", level: 65, logo: null },
  { name: "IIS", level: 70, logo: null },
  { name: "Git", level: 80, logo: null },
];

export const sections = [
  { id: "about", label: "About", place: "Dorje's House" },
  { id: "quests", label: "Quest Log", place: "Guild Hall" },
  { id: "projects", label: "Projects", place: "Workshop" },
  { id: "skills", label: "Skills", place: "Dojo" },
  { id: "contact", label: "Contact", place: "Post Office" },
];
