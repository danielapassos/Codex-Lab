export type MemberSocialLinks = {
  instagram?: string;
  linkedin?: string;
  x?: string;
  tiktok?: string;
};

export type MemberShowcaseLink = {
  label: string;
  href: string;
};

export type MemberProject = {
  name: string;
  summary: string;
  href?: string;
};

export type MemberSection = {
  title: string;
  body: string;
};

export type MemberProfile = {
  headline: string;
  majorYear: string;
  location: string;
  builderType: string;
  interests: string[];
  tools: string[];
  projects: MemberProject[];
  repoDemoLinks: MemberShowcaseLink[];
  about: string;
  customSections: MemberSection[];
};

export type Member = {
  id: string;
  name: string;
  university?: string;
  website?: string;
  avatar?: string;
  links: MemberSocialLinks;
  profile: MemberProfile;
};

type RawMember = Omit<Member, "links" | "profile"> & {
  links: MemberSocialLinks;
  profile?: Partial<MemberProfile>;
};

function normalizeUrl(value?: string, baseUrl?: string) {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  if (/^www\./i.test(trimmedValue)) {
    return `https://${trimmedValue}`;
  }

  if (!baseUrl) {
    return trimmedValue;
  }

  const normalizedHandle = trimmedValue.replace(/^@/, "");

  return `${baseUrl}${normalizedHandle}/`;
}

function normalizeText(value?: string) {
  return value?.trim() || undefined;
}

function normalizeStringList(values: string[] | undefined, fallback: string[]) {
  const normalizedValues = values?.map((value) => value.trim()).filter(Boolean) ?? [];

  return normalizedValues.length > 0 ? normalizedValues : fallback;
}

function normalizeProjects(
  projects: MemberProject[] | undefined,
  fallback: MemberProject[],
) {
  const normalizedProjects: MemberProject[] = [];

  for (const project of projects ?? []) {
    const name = project.name.trim();
    const summary = project.summary.trim();
    const href = normalizeUrl(project.href);

    if (!name || !summary) {
      continue;
    }

    normalizedProjects.push(
      href
        ? {
            name,
            summary,
            href,
          }
        : {
            name,
            summary,
          },
    );
  }

  return normalizedProjects.length > 0 ? normalizedProjects : fallback;
}

function normalizeShowcaseLinks(
  links: MemberShowcaseLink[] | undefined,
  fallback: MemberShowcaseLink[],
) {
  const normalizedLinks =
    links
      ?.map((link) => {
        const label = link.label.trim();
        const href = normalizeUrl(link.href);

        if (!label || !href) {
          return null;
        }

        return {
          label,
          href,
        };
      })
      .filter((link): link is MemberShowcaseLink => link !== null) ?? [];

  return normalizedLinks.length > 0 ? normalizedLinks : fallback;
}

function normalizeSections(
  sections: MemberSection[] | undefined,
  fallback: MemberSection[],
) {
  const normalizedSections =
    sections
      ?.map((section) => {
        const title = section.title.trim();
        const body = section.body.trim();

        if (!title || !body) {
          return null;
        }

        return {
          title,
          body,
        };
      })
      .filter((section): section is MemberSection => section !== null) ?? [];

  return normalizedSections.length > 0 ? normalizedSections : fallback;
}

function createStarterProfile(member: {
  name: string;
  university?: string;
  website?: string;
}): MemberProfile {
  return {
    headline: member.university
      ? `Student builder in the Codex Lab cohort at ${member.university}.`
      : "Student builder in the Codex Lab cohort.",
    majorYear: "Add your major and graduation year.",
    location: "Add your city, campus, or timezone.",
    builderType: "Student builder",
    interests: [
      "Add the topics you care about",
      "Share what problems excite you",
    ],
    tools: [
      "List the tools you use most",
      "Include Codex, APIs, and frameworks",
    ],
    projects: [
      {
        name: "Add a project or startup",
        summary:
          "Describe what you are building, why it matters, and what stage it is in.",
      },
    ],
    repoDemoLinks: member.website
      ? [
          {
            label: "Personal site",
            href: member.website,
          },
        ]
      : [],
    about: `${member.name} can use this page to introduce themselves, explain what they are building, and add anything else they want the cohort to know. Replace this starter copy with your own voice.`,
    customSections: [
      {
        title: "Add something extra",
        body: "Use custom sections for experiments, media, notes, favorite prompts, build logs, hackathon recaps, or anything else that feels like you.",
      },
    ],
  };
}

