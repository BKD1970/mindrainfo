export type ArticleSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type Article = {
  title: string;
  slug: string;
  category: string;
  description: string;
  icon: string;
  available: boolean;
  publishedAt: string;
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    title: "How to Start a Career in Data Analytics",
    slug: "start-data-analytics",
    category: "Data Analytics",
    description:
      "Learn the skills, tools and practical roadmap needed to start a career in data analytics.",
    icon: "📊",
    available: true,
    publishedAt: "2026-08-01",

    sections: [
      {
        heading: "What does a Data Analyst do?",
        paragraphs: [
          "A data analyst collects, cleans, analyzes and presents data to help organizations make informed decisions.",
          "A typical data analyst may work with spreadsheets, databases, dashboards and reporting tools. They transform raw information into useful insights that people can understand and act upon.",
        ],
      },
      {
        heading: "What skills do you need?",
        paragraphs: [
          "You don't need to learn everything at once. Start with the fundamentals and gradually build your technical skills.",
        ],
        bullets: [
          "Microsoft Excel — formulas, functions, sorting, filtering, PivotTables and charts.",
          "SQL — retrieving, filtering, joining and analyzing data stored in databases.",
          "Power BI — transforming data and creating interactive dashboards and reports.",
          "Data Cleaning — identifying missing values, duplicates, errors and inconsistent data.",
        ],
      },
      {
        heading: "A simple learning roadmap",
        bullets: [
          "01 — Learn Excel fundamentals",
          "02 — Practice data cleaning",
          "03 — Learn SQL fundamentals",
          "04 — Learn Power BI",
          "05 — Build practical projects",
          "06 — Create a portfolio",
          "07 — Start applying for jobs",
        ],
      },
      {
        heading: "Build projects, not just certificates",
        paragraphs: [
          "One of the best ways to demonstrate your ability is to build projects using real-world datasets.",
          "For example, you could analyze sales data, customer behavior, employee information, e-commerce transactions or financial performance.",
        ],
        bullets: [
          "Sales Dashboard",
          "Customer Analysis",
          "Employee Analytics",
        ],
      },
      {
        heading: "Do you need a degree?",
        paragraphs: [
          "A degree can be useful, but employers also look at practical skills, projects, problem-solving ability and your understanding of data.",
          "Focus on becoming capable of taking a messy dataset and turning it into a clear, useful analysis.",
        ],
      },
    ],
  },

  {
    title: "Best AI Tools for Students",
    slug: "best-ai-tools",
    category: "AI",
    description:
      "Explore useful AI tools that can help students learn, research, create and work more efficiently.",
    icon: "🤖",
    available: true,
    publishedAt: "2026-08-02",

    sections: [
      {
        heading: "How should students use AI?",
        paragraphs: [
          "AI tools can be useful study assistants when they are used thoughtfully. They can help explain concepts, generate ideas, summarize information and support creative or technical work.",
          "The best use of AI is usually as a learning assistant rather than a replacement for learning. Ask it to explain concepts, provide examples, quiz you, review your work or help you explore ideas.",
        ],
      },
      {
        heading: "Useful AI tools for students",
        bullets: [
          "ChatGPT — writing, learning, brainstorming, coding and general AI assistance.",
          "Google Gemini — research, explanations, writing, brainstorming and multimodal tasks.",
          "Claude — writing, analysis, reasoning and working with longer documents.",
          "Perplexity — research and finding information with web-based answers and sources.",
          "Canva AI — presentations, graphics, visual content and creative projects.",
          "GitHub Copilot — learning programming and getting assistance while writing code.",
        ],
      },
      {
        heading: "What can students use AI for?",
        bullets: [
          "Understanding difficult concepts",
          "Summarizing study material",
          "Brainstorming project ideas",
          "Improving writing",
          "Learning programming",
          "Research assistance",
          "Creating presentations",
          "Organizing study plans",
        ],
      },
      {
        heading: "A better way to use AI for studying",
        paragraphs: [
          "Instead of asking a vague question such as 'Explain SQL', give the AI context about your current skill level, your goal and the kind of explanation you want.",
          "For example, ask it to teach SQL as a complete beginner, use a simple sales dataset, explain SELECT, WHERE and GROUP BY, and then provide practice questions.",
        ],
      },
      {
        heading: "Important: verify AI-generated information",
        paragraphs: [
          "AI systems can produce inaccurate or outdated information. Verify important facts, especially for academic, financial, legal, medical or other high-stakes topics.",
        ],
      },
    ],
  },

  {
    title: "Excel Skills Every Data Analyst Should Know",
    slug: "excel-skills-data-analyst",
    category: "Data Analytics",
    description:
      "Understand the Excel skills that are useful for data cleaning, analysis, reporting and dashboards.",
    icon: "📈",
    available: true,
    publishedAt: "2026-08-03",

    sections: [
      {
        heading: "Why Excel matters for data analysts",
        paragraphs: [
          "Excel remains a useful tool for data analysis because it allows people to organize, clean, calculate and visualize information quickly.",
          "For a beginner data analyst, strong Excel fundamentals can provide a practical foundation before moving into tools such as SQL, Power BI and Python.",
        ],
      },
      {
        heading: "Excel skills worth learning",
        bullets: [
          "Excel formulas and functions",
          "Data cleaning",
          "Sorting and filtering",
          "PivotTables",
          "Charts and visualization",
          "Lookup functions such as XLOOKUP",
          "Power Query",
          "Data validation",
        ],
      },
      {
        heading: "Functions you should practice",
        paragraphs: [
          "Start by becoming comfortable with commonly used functions. Don't simply memorize the syntax—practice using each function on actual datasets.",
        ],
        bullets: [
          "SUM — adding values",
          "AVERAGE — finding an average",
          "IF — applying logical conditions",
          "SUMIFS — calculating conditional totals",
          "COUNTIFS — counting records using conditions",
          "XLOOKUP — finding matching information",
        ],
      },
      {
        heading: "Data cleaning is just as important",
        bullets: [
          "Remove duplicate records",
          "Find and handle blank or missing values",
          "Standardize names and categories",
          "Check dates and number formats",
          "Identify unusual or impossible values",
          "Make sure columns contain the correct type of information",
        ],
      },
      {
        heading: "Master PivotTables",
        paragraphs: [
          "PivotTables are one of the most useful Excel features for quickly summarizing large datasets. You can group information, compare categories and calculate totals without manually writing many formulas.",
          "Imagine you have thousands of sales records containing product, region, salesperson and revenue. A PivotTable can quickly show total revenue by region or product.",
        ],
      },
      {
        heading: "Learn Power Query",
        paragraphs: [
          "Power Query can make repetitive data preparation much more efficient. It can import data, remove unwanted columns, transform values, combine datasets and apply repeatable cleaning steps.",
        ],
      },
      {
        heading: "Practice with real-world projects",
        bullets: [
          "Sales Dashboard",
          "Employee Analytics",
          "E-commerce Analysis",
        ],
      },
      {
        heading: "A practical Excel roadmap",
        bullets: [
          "01 — Learn Excel interface and basic formulas",
          "02 — Practice logical and conditional functions",
          "03 — Learn sorting, filtering and data cleaning",
          "04 — Master XLOOKUP and other lookup techniques",
          "05 — Learn PivotTables and PivotCharts",
          "06 — Build dashboards and reports",
          "07 — Learn Power Query",
          "08 — Build real-world projects",
        ],
      },
    ],
  },

  {
    title: "How Artificial Intelligence Is Changing Jobs",
    slug: "ai-changing-jobs",
    category: "AI & Careers",
    description:
      "Understand how AI is changing existing jobs and creating new opportunities.",
    icon: "🚀",
    available: true,
    publishedAt: "2026-08-04",

    sections: [
      {
        heading: "Will AI replace all jobs?",
        paragraphs: [
          "No single answer applies to every occupation. The impact of AI depends on the tasks involved, the technology available and how organizations choose to use it.",
          "In many roles, AI can be viewed as a tool that changes how work is performed rather than a simple replacement for the entire profession.",
        ],
      },
      {
        heading: "Four ways AI is changing work",
        bullets: [
          "AI-assisted work — professionals can use AI to draft, summarize, research, analyze and automate repetitive tasks.",
          "More automation — some repetitive tasks may increasingly be handled by software.",
          "New skills — AI literacy, data skills, critical thinking and effective tool use are becoming more useful.",
          "New opportunities — roles are emerging around implementation, automation, data, products, governance and AI-assisted workflows.",
        ],
      },
      {
        heading: "Skills that remain valuable",
        bullets: [
          "AI literacy",
          "Critical thinking",
          "Communication",
          "Data analysis",
          "Problem solving",
          "Domain knowledge",
          "Adaptability",
          "Continuous learning",
        ],
      },
      {
        heading: "Example: a data analyst",
        paragraphs: [
          "A data analyst may use AI to help summarize data, generate draft formulas, explore possible trends or explain technical concepts. The analyst still needs to check the result, understand the data and make sure the final interpretation is correct.",
          "AI can help with parts of the workflow. Human judgment remains important for deciding what the analysis means and what action should be taken.",
        ],
      },
      {
        heading: "How to prepare for an AI-powered workplace",
        bullets: [
          "01 — Understand the AI tools relevant to your field",
          "02 — Build strong fundamentals in your profession",
          "03 — Practice using AI on real tasks",
          "04 — Learn to verify AI-generated information",
          "05 — Build projects demonstrating practical AI use",
          "06 — Keep improving as tools and workflows evolve",
        ],
      },
    ],
  },

  {
    title: "How to Build Your First Website",
    slug: "build-first-website",
    category: "Technology",
    description:
      "A beginner-friendly introduction to building and launching your first website.",
    icon: "💻",
    available: true,
    publishedAt: "2026-08-05",

    sections: [
      {
        heading: "What do you need to build a website?",
        paragraphs: [
          "At the most basic level, a website needs structure, styling and behavior. These responsibilities are commonly handled by HTML, CSS and JavaScript.",
        ],
        bullets: [
          "HTML — structure and content",
          "CSS — design and layout",
          "JavaScript — interaction and logic",
        ],
      },
      {
        heading: "A practical roadmap",
        bullets: [
          "01 — Decide what you want to build",
          "02 — Learn the fundamentals",
          "03 — Design the interface",
          "04 — Build the website",
          "05 — Test everything",
          "06 — Deploy it",
        ],
      },
      {
        heading: "Technologies you can learn",
        bullets: [
          "React — building reusable user-interface components",
          "Next.js — building modern full-stack web applications",
          "Git and GitHub — version control and collaboration",
        ],
        paragraphs: [
          "Once you understand the basics, frameworks and development tools can help you build larger and more sophisticated projects.",
        ],
      },
      {
        heading: "Start with a small project",
        bullets: [
          "Personal portfolio",
          "Small business website",
          "Resume website",
          "Blog",
          "Learning platform",
          "Simple online tool",
        ],
        paragraphs: [
          "Don't begin by trying to build a huge social network or e-commerce platform. A small project will teach you the complete development cycle without becoming overwhelming.",
        ],
      },
      {
        heading: "Make your website responsive",
        paragraphs: [
          "A modern website should work well on phones, tablets and desktop screens. Test your layouts at different screen widths and make sure text, buttons and navigation remain easy to use.",
        ],
      },
      {
        heading: "Test before you publish",
        bullets: [
          "Check every navigation link",
          "Test the website on mobile",
          "Check buttons and forms",
          "Make sure images load correctly",
          "Look for spelling and content mistakes",
          "Test important pages before sharing the site",
        ],
      },
    ],
  },

  {
    title: "Useful Online Tools for Everyday Work",
    slug: "useful-online-tools",
    category: "Tools",
    description:
      "Discover practical online tools that can help with calculations, productivity and everyday tasks.",
    icon: "🛠️",
    available: true,
    publishedAt: "2026-08-06",

    sections: [
      {
        heading: "What makes an online tool useful?",
        paragraphs: [
          "A useful tool should solve a specific problem without forcing the user to understand complicated software first.",
          "Clear inputs, understandable results, good mobile support and a simple interface are often more important than having dozens of unnecessary features.",
        ],
      },
      {
        heading: "Categories of useful online tools",
        bullets: [
          "Calculators",
          "Document tools",
          "Text tools",
          "Image tools",
          "Developer tools",
          "Data tools",
        ],
      },
      {
        heading: "Practical tools on MindraInfo",
        bullets: [
          "EMI Calculator — estimate monthly loan payments, total interest and overall repayment.",
          "Percentage Calculator — calculate percentages and percentage changes.",
          "Unit Converter — convert measurements such as length, weight and temperature.",
          "Word Counter — count words and characters while preparing written content.",
        ],
        paragraphs: [
          "MindraInfo is gradually building a collection of useful tools that can be accessed directly from the browser.",
        ],
      },
      {
        heading: "Use tools to reduce repetitive work",
        paragraphs: [
          "The goal is not to collect hundreds of tools. It is to identify the small number of utilities that genuinely improve your daily workflow.",
          "For example, instead of manually calculating loan payments every time you compare financing options, a dedicated calculator can give you an estimate within seconds.",
        ],
      },
      {
        heading: "Tips for choosing online tools",
        bullets: [
          "Choose tools that solve a real problem",
          "Prefer simple interfaces",
          "Check whether calculations are clearly explained",
          "Avoid uploading sensitive information unnecessarily",
          "Verify important results before using them",
          "Keep frequently used tools bookmarked",
        ],
      },
      {
        heading: "Think about privacy",
        paragraphs: [
          "Be careful when uploading documents, personal information, financial data or confidential business information to online tools. Use services you trust and avoid sharing sensitive information unnecessarily.",
        ],
      },
    ],
  },
];