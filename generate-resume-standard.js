const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType,
  TabStopType, TabStopPosition, ShadingType, VerticalAlign,
  PageBreak, UnderlineType, ExternalHyperlink
} = require("docx");

const TEAL = "2E86AB";
const BLACK = "000000";
const DARK = "333333";
const GRAY = "555555";
const DIVIDER = "BBBBBB";
const FONT = "Graphik";
const FONT_FALLBACK = "Calibri";

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function sidebarHeading(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: DIVIDER, space: 4 } },
    children: [new TextRun({ text, font: FONT, size: 20, bold: true, color: BLACK })],
  });
}

function sidebarText(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [new TextRun({
      text, font: FONT, size: 18,
      color: opts.color || DARK,
      bold: opts.bold || false,
      italics: opts.italics || false,
    })],
  });
}

function sidebarBullet(text) {
  return new Paragraph({
    numbering: { reference: "sidebar-bullets", level: 0 },
    spacing: { before: 15, after: 15 },
    children: [new TextRun({ text, font: FONT, size: 18, color: DARK })],
  });
}

function jobTitle(title, company, location, dates) {
  return new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [new TextRun({
      text: `${title}, ${company}, ${location} — ${dates}`,
      font: FONT, size: 20, bold: true, color: TEAL,
    })],
  });
}

function jobBullet(text) {
  return new Paragraph({
    numbering: { reference: "job-bullets", level: 0 },
    spacing: { before: 20, after: 20 },
    children: [new TextRun({ text, font: FONT, size: 20, color: DARK })],
  });
}

function toolsLine(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: "Tools & Technologies: ", font: FONT, size: 20, bold: true, color: DARK }),
      new TextRun({ text, font: FONT, size: 20, color: DARK }),
    ],
  });
}

function spacer(h = 40) {
  return new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun({ text: "", size: 2 })] });
}

// --- SIDEBAR ---
const sidebarChildren = [
  // Contact
  sidebarHeading("Contact"),
  new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [new TextRun({ text: "📩 ", font: FONT, size: 18 }), new TextRun({ text: "hello@haroondilshad.com", font: FONT, size: 17, color: TEAL })],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [new TextRun({ text: "📍 ", font: FONT, size: 18 }), new TextRun({ text: "Berlin, Germany", font: FONT, size: 17, color: DARK })],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({ text: "🔗 ", font: FONT, size: 18 }),
      new ExternalHyperlink({
        children: [new TextRun({ text: "haroondilshad.com", style: "Hyperlink", font: FONT, size: 17 })],
        link: "https://haroondilshad.com",
      }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({ text: "💼 ", font: FONT, size: 18 }),
      new ExternalHyperlink({
        children: [new TextRun({ text: "linkedin.com/in/haroondilshad", style: "Hyperlink", font: FONT, size: 17 })],
        link: "https://linkedin.com/in/haroondilshad",
      }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({ text: "🐙 ", font: FONT, size: 18 }),
      new ExternalHyperlink({
        children: [new TextRun({ text: "github.com/haroondilshad", style: "Hyperlink", font: FONT, size: 17 })],
        link: "https://github.com/haroondilshad",
      }),
    ],
  }),

  // Languages
  sidebarHeading("Languages"),
  sidebarBullet("English - Native"),
  sidebarBullet("Deutsch - A2"),

  // Professional Summary
  sidebarHeading("Professional Summary"),
  sidebarText("Senior Product Engineer with 11+ years of experience building scalable, user-centric software. Skilled in leading teams, leveraging agentic AI for rapid delivery, and implementing technical solutions that align with business objectives."),

  // Key Strengths
  sidebarHeading("Key Strengths"),
  sidebarBullet("Agentic AI Development: AI-powered delivery, MCP sandboxing"),
  sidebarBullet("Cloud Architecture: Event-driven systems, scalability (AWS, Azure, OCI)"),
  sidebarBullet("Secure Developer Experience: DevContainers, DevPod, supply-chain hardening"),
  sidebarBullet("Leadership: Cross-functional team management, mentoring"),
  sidebarBullet("Product Thinking: User-centric design, outcome-driven prioritization"),
  sidebarBullet("DevOps: Automated testing, CI/CD implementation"),
  sidebarBullet("Data: ETL processes, pipeline development"),

  // Tools & Technologies
  sidebarHeading("Tools & Technologies"),
  sidebarText("Programming Languages:", { bold: true }),
  sidebarText("JavaScript · TypeScript · Java · Go · Python"),
  spacer(10),
  sidebarText("Backend:", { bold: true }),
  sidebarText("Node.js · NestJS · Express · Django · Deno/BunJS"),
  spacer(10),
  sidebarText("Frontend:", { bold: true }),
  sidebarText("Angular · React · RxJS · NGXS · Redux · Remix"),
  spacer(10),
  sidebarText("Databases:", { bold: true }),
  sidebarText("MongoDB · Postgres · Cloudant/CouchDB · SQL + Lite"),
  spacer(10),
  sidebarText("ORM/ODM:", { bold: true }),
  sidebarText("TypeORM · Sequelize · Prisma · Mongoose"),
  spacer(10),
  sidebarText("Testing:", { bold: true }),
  sidebarText("Jest · Playwright/Puppeteer · Cypress"),
  spacer(10),
  sidebarText("Cloud & DevOps:", { bold: true }),
  sidebarText("Cloud Native APIs from AWS, GCP, Azure, Vercel, Netlify, Docker + Compose, Kubernetes (K8s)"),
  spacer(10),
  sidebarText("Secure DX:", { bold: true }),
  sidebarText("DevContainers · DevPod · MCP · Cloudflare Tunnels · Traefik"),
  spacer(10),
  sidebarText("API Technologies:", { bold: true }),
  sidebarText("GraphQL · gRPC/tRPC · RESTful APIs"),
  spacer(10),
  sidebarText("Search:", { bold: true }),
  sidebarText("ElasticSearch · TypeSense"),

  // Education
  sidebarHeading("Education"),
  sidebarText("SEECS - NUST, Islamabad, Pakistan", { bold: true }),
  sidebarText("BE Software Engineering 2011-2015"),
];

