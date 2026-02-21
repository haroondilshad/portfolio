const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, ExternalHyperlink, PageBreak
} = require("docx");

const C = {
  teal: "2E86AB", navy: "1B2A4A", dark: "222222", mid: "444444",
  gray: "777777", divider: "C8C8C8", accent2: "E8F4F8",
  sidebarBg: "1B2A4A", white: "FFFFFF",
};
const F = "Calibri";
const nb = { style: BorderStyle.NONE, size: 0, color: C.white };
const noBorders = { top: nb, bottom: nb, left: nb, right: nb };

function sideHead(text) {
  return new Paragraph({
    spacing: { before: 300, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.teal, space: 4 } },
    children: [new TextRun({ text: text.toUpperCase(), font: F, size: 18, bold: true, color: C.white, characterSpacing: 60 })],
  });
}

function sideText(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 15, after: 15 },
    children: [new TextRun({
      text, font: F, size: opts.size || 17,
      color: opts.color || C.accent2,
      bold: opts.bold || false,
    })],
  });
}

function sideBul(text) {
  return new Paragraph({
    numbering: { reference: "sb", level: 0 },
    spacing: { before: 10, after: 10 },
    children: [new TextRun({ text, font: F, size: 16, color: C.accent2 })],
  });
}

function mainHead(text) {
  return new Paragraph({
    spacing: { before: 260, after: 60 },
    children: [
      new TextRun({ text: text.toUpperCase(), font: F, size: 22, bold: true, color: C.navy, characterSpacing: 60 }),
    ],
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.teal, space: 4 } },
  });
}

function jobEntry(title, co, loc, dates) {
  return [
    new Paragraph({
      spacing: { before: 140, after: 0 },
      children: [
        new TextRun({ text: title, font: F, size: 20, bold: true, color: C.dark }),
      ],
    }),
    new Paragraph({
      spacing: { before: 15, after: 40 },
      children: [
        new TextRun({ text: co, font: F, size: 18, color: C.teal, bold: true }),
        new TextRun({ text: `  ·  ${loc}  ·  ${dates}`, font: F, size: 17, color: C.gray }),
      ],
    }),
  ];
}

function bul(text) {
  return new Paragraph({
    numbering: { reference: "mb", level: 0 },
    spacing: { before: 15, after: 15 },
    children: [new TextRun({ text, font: F, size: 19, color: C.mid })],
  });
}

function techLine(text) {
  return new Paragraph({
    spacing: { before: 25, after: 25 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: "Tech: ", font: F, size: 16, bold: true, color: C.teal }),
      new TextRun({ text, font: F, size: 16, color: C.gray, italics: true }),
    ],
  });
}

