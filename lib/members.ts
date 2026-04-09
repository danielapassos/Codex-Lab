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
  if (sections && sections.length === 0) {
    return [];
  }

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
    id: "anishrudra",
    name: "Anish Rudra",
    university: "The University of Texas at Austin",
    website: "https://github.com/aniXC12",
    links: {},
    profile: {
      headline:
        "UT Austin student building at the intersection of applied AI infrastructure, agents, and public-markets research.",
      majorYear: "Mechanical Engineering + Management Information Systems, 2026",
      location: "Austin, Texas",
      builderType: "Student builder focused on applied AI infra and agent systems",
      interests: [
        "Running",
        "Reading",
        "Formula 1",
        "NFL",
        "NBA",
        "College Sports",
        "Poker",
      ],
      tools: [
        "Codex",
        "Cursor",
        "Claude Code",
        "Python",
        "React",
        "Loveable",
        "Sigma",
      ],
      projects: [
        {
          name: "Rykos Capital",
          summary:
            "An AI-native hedge fund using autonomous research agents to rapidly parse filings, earnings, and web data to surface public-markets trades.",
        },
        {
          name: "Bloom Technologies",
          summary:
            "An identity and access management platform for AI agents that gives every agent a unique identity, scoped permissions across tools and data, and real-time logging so teams can securely deploy agents into production.",
        },
      ],
      repoDemoLinks: [
        {
          label: "GitHub",
          href: "https://github.com/aniXC12",
        },
      ],
      about:
        "Hi there! I'm Anish, a student at The University of Texas at Austin studying Mechanical Engineering and Management Information Systems. I like to run, watch sports, play poker, eat good food, and explore AI. Right now I'm working with Metis YC on applied AI infra and agents. In my free time I'm building Rykos Capital, an AI-native hedge fund that uses swarms of agents to compile research.",
      customSections: [
        {
          title: "What I'm working on",
          body: "I'm currently working with Metis YC on applied AI infrastructure and agents, with a focus on making agent systems more practical and production-ready.",
        },
        {
          title: "Outside of work",
          body: "Outside of building, I spend time running, keeping up with Formula 1 and every major sports league I can, playing poker, reading, and finding good food around Austin.",
        },
      ],
    },
  },
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
    id: "ben-antonow",
    name: "Ben Antonow",
    university: "University of Michigan 〽️",
    website: "https://anto.now",
    avatar: "/avatars/students/ben-antonow.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/benantonow",
      x: "https://x.com/benantonow",
    },
    profile: {
      headline:
        "University of Michigan CS student building across AI, health tech, and interface-heavy products.",
      majorYear: "Computer Science, Senior",
      location: "Ann Arbor, MI / Palo Alto, CA",
      builderType: "Curious mind 🧠 in a curious world 🌎",
      interests: [
        "Image and diagram generation",
        "Health tech",
        "Wearables",
        "Digital detoxing",
        "Philosophy",
        "Yoga",
        "Dancing",
        "Live music",
      ],
      tools: [
        "Python",
        "C/C++",
        "JavaScript",
        "Go",
        "React",
        "Next.js",
        "AWS",
        "PostgreSQL",
      ],
      projects: [
        {
          name: "Oreen",
          summary:
            "An AI diagram generation tool for teaching and learning, built to make visual explanation easier and faster.",
        },
        {
          name: "Silent Meditation",
          summary:
            "A silent vinyl record project that beat its Kickstarter goal by 1000% and sold hundreds of copies.",
        },
      ],
      repoDemoLinks: [
        {
          label: "Personal site",
          href: "https://anto.now",
        },
        {
          label: "GitHub",
          href: "https://github.com/bantonow",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/benantonow",
        },
      ],
      about:
        "I'm Ben, a student, teacher, and builder at the University of Michigan. I love learning, meeting interesting people, and doing hard things!",
      customSections: [
        {
          title: "Status",
          body: "🟢 Being nerd-sniped by Codex",
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
    university: "Columbia",
    website: "https://www.josephjojoe.com/",
    avatar: "/avatars/students/joseph-jojoe.jpg",
    links: {
      instagram: "https://www.instagram.com/josephjojoe_/",
      linkedin: "https://www.linkedin.com/in/josephjojoe/",
      x: "https://x.com/josephjojoe",
    },
    profile: {
      majorYear: "CS major, graduating 2027",
      location: "New York, NY",
      builderType: "Chronic idea guy",
      interests: [
        "Philanthropy",
        "Social impact",
        "Interpretability",
        "Data science",
        "People mapping",
        "Venture capital",
        "Startups",
        "Fun hacks",
        "Music production",
      ],
      tools: [
        "Cursor",
        "Codex",
        "Claude Code",
        "Linear",
        "AWS",
        "Supabase",
        "Next.js / Vercel",
        "SF Compute",
      ],
      projects: [
        {
          name: "Conviction",
          summary: "Building internal tools for people and investment research",
        },
        {
          name: "Tool Use Axis Research",
          summary:
            "Extending Anthropic's assistant axis paper to show that there is a tool use axis in activation space which can be steered to make models more or less likely to call specific tools",
        },
      ],
      repoDemoLinks: [
        {
          label: "My personal website!",
          href: "https://www.josephjojoe.com/",
        },
      ],
      about:
        "Hey! I'm a junior at Columbia studying CS and Math. I like ML research, exploring startups and the venture ecosystem, and sidequesting.",
      customSections: [],
    },
  },
  {
    id: "soham-kolhe",
    name: "Soham Kolhe",
    university: "University of Wisconsin-Madison",
    website: "https://soham-kolhe-portfolio.vercel.app/",
    avatar: "/avatars/students/soham-kolhe.jpg",
    links: {
      instagram: "soham.kolhe7",
      linkedin: "https://www.linkedin.com/in/soham-kolhe/",
    },
    profile: {
      headline:
        "Freshman at UW-Madison studying Computer Science. Currently researching crop detection AI for the USDA using satellite imagery and deep learning.",
      majorYear: "Computer Science, Class of 2028",
      location: "Madison, WI",
      builderType: "Student builder exploring AI products and applied research",
      interests: [
        "Applied machine learning",
        "Satellite remote sensing and precision agriculture",
        "On-device AI and edge inference",
        "Privacy-first product design",
      ],
      tools: [
        "Python",
        "PyTorch",
        "Next.js",
        "React",
      ],
      projects: [
        {
          name: "arcflow",
          summary:
            "A no-code, entirely local AI pipeline builder that lets you drag, drop, and deploy privacy-first sensor workflows directly on your Snapdragon NPU.",
          href: "https://github.com/aditya-harsh11/MadData-26",
        },
        {
          name: "Portfolio Website",
          summary:
            "A creative personal portfolio site built with Next.js and modern web animations to showcase projects and writing.",
          href: "https://github.com/soham74/Portfolio-Website-Creative",
        },
      ],
      repoDemoLinks: [
        {
          label: "Personal site",
          href: "https://soham-kolhe-portfolio.vercel.app/",
        },
        {
          label: "arcflow repo",
          href: "https://github.com/aditya-harsh11/MadData-26",
        },
      ],
      about:
        "I'm Soham, a freshman at UW-Madison studying CS. Right now I'm working with the USDA on crop detection models using satellite imagery and deep learning. I like building things that run locally and solve problems people actually have. When I'm not coding, I'm probably exploring Madison or tinkering with a side project.",
      customSections: [
        {
          title: "Current research",
          body:
            "Building crop detection models from satellite imagery for the USDA, and an AI grant-writing assistant for the UW-Madison Department of Surgery that helps physician-researchers draft proposals and auto-fill regulatory forms.",
        },
        {
          title: "What I want to build next",
          body:
            "More AI tools that save experts real time on tedious work. Less busywork, more building.",
        },
      ],
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
  {
    id: "jinao-wang",
    name: "Michael Wang",
    university: "Duke",
    website: "https://wjinao.com",
    avatar: "/avatars/students/jinao-wang.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/michael-wang-a04b12355/",
      x: "https://x.com/Will_lin331",
    },
    profile: {
      headline:
        "Duke CS and Math student researching LLM-based agent evaluation, quantum error correction, and building full-stack developer tools.",
      majorYear: "CS and Math, 2027",
      location: "Durham, NC",
      builderType: "ML researcher, quantum computing researcher, and full-stack engineer",
      interests: [
        "LLM agents",
        "Quantum error correction",
        "Full-stack engineering",
        "Developer tooling",
        "AI-assisted workflows",
      ],
      tools: ["Python", "TypeScript", "React", "Next.js", "C++", "Rust", "FastAPI", "Supabase", "Redis", "Docker", "Claude Code", "Cursor", "Windsurf", "GitHub Copilot"],
      projects: [
        {
          name: "BlueBook",
          href: "https://dukebluebook.com",
          summary:
            "An AI-powered course planning tool for Duke students — search, compare, and plan schedules with real ratings, workload insights, and personalized recommendations.",
        },
        {
          name: "Token Monitor",
          href: "https://github.com/Michael-OvO/TokenMonitor",
          summary:
            "A sleek macOS status monitor for tracking coding-agent API cost and detailed usage stats.",
        },
      ],
      repoDemoLinks: [
        {
          label: "Personal site",
          href: "https://wjinao.com",
        },
        {
          label: "GitHub",
          href: "https://github.com/Michael-OvO",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/michael-wang-a04b12355/",
        },
      ],
      about:
        "I'm Michael, a CS and Math student at Duke. I research benchmarks for evaluating computer tool-use agents using LLM-based simulators, work on quantum error correction with concatenated codes, and lead engineering on a full-stack academic publishing platform.",
      customSections: [
        {
          title: "AI use that inspired me",
          body:
            "An Obsidian plus coding-agent plus Git workflow for automated next-era notes and database management inspired me because it made personal knowledge systems feel operational instead of passive.",
        },
        {
          title: "What I am currently building",
          body:
            "BlueBook (dukebluebook.com) — a platform for Duke students.",
        },
      ],
    },
  },
  {
    id: "alex-jorns",
    name: "Alex Jorns",
    avatar: "/avatars/students/alex-jorns.jpg",
    links: {
      instagram: "akjo06",
      linkedin: "https://www.linkedin.com/in/alex-k-jorns",
    },
  },
  {
    id: "abdulrahman-sadiq",
    name: "Abdulrahman Sadiq",
    university: "University of Southern California",
    website: "https://kvng.dev/",
    avatar: "/avatars/students/abdulrahman-sadiq.png",
    links: {
      instagram: "abdul_kvng",
      linkedin: "https://www.linkedin.com/in/abdulrahman-sadiq/",
      x: "https://x.com/Kvnggg101",
    },
    profile: {
      headline:
        "USC student building AI/ML systems, observability infrastructure, and sleek full-stack products.",
      majorYear: "Computer Science & Business Administration, 2027 · Minor in AI Applications",
      location: "Los Angeles, CA",
      builderType: "AI/ML engineer and infra-minded product builder",
      interests: [
        "AI agents and applied machine learning",
        "LLM infrastructure and observability",
        "Distributed systems",
        "Data and inference pipelines",
        "Developer tools",
        "Running marathons",
        "Flying drones",
      ],
      tools: [
        "Python",
        "TypeScript",
        "Next.js",
        "React",
        "FastAPI",
        "PyTorch",
        "TensorFlow",
        "Docker",
        "Kubernetes",
        "PostgreSQL",
        "AWS",
      ],
      projects: [
        {
          name: "StackSense",
          summary:
            "An AI infrastructure observability platform for tracking LLM token usage, latency, and cost across providers, with a Python SDK, proxy ingestion layer, PostgreSQL analytics, and a Next.js dashboard.",
        },
        {
          name: "Lingo AI Language Coach",
          summary:
            "A full-stack AI language platform using React, TypeScript, Gemini, and WebRTC for real-time speech analysis and structured multi-dimensional feedback.",
        },
        {
          name: "AI Research Agent",
          summary:
            "A RAG-based research assistant built with LangChain, OpenAI APIs, and ChromaDB to improve retrieval quality and reduce latency for technical research workflows.",
          },
      ],
      repoDemoLinks: [
        {
          label: "Personal site",
          href: "https://kvng.dev/",
        },
        {
          label: "GitHub",
          href: "https://github.com/abdulkvng",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/abdulrahman-sadiq/",
        },
        {
          label: "X",
          href: "https://x.com/Kvnggg101",
        },
      ],
      about:
        "Abdulrahman Sadiq is a USC student based in Los Angeles focused on building AI and machine learning systems that feel sharp in product and solid in production. His work spans autonomous agents, LLM observability, backend infrastructure, and full-stack product development, with a strong interest in the layer between model capability and usable software. He is drawn to fast systems, clean interfaces, and the engineering details that make AI products reliable at scale.",
      customSections: [
        {
          title: "Current focus",
          body:
            "Right now, Abdulrahman is most interested in AI/ML engineering, LLM observability, and full-stack systems that make model-powered products measurable, reliable, and easy to use.",
        },
        {
          title: "Outside of code",
          body:
            "Outside of building, he enjoys running marathons, flying drones, and staying close to ambitious technical communities.",
        },
      ],
    },
  },
  {
    id: "anish-rudra",
    name: "Anish Rudra",
    avatar: "/avatars/students/anish-rudra.jpg",
    links: {
      instagram: "anish_rudra",
      linkedin: "https://www.linkedin.com/in/anish-rudra",
      x: "rudra_anish",
    },
  },
  {
    id: "avital-mintz",
    name: "Avital Mintz",
    university: "University of Chicago",
    avatar: "/avatars/students/avital-mintz.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/avitalmintz/",
    },
    profile: {
      headline:
        "UChicago student researching how LLMs form and reshape concepts across political perspectives, with a secondary focus on criminal psychology.",
      majorYear: "Psychology and Data Science, 2026",
      location: "Chicago, IL",
      builderType: "Student builder",
      interests: [
        "LLM interpretability",
        "AI in healthcare",
        "Human-AI interaction",
        "Forensic psychology",
      ],
      tools: ["Codex", "Cursor", "Snowflake", "Git", "AWS", "Claude Code", "Python"],
      projects: [
        {
          name: "Fifth Avenue Forensics (AI Implementation)",
          summary:
            "Built and deployed a HIPAA-compliant AI system for forensic psychological report generation, used in real clinical and legal workflows.",
        },
        {
          name: "LLM Interpretability Research (UChicago Knowledge Lab)",
          summary:
            "Analyzing how political perspectives reshape concept representations in language models through activation-level experiments.",
        },
      ],
      repoDemoLinks: [
        {
          label: "GitHub",
          href: "https://github.com/avitalmintz",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/avitalmintz/",
        },
      ],
      about:
        "Avital studies Psychology and Data Science at the University of Chicago and focuses on LLM interpretability research across political perspectives, with additional work at the intersection of AI and forensic psychology.",
      customSections: [],
    },
  },
  {
    id: "gautam-soni",
    name: "Gautam Soni",
    university: "Virginia Tech",
    website: "https://github.com/gsoni1",
    avatar: "/avatars/students/gautam-soni.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/gsoni16",
    },
    profile: {
      headline:
        "Virginia Tech CS student building AI systems and iOS products, focused on turning research and prototypes into real user-facing experiences.",
      majorYear: "B.S. in Computer Science, graduating May 2027",
      location: "New York City",
      builderType: "AI and iOS product builder",
      interests: [
        "Agentic workflows",
        "iOS product engineering",
        "LLM systems and evaluation",
        "Developer tools",
        "Product strategy",
      ],
      tools: [
        "Swift",
        "SwiftUI",
        "UIKit",
        "MapKit",
        "Python",
        "TypeScript",
        "React",
        "Codex",
        "RAG pipelines",
      ],
      projects: [
        {
          name: "HitmanHints",
          summary:
            "Built a multi-stage LLM assistant that parses long transcripts into actionable sequences and generates spoiler-free, context-aware hints in real time. Improved latency by 40% while maintaining output quality through prompt and model optimization.",
        },
        {
          name: "OneDrive iOS Map View",
          summary:
            "Shipped a new photo discovery surface in OneDrive iOS used by XXM+ monthly users, and helped reduce feature load time by six seconds with performance profiling and architecture improvements.",
        },
      ],
      repoDemoLinks: [
        {
          label: "GitHub",
          href: "https://github.com/gsoni1",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/gsoni16",
        },
      ],
      about:
        "I'm Gautam, a CS student at Virginia Tech who likes building AI-powered products that are both technically rigorous and useful in practice. I spend most of my time on iOS engineering, LLM workflows, and product experimentation, especially where engineering depth and product thinking overlap.",
      customSections: [
        {
          title: "Experience highlights",
          body:
            "Incoming Software Engineer Intern at Microsoft (Summer 2026). Explore Intern at Microsoft in 2025 across software engineering and product management, where I shipped OneDrive iOS features and contributed to monetization strategy. Codex Lab Member at OpenAI, collaborating with student builders on agentic workflows. Undergraduate TA for Virginia Tech CS 3714, helping students build production-quality iOS apps.",
        },
        {
          title: "What I am exploring now",
          body:
            "Designing reliable LLM pipelines with stronger retrieval and evaluation loops, and learning how to move from fast prototype quality to durable product quality in AI-native apps.",
        },
      ],
    },
  },
  {
    id: "joshua-liu",
    name: "Joshua Liu",
    university: "MIT",
    website: "https://github.com/joshcliu",
    links: {
      linkedin: "https://www.linkedin.com/in/joshcliu/",
    },
    profile: {
      headline: "MIT student in the Codex Lab cohort studying AI.",
      majorYear: "AI, 2027",
      location: "Cambridge, MA",
      builderType: "AI student builder",
      interests: ["Artificial intelligence", "Student building", "Open source learning"],
      tools: ["Git", "GitHub", "Codex"],
      projects: [
        {
          name: "GitHub profile",
          summary:
            "A collection point for Joshua's ongoing experiments, repositories, and future project work.",
          href: "https://github.com/joshcliu",
        },
      ],
      repoDemoLinks: [
        {
          label: "GitHub",
          href: "https://github.com/joshcliu",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/joshcliu/",
        },
      ],
      about:
        "I'm Joshua, an MIT student studying AI and based in Cambridge, Massachusetts. I'm part of the Codex Lab cohort and using this page as a home for the projects, experiments, and ideas I want to keep building.",
      customSections: [],
    },
  },
  {
    id: "nicholas-chua",
    name: "Nicholas Chua",
    university: "UC Berkeley",
    avatar: "/avatars/students/nicholas-chua.jpg",
    links: {
      instagram: "nicholaschuas",
      linkedin: "https://www.linkedin.com/in/nicholasychua/",
      x: "nicholasychua",
    },
    profile: {
      headline:
        "Engineering + Design @ Berkeley working on startup media, growth engineering tools, and consumer apps.",
      majorYear: "Industrial Engineering + Design, 2028",
      location: "Berkeley / San Francisco",
      builderType: "Consumer Apps, Growth Tools",
      interests: [
        "Consumer Apps",
        "Growth",
        "Startup Media",
        "Cinematography",
        "Health Optimization",
        "Writing",
      ],
      tools: [
        "React",
        "Next.js",
        "TypeScript",
        "Vercel",
        "Figma",
        "Dribbble",
        "Google Stitch",
      ],
      projects: [
        {
          name: "Subspace",
          summary:
            "AI task management platform. Instantly records, organizes, and schedules tasks with the click of a button.",
          href: "https://usesubspace.live",
        },
        {
          name: "Copycat",
          summary:
            "Growth engineering tool to index viral tweets and write posts 10x faster.",
          href: "https://growth-smoky.vercel.app/",
        },
      ],
      repoDemoLinks: [
        {
          label: "Personal Site",
          href: "https://nicholaschua.com",
        },
        {
          label: "Cinematography",
          href: "https://instagram.com/chuafilms",
        },
        {
          label: "X",
          href: "https://x.com/nicholasychua",
        },
        {
          label: "Substack",
          href: "https://substack.com/@nicholaschua",
        },
      ],
      about:
        "Hey! I'm a sophomore at Berkeley working on startup media and productivity tools. I previously worked on AI products @ TikTok and helped spearhead Wispr Flow's content on X.",
      customSections: [],
    },
  },
  {
    id: "rohan-adwankar",
    name: "Rohan Adwankar",
    university: "UCLA",
    website: "https://rohanadwankar.github.io/",
    avatar: "/avatars/students/rohan-adwankar.jpeg",
    links: {
      instagram: "rohan.adwankar",
      linkedin: "linkedin.com/in/rohanadwankar/",
      x: "rohanadwankar",
    },
    profile: {
      headline: "Open Source Enthusiast",
      majorYear: "Senior 2026",
      location: "Fremont, CA",
      builderType: "Exploratory",
      interests: ["Open Source", "AI Agents"],
      tools: [
        "Python",
        "uv",
        "FastAPI",
        "TypeScript",
        "Next.js",
        "React",
        "Rust",
        "Cargo",
      ],
      projects: [
        {
          name: "oxdraw",
          href: "https://github.com/RohanAdwankar/oxdraw",
          summary:
            "Diagram as Code Tool Written in Rust with Draggable Editing.",
        },
        {
          name: "codex-optimize",
          href: "https://github.com/RohanAdwankar/codex-optimize",
          summary:
            "Optimizing software using the Codex SDK.",
        },
      ],
      repoDemoLinks: [{ label: "cgpu - Free Cloud GPU Access", href: "https://github.com/RohanAdwankar/cgpu" },
      { label: "Personal Website", href: "https://rohanadwankar.github.io/" }],
      about:
        "Rohan is a UCLA senior who likes using code as a way to learn in public. He gravitates toward open source projects, exploratory builds, and AI-agent workflows that make ambitious ideas easier to prototype, inspect, and share.",
      customSections: [],
    },
  },
  {
    id: "ryan-amiri",
    name: "Ryan Amiri",
    university: "Northeastern University",
    website: "https://github.com/ryankamiri",
    avatar: "/avatars/students/ryan-amiri.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/ryanamiri/",
      x: "https://x.com/RyanAmiri__",
    },
    profile: {
      headline:
        "Third-year Computer Science student at Northeastern University building scalable product features across backend and frontend, with experience at HubSpot, an incoming internship at Ramp, and a research focus on multi-agent RL for LLM collaboration.",
      majorYear: "Computer Science, Third Year",
      location: "Boston, MA",
      builderType: "Full-stack product builder focused on scalable application development",
      interests: [
        "Building scalable product features in production systems",
        "Backend architecture and API design",
        "Frontend product experiences and UX quality",
        "End-to-end web application development",
        "Multi-agent RL and LLM collaboration research",
      ],
      tools: [
        "TypeScript",
        "React",
        "Next.js",
        "Python",
        "FastAPI",
        "Postgres",
        "Redis",
        "Docker",
      ],
      projects: [
        {
          name: "TailorTom",
          summary:
            "Open-source ATS resume optimizer with optimization jobs, worker queue processing, LaTeX compile and diff workflows, and a web app for tracking and reviewing resume optimization runs.",
          href: "https://www.tailortom.org/",
        },
        {
          name: "CoMLRL",
          summary:
            "Contributing to cooperative multi-LLM reinforcement learning research and tooling for collaborative agent training and evaluation.",
          href: "https://github.com/OpenMLRL/CoMLRL",
        },
      ],
      repoDemoLinks: [
        {
          label: "TailorTom Repo",
          href: "https://github.com/ryankamiri/tailor-tom",
        },
        {
          label: "GitHub",
          href: "https://github.com/ryankamiri",
        },
        {
          label: "CoMLRL",
          href: "https://github.com/OpenMLRL/CoMLRL",
        },
      ],
      about:
        "I'm Ryan, a third-year CS student at Northeastern focused on building applications that are both technically scalable and genuinely useful. I like shipping full-stack features across backend systems and frontend product surfaces, and I've enjoyed doing that in fast-moving environments including HubSpot and as an incoming intern at Ramp. Alongside product work, I contribute to multi-agent RL research on LLM collaboration through CoMLRL. I enjoy taking ideas from prototype to production and improving them through real user feedback.",
      customSections: [
        {
          title: "Experience snapshot",
          body: "Formerly at HubSpot and incoming intern at Ramp, with a strong interest in high-ownership engineering on products that serve users at scale.",
        },
        {
          title: "Current focus",
          body: "Building TailorTom while continuing research on cooperative LLM systems and practical applications of AI in software products.",
        },
        {
          title: "How I like to build",
          body: "Start from a real user problem, ship a clean MVP quickly, and iterate hard on reliability, performance, and UX.",
        },
      ],
    },
  },
  {
    id: "samuel-zhang",
    name: "Samuel Zhang",
    university: "University of Waterloo",
    website: "https://samuelzhang.ca",
    avatar: "/avatars/students/samuel-zhang.png",
    links: {
      instagram: "https://www.instagram.com/samuel.z12/",
      linkedin: "https://www.linkedin.com/in/samuelz12/",
      x: "https://x.com/samuelxzhang",
    },
    profile: {
      headline:
        "CS @ UWaterloo, building with AI around learning, capture, and workflow-heavy problems.",
      majorYear: "Computer Science, 2028",
      location: "Toronto, Canada",
      builderType: "Student builder",
      interests: [
        "Applied AI products",
        "Learning tools",
        "Multimodal workflows",
        "Lifting",
        "Fencing",
        "Poker",
      ],
      tools: ["Codex", "TypeScript", "Next.js", "Python", "OpenAI APIs"],
      projects: [
        {
          name: "LongCut",
          summary:
            "Transforms long-form YouTube videos into a structured learning workspace.",
          href: "https://www.longcut.ai",
        },
        {
          name: "Screen Scribe",
          summary:
            "A macOS app that converts screen captures into text, including LaTeX and Markdown.",
          href: "https://github.com/samuelz12/screen-scribe",
        },
      ],
      repoDemoLinks: [
        {
          label: "Personal site",
          href: "https://samuelzhang.ca",
        },
        {
          label: "LongCut",
          href: "https://www.longcut.ai",
        },
        {
          label: "LongCut repo",
          href: "https://github.com/SamuelZ12/longcut",
        },
        {
          label: "Screen Scribe repo",
          href: "https://github.com/samuelz12/screen-scribe",
        },
      ],
      about:
        "I'm a Computer Science student at the University of Waterloo building with AI across side projects, engineering work, and research. I like tools that turn long videos, screen captures, and messy context into something easier to learn from and actually use.",
      customSections: [
        {
          title: "Currently exploring",
          body: "How to make AI products feel genuinely useful in practice, especially for learning workflows and fast capture-to-output tools.",
        },
      ],
    },
  },
  {
    id: "simon-ilincev",
    name: "Simon Ilincev",
    university: "Cornell",
    avatar: "/avatars/students/simon-ilincev.jpg",
    links: {
      linkedin: "https://linkedin.com/in/simon-ilincev",
      x: "https://x.com/simon_ilincev",
    },
  },
];

export const members = rawMembers.map(normalizeMember);

export const memberIds = members.map((member) => member.id);

export function getMemberById(memberId: string) {
  return members.find((member) => member.id === memberId);
}