// --- MAIN CONTENT ---
const mainChildren = [
  // DevNinja / OpsNinja
  jobTitle("Co-Founder & CTO", "DevNinja / OpsNinja", "The Hague, Netherlands (Remote)", "Nov 2024—Feb 2026"),
  jobBullet("Co-founded a dual-brand software consultancy and engineering staffing firm, serving PropTech, FinTech, and AI startups across Europe and the US."),
  jobBullet("Pioneered an agentic AI-driven development methodology that dramatically compressed delivery timelines, cutting both engineering and deployment costs for clients."),
  jobBullet("Delivered end-to-end product builds for a stealth-mode AI platform competing in the private equity intelligence space, from architecture through production launch."),
  jobBullet("Scaled distributed engineering teams and embedded senior talent at high-growth startups to accelerate their go-to-market."),
  toolsLine("Agentic AI, LLM Orchestration, MCP, DevContainers, DevPod, TypeScript, NodeJS, Docker, PostgreSQL."),

  // HeartbeatMed
  jobTitle("Staff Engineer", "HeartbeatMed", "Berlin, Germany", "Feb 2024—Aug 2024"),
  jobBullet("Implemented end-to-end and integration testing strategies, improving overall product quality and reducing bug discovery time."),
  jobBullet("Implemented preview environment seeding process, reducing setup time from multiple developer hours to minutes."),
  jobBullet("Developed automations for routine tasks i.e. score calculations, resending emails to eligible users etc., increasing team productivity and removing manual interventions."),
  jobBullet("Architected and implemented spotlight search functionality, improving user experience and search accuracy."),
  jobBullet("Mentored junior developers with extensive code reviews and pair programming sessions."),
  toolsLine("AWS Cloud with CloudFormation, Event-Driven Architecture, Docker, Postgres, Grafana, Prisma, Playwright, TypeScript, Remix, NodeJS, KeyCloak, TypeSense, NATs, PgBoss, yarn berry Monorepo."),

  // BuildingMinds
  jobTitle("Senior Full-Stack Developer & Technical Team Lead", "BuildingMinds GmbH", "Berlin, Germany", "2019—Jan 2024"),
  jobBullet("Architected and led development of a no-code-low-code highly scalable \"Generic Connector\" platform, enabling seamless integration of diverse data providers with minimal code changes; saving thousands of euros in integration costs per provider."),
  jobBullet("Designed and implemented a CDM-compliant data normalization and transformation pipeline, streamlining data flow to downstream services and data lake."),
  jobBullet("Spearheaded an inner-source initiative, fostering collaboration and code reuse across teams, resulting in shared ownership of unmaintained services."),
  jobBullet("Mentored junior developers with extensive code reviews and pair programming sessions."),
  jobBullet("Implemented automated testing strategies, increasing test coverage from 60% to 95% and reducing regression of bugs."),
  toolsLine("Azure Cloud, MSA, Event-Driven Architecture, K8s, Docker, Grafana, ELK, Postgres, Angular, NodeJS, TypeScript, RxJS, Ngxs, NestJS, Jest, Mongo, CosmosDB, Kafka, EventHubs, ETL."),

  // Caya
  jobTitle("Software Engineer", "Caya GmbH.", "Berlin, Germany (Remote)", "2017-2018"),
  jobBullet("Caya makes your postal mail digital. I was responsible for creating and maintaining necessary visual and compute components responsible for digitalizing the physical mail and making it available to users."),
  toolsLine("MSA, Serverless Framework, ReactJS, Typescript, Redux, NodeJS, AWS, DynamoDB."),

  // M-Hospitality
  jobTitle("Technical Lead", "M-Hospitality", "Athens, Greece (Remote)", "2019-2019"),
  jobBullet("Lead a team of designers and developers to create companion applications for top-rated hotels."),
  jobBullet("The most challenging aspect of the project was to \"generate\" a different app for every hotel from a single unified code base."),
  jobBullet("This was made possible by feeding different layout and other configurations at build time."),
  toolsLine("Ionic Framework, Angular, Typescript, Rxjs, MySQL, PHP, NodeJS."),

  // AIRE
  jobTitle("Full-Stack Developer", "AIRE Services LLC.", "California, USA Remote", "2016-2017, 2019"),
  jobBullet("As a core full-stack developer, I was involved in building an application that assists users in finding and agents in selling real estate."),
  jobBullet("I developed a data-ingestion system that pulls data from dozens of MLS Services from across the USA and standardizes it."),
  jobBullet("I also helped create a cross-platform mobile application that consumes this data."),
  toolsLine("Ionic Framework, Angular, Typescript, Rxjs, NodeJS, Restify, Cloudant."),

  // Upwork
  jobTitle("Independent Contractor", "Upwork", "Remote", "2015-2019"),
  jobBullet("100% job success rate throughout my career."),
  jobBullet("91% of clients have expressed a willingness to recommend my services to others."),
  jobBullet("100% of clients have indicated their desire to collaborate with me again."),

  // Open Source
  new Paragraph({
    spacing: { before: 240, after: 60 },
    children: [new TextRun({ text: "Open Source Contributions", font: FONT, size: 20, bold: true, color: TEAL })],
  }),
  jobBullet("LuLu (12k+ ★) — Leading open-source macOS firewall by Objective-See."),
  jobBullet("devpod-provider-oracle-cloud — DevPod provider for one-command cloud dev environments on Oracle Cloud Infrastructure."),
  jobBullet("CloudStream (8.9k+ ★) — Open-source Android media streaming platform."),
  jobBullet("serverless-dns — Privacy-first DNS resolver (RethinkDNS) for edge runtimes."),
  jobBullet("tauri-etcher — Tauri-based reimagining of Balena Etcher for OS image flashing."),
];

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "job-bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 360 } } },
        }],
      },
      {
        reference: "sidebar-bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 280, hanging: 280 } } },
        }],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: FONT, size: 20, color: DARK } },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 720, right: 720, bottom: 720, left: 720 },
        size: { width: 12240, height: 15840 },
      },
    },
    children: [
      // NAME
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 40 },
        children: [new TextRun({ text: "HAROON DILSHAD", font: FONT, size: 52, bold: true, color: BLACK })],
      }),
      // TITLE
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "Senior Product Engineer", font: FONT, size: 22, color: TEAL })],
      }),

      // TWO COLUMN BODY
      new Table({
        columnWidths: [3400, 7440],
        rows: [new TableRow({
          children: [
            // LEFT SIDEBAR
            new TableCell({
              borders: noBorders,
              width: { size: 3400, type: WidthType.DXA },
              margins: { top: 0, bottom: 0, left: 0, right: 200 },
              children: sidebarChildren,
            }),
            // RIGHT MAIN
            new TableCell({
              borders: {
                ...noBorders,
                left: { style: BorderStyle.SINGLE, size: 1, color: DIVIDER },
              },
              width: { size: 7440, type: WidthType.DXA },
              margins: { top: 0, bottom: 0, left: 300, right: 0 },
              children: mainChildren,
            }),
          ],
        })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  const outPath = process.argv[2] || "resume.docx";
  fs.writeFileSync(outPath, buffer);
  console.log(`Resume saved to ${outPath}`);
});
