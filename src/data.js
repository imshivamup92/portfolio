// ================= EDIT-ME =================
// Sab content yahin hai. Naya skill / project / education add karna ho
// to bas us array me ek aur object daal do. Components ko chhune ki zaroorat nahi.

// Hero terminal: type "cmd" (typed) ya "out" (instant output).
// Output me colored parts: { t: "text", c: "c-green" }
export const terminalLines = [
  { type: "cmd", text: "whoami" },
  { type: "out", parts: [{ t: "Shivam: Diploma in CSE (BTEUP) + BS in Data Science (IIT Madras)" }] },
  { type: "cmd", text: "cat focus.txt" },
  {
    type: "out",
    parts: [
      { t: "AI", c: "c-purple" }, { t: " · " },
      { t: "Networks", c: "c-blue" }, { t: " · " },
      { t: "Information Security", c: "c-orange" }, { t: " · " },
      { t: "Mobile Apps", c: "c-green" },
    ],
  },
  { type: "cmd", text: "git status" },
  {
    type: "out",
    parts: [
      { t: "On branch " }, { t: "main", c: "c-green" },
      { t: ": building learning tools for students, open to collaboration." },
    ],
  },
];

// About: editor panel me object ki tarah dikhta hai
export const aboutObj = {
  name: "Shivam",
  role: "Computer Science Student",
  education: ["Diploma in Computer Science & Engineering (BTEUP)", "BS in Data Science (IIT Madras)"],
  focus: ["AI", "Computer Networks", "Information Security", "Mobile App Development"],
  stack: ["Python", "JavaScript", "React"],
  building: "Learning tools for students",
  openToWork: true,
};

export const aboutData = [
  "I'm a computer science student working toward two qualifications at once: a diploma in Computer Science and Engineering from BTEUP and a BS in Data Science and Applications from IIT Madras. My interests run across AI, computer networks, information security and mobile app development.",
  "I learn best by building. Most of my projects started as a problem I ran into while studying, and I keep working on them until they're useful to someone else, especially other students.",
];

export const focusData = [
  { title: "Web & App Development", text: "Responsive web apps with React, Tailwind CSS and Vite, deployed on Vercel and GitHub Pages." },
  { title: "Data & AI", text: "Studying data science and AI at IIT Madras, using Python and charting libraries such as Recharts to turn data into dashboards." },
  { title: "Networks & Security", text: "Coursework and hands-on interest in computer networks and information security fundamentals." },
];

export const skillsData = [
  { domain: "languages", items: ["Python", "JavaScript", "HTML/CSS"] },
  { domain: "web / apps", items: ["React", "Tailwind CSS", "Vite", "Mobile app dev"] },
  { domain: "core cs", items: ["Computer networks", "Information security", "Artificial intelligence", "Software engineering"] },
  { domain: "tools", items: ["Git / GitHub", "Vercel", "ReportLab", "Recharts"] },
];

// Sabse recent pehle
export const educationData = [
  { year: "2024 – Present", degree: "BS in Data Science and Applications", school: "IIT Madras", board: "" },
  { year: "2024 – Present", degree: "Diploma in Computer Science & Engineering", school: "Government Polytechnic Sikandra Kanpur Dehat", board: "BTEUP" },
  { year: "2023", degree: "Class 12", school: "S.R.P Inter College Konch", board: "UP Board" },
  { year: "2021", degree: "Class 10", school: "Suraj Gyan Inter College Konch", board: "UP Board" },
];

// link "#" ho to "private repo" badge dikhega
export const projectsData = [
  {
    title: "study-group-hub",
    link: "https://studygrouphub.in/",
    description: "A free educational platform for diploma and B.Tech students, bringing study material together in one place.",
    highlights: ["Notes and previous-year papers", "Practice quizzes for self-assessment", "Dark mode and a notebook-style theme", "Live and in use at studygrouphub.in"],
    tags: ["HTML", "React", "Tailwind CSS", "JavaScript"],
  },
  {
    title: "student-result-analyzer",
    link: "#",
    description: "A React dashboard that turns student result data into clear, interactive visuals.",
    highlights: ["Recharts-based charts for result analysis", "Dark navy theme", "Browser-based data persistence", "Deployed on Vercel"],
    tags: ["React", "Recharts", "Vite"],
  },
];

export const contactData = [
  { tag: "phone", label: "9695740452", href: "tel:+919695740452" },
  { tag: "mail", label: "shivamkumar64426@gmail.com", href: "mailto:shivamkumar64426@gmail.com" },
  { tag: "github", label: "github.com/imshivamup92", href: "https://github.com/imshivamup92" },
  { tag: "linkedin", label: "linkedin.com/in/shivam-kumar-90788031b", href: "https://www.linkedin.com/in/shivam-kumar-90788031b/" },
];

export const langColors = {
  HTML: "#e34c26", React: "#61dafb", "Tailwind CSS": "#38bdf8",
  JavaScript: "#f1e05a", Recharts: "#8884d8", Vite: "#bd34fe", Python: "#3572A5",
};