function normalizeProfile(
  member: RawMember,
  fallbackProfile: MemberProfile,
): MemberProfile {
  return {
    headline: normalizeText(member.profile?.headline) ?? fallbackProfile.headline,
    majorYear: normalizeText(member.profile?.majorYear) ?? fallbackProfile.majorYear,
    location: normalizeText(member.profile?.location) ?? fallbackProfile.location,
    builderType:
      normalizeText(member.profile?.builderType) ?? fallbackProfile.builderType,
    interests: normalizeStringList(member.profile?.interests, fallbackProfile.interests),
    tools: normalizeStringList(member.profile?.tools, fallbackProfile.tools),
    projects: normalizeProjects(member.profile?.projects, fallbackProfile.projects),
    repoDemoLinks: normalizeShowcaseLinks(
      member.profile?.repoDemoLinks,
      fallbackProfile.repoDemoLinks,
    ),
    about: normalizeText(member.profile?.about) ?? fallbackProfile.about,
    customSections: normalizeSections(
      member.profile?.customSections,
      fallbackProfile.customSections,
    ),
  };
}

function normalizeMember(member: RawMember): Member {
  const university = normalizeText(member.university);
  const website = normalizeUrl(member.website);
  const starterProfile = createStarterProfile({
    name: member.name,
    university,
    website,
  });

  return {
    ...member,
    university,
    website,
    links: {
      instagram: normalizeUrl(member.links.instagram, "https://www.instagram.com/"),
      linkedin: normalizeUrl(member.links.linkedin),
      x: normalizeUrl(member.links.x, "https://x.com/"),
      tiktok: normalizeUrl(member.links.tiktok, "https://www.tiktok.com/@"),
    },
    profile: normalizeProfile(member, starterProfile),
  };
}