// SIDEBAR
const sidebar = [
  // Name block
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 20 },
    children: [new TextRun({ text: "HAROON", font: F, size: 40, bold: true, color: C.white, characterSpacing: 100 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 20 },
    children: [new TextRun({ text: "DILSHAD", font: F, size: 40, bold: true, color: C.teal, characterSpacing: 100 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 20, after: 200 },
    children: [new TextRun({ text: "Senior Product Engineer", font: F, size: 18, color: C.accent2 })],
  }),

  // Contact
  sideHead("Contact"),
  sideText("hello@haroondilshad.com", { color: C.teal, size: 16 }),
  sideText("Berlin, Germany"),
  new Paragraph({
    spacing: { before: 10, after: 10 },
    children: [new ExternalHyperlink({
      children: [new TextRun({ text: "haroondilshad.com", font: F, size: 16, color: C.teal })],
      link: "https://haroondilshad.com",
    })],
  }),
  new Paragraph({
    spacing: { before: 10, after: 10 },
    children: [new ExternalHyperlink({
      children: [new TextRun({ text: "linkedin.com/in/haroondilshad", font: F, size: 16, color: C.teal })],
      link: "https://linkedin.com/in/haroondilshad",
    })],
  }),
  new Paragraph({
    spacing: { before: 10, after: 10 },
    children: [new ExternalHyperlink({
      children: [new TextRun({ text: "github.com/haroondilshad", font: F, size: 16, color: C.teal })],
      link: "https://github.com/haroondilshad",
    })],
  }),

  // Languages
  sideHead("Languages"),
  sideText("English — Native"),
  sideText("Deutsch — A2"),

  // Strengths
  sideHead("Strengths"),
  sideBul("Agentic AI Development"),
  sideBul("Cloud Architecture"),
  sideBul("Secure Developer Experience"),
  sideBul("Technical Leadership"),
  sideBul("Product Thinking"),
  sideBul("DevOps & CI/CD"),
  sideBul("Data Engineering"),

  // Tech
  sideHead("Technologies"),
  sideText("Languages", { bold: true, color: C.white, size: 16 }),
  sideText("TypeScript · JavaScript · Java · Go · Python", { size: 15 }),
  sideText("Backend", { bold: true, color: C.white, size: 16 }),
  sideText("Node.js · NestJS · Express · Django · Deno", { size: 15 }),
  sideText("Frontend", { bold: true, color: C.white, size: 16 }),
  sideText("Angular · React · RxJS · Redux · Remix", { size: 15 }),
  sideText("Databases", { bold: true, color: C.white, size: 16 }),
  sideText("PostgreSQL · MongoDB · Redis · CouchDB", { size: 15 }),
  sideText("Cloud & DevOps", { bold: true, color: C.white, size: 16 }),
  sideText("AWS · Azure · OCI · Docker · K8s", { size: 15 }),
  sideText("Secure DX", { bold: true, color: C.white, size: 16 }),
  sideText("DevContainers · DevPod · MCP · Traefik", { size: 15 }),
  sideText("APIs", { bold: true, color: C.white, size: 16 }),
  sideText("GraphQL · gRPC · REST · ElasticSearch", { size: 15 }),

  // Education
  sideHead("Education"),
  sideText("BE Software Engineering", { bold: true, color: C.white, size: 16 }),
  sideText("SEECS — NUST, Islamabad", { size: 15 }),
  sideText("2011 — 2015", { size: 15, color: C.gray }),
  // Spacers to extend sidebar to bottom of page
  // Large spacer paragraph to extend sidebar background to page bottom
  new Paragraph({ spacing: { before: 2200, after: 0 }, children: [new TextRun({ text: "", size: 2 })] }),
];

// MAIN
const main = [
  // Summary
  mainHead("Profile"),
  new Paragraph({
    spacing: { before: 40, after: 60 },
    children: [new TextRun({
      text: "Senior Product Engineer with 11+ years of experience building scalable, user-centric software. From leading distributed engineering teams to leveraging agentic AI for rapid product delivery, I combine deep technical expertise with a founder's lens on shipping fast and shipping right.",
      font: F, size: 19, color: C.mid,
    })],
  }),

  mainHead("Experience"),

  ...jobEntry("Co-Founder & CTO", "DevNinja / OpsNinja", "The Hague, NL (Remote)", "Nov 2024 — Feb 2026"),
  bul("Co-founded a dual-brand consultancy serving PropTech, FinTech, and AI startups across Europe and the US."),
  bul("Pioneered agentic AI-driven development methodology, compressing delivery timelines and cutting costs."),
  bul("Delivered end-to-end builds for a stealth-mode AI platform in private equity intelligence."),
  bul("Scaled distributed teams and embedded senior talent at high-growth startups."),
  techLine("Agentic AI, LLM Orchestration, MCP, DevContainers, DevPod, TypeScript, Docker, PostgreSQL"),

  ...jobEntry("Staff Engineer", "HeartbeatMed", "Berlin, DE", "Feb 2024 — Aug 2024"),
  bul("Implemented E2E and integration testing; built preview environment seeding (hours → minutes)."),
  bul("Architected spotlight search; developed automations removing manual interventions."),
  techLine("AWS, CloudFormation, Docker, Postgres, Prisma, Playwright, Remix, TypeSense, KeyCloak"),

  ...jobEntry("Senior Full-Stack Dev & Tech Lead", "BuildingMinds GmbH", "Berlin, DE", "2019 — Jan 2024"),
  bul("Architected no-code/low-code \"Generic Connector\" platform, saving thousands per integration."),
  bul("Designed CDM-compliant data pipeline; increased test coverage 60% → 95%."),
  techLine("Azure, K8s, Docker, ELK, Postgres, Angular, NestJS, RxJS, Kafka, CosmosDB"),

  ...jobEntry("Software Engineer", "Caya GmbH", "Berlin, DE (Remote)", "2017 — 2018"),
  bul("Built components for digitizing physical mail and making it accessible to users."),

  ...jobEntry("Technical Lead", "M-Hospitality", "Athens, GR (Remote)", "2019"),
  bul("Led team building hotel companion apps from a unified, config-driven codebase."),

  ...jobEntry("Full-Stack Developer", "AIRE Services LLC", "California, USA (Remote)", "2016 — 2017, 2019"),
  bul("Built real estate platform with data ingestion from dozens of MLS Services across the USA."),

  ...jobEntry("Independent Contractor", "Upwork", "Remote", "2015 — 2019"),
  bul("100% job success · 91% recommendation rate · 100% repeat collaboration."),

  mainHead("Open Source"),
  bul("LuLu (12k+ ★) — macOS firewall · devpod-provider-oracle-cloud — Oracle Cloud DevPod provider"),
  bul("CloudStream (8.9k+ ★) — Android media platform · serverless-dns — Edge DNS resolver"),
  bul("tauri-etcher — Tauri-based OS image flasher"),
];

const doc = new Document({
  numbering: {
    config: [
      { reference: "mb", levels: [{ level: 0, format: LevelFormat.BULLET, text: "▸", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 300, hanging: 300 } }, run: { color: C.teal, font: F, size: 19 } } }] },
      { reference: "sb", levels: [{ level: 0, format: LevelFormat.BULLET, text: "›", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 220, hanging: 220 } }, run: { color: C.teal, font: F, size: 16 } } }] },
    ],
  },
  styles: { default: { document: { run: { font: F, size: 20, color: C.dark } } } },
  sections: [{
    properties: {
      page: {
        margin: { top: 0, right: 0, bottom: 400, left: 0 },
        size: { width: 12240, height: 15840 },
      },
    },
    children: [
      new Table({
        columnWidths: [3600, 8640],
        rows: [new TableRow({
          children: [
            new TableCell({
              borders: noBorders,
              shading: { fill: C.sidebarBg, type: ShadingType.CLEAR },
              width: { size: 3600, type: WidthType.DXA },
              margins: { top: 0, bottom: 200, left: 300, right: 250 },
              children: sidebar,
            }),
            new TableCell({
              borders: noBorders,
              width: { size: 8640, type: WidthType.DXA },
              margins: { top: 400, bottom: 200, left: 400, right: 500 },
              children: main,
            }),
          ],
        })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = process.argv[2] || "resume-v3.docx";
  fs.writeFileSync(out, buf);
  console.log(`Saved ${out}`);
});
