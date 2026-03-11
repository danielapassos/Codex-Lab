export type MemberLinks = {
  github?: string;
  linkedin?: string;
  x?: string;
  other?: string;
};

export type Member = {
  id: string;
  name: string;
  focus: string;
  website?: string;
  avatar?: string;
  disciplines: string[];
  domains: string[];
  links: MemberLinks;
  connections: string[];
};

export const members: Member[] = [
  {
    id: "dani-park",
    name: "Dani Park",
    focus: "Agent systems and reusable orchestration patterns",
    website: "https://danipark.dev",
    disciplines: ["Engineering", "Research"],
    domains: ["Agents", "Developer tools", "Automation"],
    links: {
      github: "https://github.com/danipark",
      linkedin: "https://www.linkedin.com/in/danipark",
      x: "https://x.com/danipark",
    },
    connections: ["mira-patel", "jules-mercer", "rowan-lee"],
  },
  {
    id: "mira-patel",
    name: "Mira Patel",
    focus: "Human-in-the-loop workflow design for Lab experiments",
    website: "https://miraforms.studio",
    disciplines: ["Design", "Product"],
    domains: ["Automation", "Education", "Creative tools"],
    links: {
      linkedin: "https://www.linkedin.com/in/mirapatel",
      other: "https://read.cv/mirapatel",
    },
    connections: ["dani-park", "jules-mercer", "priya-sol", "max-ortega"],
  },
  {
    id: "jules-mercer",
    name: "Jules Mercer",
    focus: "Developer experience for multi-agent tooling",
    website: "https://julesmercer.dev",
    disciplines: ["Engineering", "Product"],
    domains: ["Developer tools", "Automation"],
    links: {
      github: "https://github.com/julesmercer",
      x: "https://x.com/julesmercer",
    },
    connections: ["dani-park", "mira-patel", "sage-bell", "noor-akhtar"],
  },
  {
    id: "noor-akhtar",
    name: "Noor Akhtar",
    focus: "Applied research for knowledge systems and memory layers",
    disciplines: ["Research"],
    domains: ["Knowledge systems", "Education", "Agents"],
    links: {
      linkedin: "https://www.linkedin.com/in/noorakhtar",
    },
    connections: ["jules-mercer", "rowan-lee", "tess-kim"],
  },
  {
    id: "rowan-lee",
    name: "Rowan Lee",
    focus: "Scientific workflows for agentic labs",
    website: "https://rowanlee.science",
    disciplines: ["Research", "Engineering"],
    domains: ["Science", "Agents", "Automation"],
    links: {
      github: "https://github.com/rowanlee",
      other: "https://scholar.google.com/rowanlee",
    },
    connections: ["dani-park", "noor-akhtar", "sage-bell"],
  },
  {
    id: "tess-kim",
    name: "Tess Kim",
    focus: "Creative interfaces and toolmaking for collaborative prompts",
    website: "https://tesskim.co",
    disciplines: ["Design", "Engineering"],
    domains: ["Creative tools", "Automation"],
    links: {
      github: "https://github.com/tesskim",
      linkedin: "https://www.linkedin.com/in/tesskim",
    },
    connections: ["noor-akhtar", "max-ortega", "elliot-rivera"],
  },
  {
    id: "elliot-rivera",
    name: "Elliot Rivera",
    focus: "Community operations for the builders around the Lab",
    disciplines: ["Community", "Operations"],
    domains: ["Community tooling", "Education"],
    links: {
      linkedin: "https://www.linkedin.com/in/elliotrivera",
    },
    connections: ["tess-kim", "max-ortega", "priya-sol"],
  },
  {
    id: "priya-sol",
    name: "Priya Sol",
    focus: "Pilot design and product strategy for Lab programs",
    website: "https://priyasol.com",
    disciplines: ["Product"],
    domains: ["Automation", "Community tooling"],
    links: {
      linkedin: "https://www.linkedin.com/in/priyasol",
      x: "https://x.com/priyasol",
    },
    connections: ["mira-patel", "elliot-rivera", "sage-bell"],
  },
  {
    id: "max-ortega",
    name: "Max Ortega",
    focus: "Narrative systems, launches, and operator storytelling",
    website: "https://maxortega.media",
    disciplines: ["Storytelling", "Community"],
    domains: ["Creative tools", "Education"],
    links: {
      x: "https://x.com/maxortega",
      other: "https://maxortega.substack.com",
    },
    connections: ["mira-patel", "tess-kim", "elliot-rivera"],
  },
  {
    id: "sage-bell",
    name: "Sage Bell",
    focus: "Ops infrastructure for experiments and reliable rollouts",
    disciplines: ["Operations", "Engineering"],
    domains: ["Automation", "Developer tools"],
    links: {
      github: "https://github.com/sagebell",
      linkedin: "https://www.linkedin.com/in/sagebell",
    },
    connections: ["jules-mercer", "rowan-lee", "priya-sol"],
  },
  {
    id: "noah-cho",
    name: "Noah Cho",
    focus: "Evaluation harnesses for Lab prototypes",
    website: "https://noahcho.dev",
    disciplines: ["Research", "Engineering"],
    domains: ["Agents", "Developer tools"],
    links: {
      github: "https://github.com/noahcho",
      linkedin: "https://www.linkedin.com/in/noahcho",
    },
    connections: ["dani-park", "jules-mercer", "sage-bell"],
  },
  {
    id: "ada-flores",
    name: "Ada Flores",
    focus: "Learning design and knowledge publishing for the Lab",
    disciplines: ["Design", "Storytelling"],
    domains: ["Education", "Knowledge systems"],
    links: {
      other: "https://www.are.na/ada-flores",
    },
    connections: ["noor-akhtar", "max-ortega", "mira-patel"],
  },
];