const rawMembers: RawMember[] = [
  {
    id: "jason-yi",
    name: "Jason Yi",
    university: "UC Berkeley",
    avatar: "/avatars/students/jason-yi.jpg",
    links: {
      instagram: "@jasonyi33",
      linkedin: "https://www.linkedin.com/in/jasonyi33/",
      x: "@jasonyi361",
      tiktok: "@jasonyi33",
    },
    profile: {
      headline: "Student builder in the Codex Lab cohort at UC Berkeley.",
      majorYear: "Electrical Engineering and Computer Sciences, 2029",
      location: "Berkeley, CA / Pacific Time",
      builderType: "Student builder",
      interests: ["Product", "Entrepreneurship", "Football", "Basketball", "Music", "Travel"],
      tools: ["Codex", "Next.js", "React", "Tailwind CSS", "Framer Motion", "Vitest", "Playwright"],
      projects: [
        {
          name: "VoiceReach",
          href: "https://...",
          summary: "VoiceReach is a voice-first case documentation app for homeless outreach workers. Built at the SF10x Hackathon, it lets staff speak notes into their phone, then transcribes and structures them into case reports with location and photos. Outreach workers often spend hours writing reports after shifts. VoiceReach turns that into a quick voice workflow in the field, improving data quality and coordination. The project later won the hackathon, piloted with a few NGOS, and was presented on the main stage at OpenAI DevDay 2025 alongside the San Francisco mayor.",
        },
      ],
      repoDemoLinks: [
        { label: "GitHub", href: "https://github.com/jasonyi33/voicereach" },
        { label: "LinkedIn", href: "https://www.linkedin.com/posts/jasonyi33_startup-openai-ai-activity-7381744127388033024-XUkN" },
        { label: "X", href: "https://x.com/..." },
      ],
      about: "Short personal intro.",
      customSections: [
        {
          title: "An AI use that inspired me",
          body: "One of my fellow presenters at OpenAI DevDay 2025, Patrick, built SolveSF, a tool used by thousands of SF residents to report problems and get help. I was inspired by his work and the impact it has on the community.",
        },
        {
          title: "What I want to build/learn next",
          body: "Currently excited about AI agents in the sales and commerce space. Currently working on a project to automate workflow for auto dealerships to streamline the car buying process.",
        },
      ],
    },
  },
  {
    id: "jay-khemchandani",
    name: "Jay Khemchandani",
    university: "Stanford",
    avatar: "/avatars/students/jay-khemchandani.jpg",
    links: {
      linkedin: "www.linkedin.com/in/jay-khemchandani",
      x: "jaykhem_",
    },
    profile: {
      headline:
        "Stanford student studying Computer Science (AI track) and Philosophy, with a focus on building AI systems that are practical, human-centered, and high impact.",
      majorYear: "Computer Science (AI track) + Philosophy",
      location: "Palo Alto, CA",
      builderType: "AI builder",
      interests: [
        "Applied AI",
        "Human-centered technology",
        "Assistive robotics",
        "LLM products",
        "Automation",
        "Startup building",
      ],
      tools: [
        "Python",
        "OpenAI APIs",
        "Computer vision",
        "NLP",
        "RAG systems",
        "Next.js",
      ],
      projects: [
        {
          name: "Baymax",
          summary:
            "An AI-powered assistive robot built at TreeHacks to help elderly and physically impaired users interact with their environment more independently.",
          href: "https://devpost.com/software/baymax-your-personal-healthcare-companion",
        },
        {
          name: "The Magic Table",
          summary:
            "A 2026 TreeHacks project exploring how VLMs, LLMs, and embedded systems can make everyday surfaces more accessible for people with limited mobility.",
          href: "https://devpost.com/software/the-magic-table",
        },
      ],
      repoDemoLinks: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/jay-khemchandani",
        },
        {
          label: "Devpost",
          href: "https://devpost.com/jaykhem",
        },
        {
          label: "Vulcan Systems",
          href: "https://vulcansystems.ai",
        },
      ],
      about:
        "Jay is a Stanford student in Computer Science (AI track) and Philosophy who likes building AI products at the intersection of technical ambition and real human need. His work centers on applied AI, assistive technology, and automation, with an emphasis on turning fast prototypes into tools that feel genuinely useful in the real world.",
      customSections: [
        {
          title: "What’s next",
          body: "Jay is interested in building the next generation of manufacturing and distribution technology systems. Vulcan Systems is the current direction for that work, with a focus on designing practical, high-leverage software and AI infrastructure for how real-world operations run.",
        },
      ],
    },
  },
  {
    id: "jake-grigorian",
    name: "Jake Grigorian",
    university: "USC",
    avatar: "/avatars/students/jake-grigorian.jpg",
    links: {
      instagram: "@jake.grigorian",
      linkedin: "https://linkedin.com/in/jakegrigorian",
    },
  },
  {
    id: "dylan-li",
    name: "Dylan Li",
    university: "University of Michigan",
    website: "https://www.lidylan.dev",
    avatar: "/avatars/students/dylan-li.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/lidylan/",
    },
    profile: {
      headline:
        "Computer Science and Engineering Physics student at the University of Michigan building AI products, developer tools, and research-driven side projects.",
      majorYear: "B.S.E. in Computer Science and Engineering Physics",
      location: "Ann Arbor, Michigan",
      builderType: "Student builder focused on AI products, dev tools, and research",
      interests: [
        "AI products",
        "Developer tools",
        "Startups",
        "Physics",
        "Problem-solving",
      ],
      tools: [
        "Next.js",
        "React",
        "TypeScript",
        "Python",
        "FastAPI",
        "LangGraph",
      ],
      projects: [
        {
          name: "GlitterCode",
          summary:
            "An AI tutor for block coding education that explains code, walks students through step-by-step tutorials, and can make small edits itself.",
        },
        {
          name: "Grok Lens",
          summary:
            "A research and learning notebook that turns Grokipedia pages into an interactive AI study partner inspired by NotebookLM.",
          href: "https://devpost.com/software/grok-lens?ref_content=my-projects-tab&ref_feature=my_projects",
        },
        {
          name: "clAI",
          summary:
            "A natural-language command line assistant that translates prompts into shell commands and won the MHacks 2025 Google Gemini Track.",
          href: "https://github.com/cryplo/mhacks25",
        },
        {
          name: "V1 Michigan Shipmas",
          summary:
            "A 12-project sprint built over 12 days for the V1 Michigan Shipmas challenge, with each build shaped by the prompt of the day.",
          href: "https://shipmas-gallery.vercel.app",
        },
      ],
      repoDemoLinks: [
        {
          label: "Personal site",
          href: "https://www.lidylan.dev",
        },
        {
          label: "GitHub",
          href: "https://github.com/Cryplo",
        },
        {
          label: "Resume",
          href: "https://www.lidylan.dev/resume.pdf",
        },
        {
          label: "Shipmas gallery",
          href: "https://shipmas-gallery.vercel.app",
        },
      ],
      about:
        "I'm Dylan, a University of Michigan student who likes building AI tools, exploring startups and physics, and turning ideas into side projects. Lately I've been bouncing between product studio, research, and hackathon builds while writing about the journey on my blog.",
      customSections: [
        {
          title: "What I'm doing now",
          body: "I'm part of the V1 Michigan W26 Product Studio cohort and the Future of Programming Lab, where I'm researching Vim-style keybinds and action macros in the Hazel editor.",
        },
        {
          title: "Outside of coding",
          body: "When I'm not building, I'm usually at the gym, out on a run with friends, trying good food, or seeing how high I can push my MonkeyType score.",
        },
        {
          title: "Writing",
          body: "I blog about the ride too, including MHacks 2025, xAI Tech Day 2025 in NYC, and xAI Hackathon 2025 in the Bay.",
        },
      ],
    },
  },
  {
    id: "mark-music",
    name: "Mark Music",
    university: "Stanford",
    avatar: "/avatars/students/mark-music.jpg",
    links: {
      instagram: "https://www.instagram.com/markmusic2727/",
      linkedin: "https://www.linkedin.com/in/markmusic27/",
      x: "https://x.com/markmusic27",
    },
  },
  {
    id: "james-masson",
    name: "James Masson",
    university: "Yale",
    avatar: "/avatars/students/james-masson.jpg",
    links: {
      instagram: "@jameswmasson",
      linkedin: "https://www.linkedin.com/in/james-masson-94a390257/",
    },
    profile: {
      headline:
        "Sophomore at Yale studying Computer Science and Mathematics, focused on secure local-first ML integrations.",
      majorYear: "Computer Science and Mathematics, Sophomore",
      location: "New York City",
      builderType: "Secure local-first AI builder",
      interests: [
        "Machine learning model integration",
        "Secure, locally stored data systems",
        "AI workflow automation for small businesses",
        "Optical communication security",
      ],
      tools: [
        "Machine learning models",
        "Local-first data architectures",
        "AI workflow automation",
        "Optical communication analysis",
      ],
      projects: [
        {
          name: "Aiku",
          summary:
            "Startup focused on integrating AI into small owner-operated business workflows.",
        },
        {
          name: "NADE",
          summary:
            "Software to detect perturbations and potential attacks on satellite beams using optical communication.",
        },
      ],
      about:
        "I am James Masson, a sophomore at Yale studying Computer Science and Mathematics. I'm from New York City, and I'm very passionate about integrating machine learning models for secure, locally stored data. Currently, I'm working on Aiku, a startup focused on integrating AI into small owner-operated business workflows, as well as NADE - software to detect perturbations and potential attacks on satellite beams using optical communication.",
      customSections: [
        {
          title: "Current Focus",
          body:
            "Building secure and practical AI systems for real-world environments, from small business workflows to resilient communications infrastructure.",
        },
      ],
    },
  },
  {
    id: "joseph-jojoe",
    name: "Joseph Jojoe",
    avatar: "/avatars/students/joseph-jojoe.jpg",
    links: {
      instagram: "https://www.instagram.com/josephjojoe_/",
      linkedin: "https://www.linkedin.com/in/josephjojoe/",
      x: "https://x.com/josephjojoe",
    },
  },
  {
    id: "soham-kolhe",
    name: "Soham Kolhe",
    avatar: "/avatars/students/soham-kolhe.jpg",
    links: {
      instagram: "soham.kolhe7",
      linkedin: "https://www.linkedin.com/in/soham-kolhe/",
    },
  },
  {
    id: "ryan-fernandes",
    name: "Ryan Fernandes",
    university: "Yale",
    website: "https://www.ryanfernanpage.com/home",
    avatar: "/avatars/students/ryan-fernandes.jpg",
    links: {
      instagram: "@ryanmartie",
      linkedin: "https://www.linkedin.com/in/ryan-fernandes-088109284/",
    },
    profile: {
      headline:
        "EECS student at Yale University from Natick, Massachusetts who loves building products, leading teams, and learning fast.",
      majorYear: "Electrical Engineering and Computer Science, Class of 2028",
      location: "New Haven, Connecticut",
      builderType: "Methodical, learning-oriented full-stack builder and technical team lead",
      interests: [
        "Building products that help students connect and collaborate",
        "Learning new technologies through ambitious side projects",
        "Designing polished user experiences for technical tools",
        "Team-based building and mentorship",
      ],
      tools: [
        "TypeScript",
        "React",
        "Next.js",
        "Python",
        "JavaScript",
        "MongoDB",
        "Firebase",
        "Git",
        "Tailwind CSS",
        "Figma",
      ],
      projects: [
        {
          name: "y/labs",
          summary:
            "Led the overhaul of Yale's research connection platform into y/labs, helping grow usage from a handful of weekly users to more than 1,000 new users in the first two weeks after launch.",
          href: "https://yalelabs.io",
        },
        {
          name: "Yale Computer Society",
          summary:
            "Serves as Co-President of Yale's premier tech organization, supporting 70+ student developers, live campus products, and new opportunities for members.",
          href: "https://yalecomputersociety.org/",
        },
        {
          name: "Document conversion pipeline",
          summary:
            "Building a UI-based document conversion workflow during a Red Hat internship to make document-to-Markdown and JSON processing easier for RAG and fine-tuning workflows.",
          href: "https://docling-document-ingestion.netlify.app/feedback-implementation",
        },
        {
          name: "Mario Kart Yale",
          summary:
            "Co-building a live competitive Mario Kart experience for Yale students with ID scan-in, realtime stats, and streaming-oriented infrastructure.",
          href: "https://github.com/MarioKartYale",
        },
      ],
      repoDemoLinks: [
        {
          label: "Personal site",
          href: "https://www.ryanfernanpage.com/home",
        },
        {
          label: "Resume",
          href: "https://www.ryanfernanpage.com/resume.pdf",
        },
        {
          label: "GitHub",
          href: "https://github.com/Ryfernandes",
        },
        {
          label: "Yale Computer Society",
          href: "https://yalecomputersociety.org/",
        },
      ],
      about:
        "Ryan is an EECS student at Yale University who got his start founding a Scratch Club in fifth grade and still approaches projects with the same energy for learning, iteration, and collaboration. He now leads the Yale Computer Society, a community of student developers building projects for Yale's campus, and enjoys taking on ambitious technical work that turns rough ideas into polished, useful products.",
      customSections: [
        {
          title: "Beyond building",
          body:
            "Outside of tech, Ryan loves singing, baking French macarons, playing Spikeball, and following the Buffalo Bills. He is highly competitive, team-oriented, and always up for a game as long as there is a little fun and friendly trash talk involved.",
        },
      ],
    },
  },
];

export const members = rawMembers.map(normalizeMember);

export const memberIds = members.map((member) => member.id);

export function getMemberById(memberId: string) {
  return members.find((member) => member.id === memberId);
}
