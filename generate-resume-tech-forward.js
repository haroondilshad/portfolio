const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, ExternalHyperlink, PageBreak
} = require("docx");

const C = {
  teal: "2E86AB", navy: "1B2A4A", dark: "222222", mid: "444444",
  gray: "666666", light: "999999", divider: "D0D0D0",
  headerBg: "1B2A4A", accentBg: "E8F4F8", white: "FFFFFF",
};
const F = "Calibri";
const nb = { style: BorderStyle.NONE, size: 0, color: C.white };
const noBorders = { top: nb, bottom: nb, left: nb, right: nb };

function heading(text, color = C.navy) {
  return new Paragraph({
    spacing: { before: 260, after: 60 },
    children: [
      new TextRun({ text: "━━  ", font: F, size: 18, color: C.teal }),
      new TextRun({ text: text.toUpperCase(), font: F, size: 21, bold: true, color, characterSpacing: 50 }),
    ],
  });
}

function job(title, co, loc, dates) {
  return new Paragraph({
    spacing: { before: 160, after: 20 },
    children: [
      new TextRun({ text: title, font: F, size: 20, bold: true, color: C.dark }),
      new TextRun({ text: "  ·  ", font: F, size: 18, color: C.light }),
      new TextRun({ text: co, font: F, size: 19, color: C.teal }),
    ],
  });
}

function jobMeta(loc, dates) {
  return new Paragraph({
    spacing: { before: 0, after: 50 },
    children: [
      new TextRun({ text: loc, font: F, size: 17, color: C.gray, italics: true }),
      new TextRun({ text: `  |  ${dates}`, font: F, size: 17, color: C.gray }),
    ],
  });
}

function bul(text) {
  return new Paragraph({
    numbering: { reference: "bl", level: 0 },
    spacing: { before: 15, after: 15 },
    children: [new TextRun({ text, font: F, size: 19, color: C.mid })],
  });
}

function tools(text) {
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: "Stack: ", font: F, size: 17, bold: true, color: C.teal }),
      new TextRun({ text, font: F, size: 17, color: C.gray, italics: true }),
    ],
  });
}

function skillPill(label) {
  return new TableCell({
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: C.teal },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: C.teal },
      left: { style: BorderStyle.SINGLE, size: 1, color: C.teal },
      right: { style: BorderStyle.SINGLE, size: 1, color: C.teal },
    },
    shading: { fill: C.accentBg, type: ShadingType.CLEAR },
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    width: { size: 2200, type: WidthType.DXA },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: label, font: F, size: 16, color: C.navy, bold: true })],
    })],
  });
}

function spacerCell() {
  return new TableCell({
    borders: noBorders,
    width: { size: 120, type: WidthType.DXA },
    children: [new Paragraph({ children: [new TextRun({ text: "", size: 2 })] })],
  });
}

const pillRow1 = ["TypeScript", "Node.js", "React", "Angular"];
const pillRow2 = ["AWS", "Azure", "Docker", "K8s"];
const pillRow3 = ["PostgreSQL", "MongoDB", "DevPod", "MCP"];
const pillRow4 = ["NestJS", "Playwright", "GraphQL", "Kafka"];

function makePillRow(pills) {
  const cells = [];
  pills.forEach((p, i) => {
    if (i > 0) cells.push(spacerCell());
    cells.push(skillPill(p));
  });
  return new TableRow({ children: cells });
}

function spacerRow() {
  const cells = [];
  for (let i = 0; i < 7; i++) {
    cells.push(new TableCell({
      borders: noBorders,
      width: { size: i % 2 === 0 ? 2200 : 120, type: WidthType.DXA },
      children: [new Paragraph({ spacing: { before: 40, after: 0 }, children: [new TextRun({ text: "", size: 2 })] })],
    }));
  }
  return new TableRow({ children: cells });
}

const doc = new Document({
  numbering: {
    config: [{
      reference: "bl",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "▪",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 360 } }, run: { color: C.teal, font: F, size: 19 } },
      }],
    }],
  },
  styles: { default: { document: { run: { font: F, size: 20, color: C.dark } } } },
  sections: [{
    properties: {
      page: {
        margin: { top: 0, right: 720, bottom: 600, left: 720 },
        size: { width: 12240, height: 15840 },
      },
    },
    children: [
      // HEADER
      new Table({
        columnWidths: [10800],
        rows: [new TableRow({
          children: [new TableCell({
            borders: noBorders,
            shading: { fill: C.headerBg, type: ShadingType.CLEAR },
            width: { size: 10800, type: WidthType.DXA },
            margins: { top: 300, bottom: 300, left: 400, right: 400 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 100, after: 0 },
                children: [new TextRun({ text: "HAROON DILSHAD", font: F, size: 48, bold: true, color: C.white, characterSpacing: 80 })],
              }),
              new Paragraph({
                spacing: { before: 40, after: 20 },
                children: [new TextRun({ text: "Senior Product Engineer  ·  Full Stack  ·  11+ Years", font: F, size: 19, color: C.accentBg })],
              }),
              new Paragraph({
                spacing: { before: 60, after: 80 },
                children: [
                  new TextRun({ text: "hello@haroondilshad.com", font: F, size: 17, color: C.accentBg }),
                  new TextRun({ text: "   ·   ", font: F, size: 17, color: C.teal }),
                  new TextRun({ text: "Berlin, Germany", font: F, size: 17, color: C.accentBg }),
                  new TextRun({ text: "   ·   ", font: F, size: 17, color: C.teal }),
                  new TextRun({ text: "haroondilshad.com", font: F, size: 17, color: C.accentBg }),
                  new TextRun({ text: "   ·   ", font: F, size: 17, color: C.teal }),
                  new TextRun({ text: "github.com/haroondilshad", font: F, size: 17, color: C.accentBg }),
                ],
              }),
            ],
          })],
        })],
      }),

      // SKILLS PILLS
      heading("Core Technologies"),
      new Table({
        columnWidths: [2200, 120, 2200, 120, 2200, 120, 2200],
        rows: [
          makePillRow(pillRow1),
          spacerRow(),
          makePillRow(pillRow2),
          spacerRow(),
          makePillRow(pillRow3),
          spacerRow(),
          makePillRow(pillRow4),
        ],
      }),

      // SUMMARY
      heading("Profile"),
      new Paragraph({
        spacing: { before: 40, after: 80 },
        children: [new TextRun({
          text: "Senior Product Engineer with 11+ years of experience building scalable, user-centric software. From leading distributed engineering teams to leveraging agentic AI for rapid product delivery, I combine deep technical expertise with a founder's lens on shipping fast and shipping right.",
          font: F, size: 19, color: C.mid,
        })],
      }),

      // EXPERIENCE
      heading("Experience"),

      job("Co-Founder & CTO", "DevNinja / OpsNinja"),
      jobMeta("The Hague, Netherlands (Remote)", "Nov 2024 — Feb 2026"),
      bul("Co-founded a dual-brand software consultancy and engineering staffing firm, serving PropTech, FinTech, and AI startups across Europe and the US."),
      bul("Pioneered an agentic AI-driven development methodology that dramatically compressed delivery timelines, cutting both engineering and deployment costs."),
      bul("Delivered end-to-end product builds for a stealth-mode AI platform in the private equity intelligence space."),
      bul("Scaled distributed engineering teams and embedded senior talent at high-growth startups."),
      tools("Agentic AI, LLM Orchestration, MCP, DevContainers, DevPod, TypeScript, NodeJS, Docker, PostgreSQL"),

      job("Staff Engineer", "HeartbeatMed"),
      jobMeta("Berlin, Germany", "Feb 2024 — Aug 2024"),
      bul("Implemented end-to-end and integration testing strategies, improving product quality and reducing bug discovery time."),
      bul("Implemented preview environment seeding, reducing setup time from developer hours to minutes."),
      bul("Developed automations for routine tasks, increasing team productivity."),
      bul("Architected spotlight search functionality, improving user experience and search accuracy."),
      tools("AWS, CloudFormation, Docker, Postgres, Grafana, Prisma, Playwright, TypeScript, Remix, KeyCloak, TypeSense"),

      job("Senior Full-Stack Dev & Tech Lead", "BuildingMinds GmbH"),
      jobMeta("Berlin, Germany", "2019 — Jan 2024"),
      bul("Architected a no-code/low-code \"Generic Connector\" platform, saving thousands in integration costs per provider."),
      bul("Designed CDM-compliant data normalization and transformation pipeline."),
      bul("Spearheaded inner-source initiative; increased test coverage from 60% to 95%."),
      tools("Azure, K8s, Docker, Grafana, ELK, Postgres, Angular, NestJS, TypeScript, RxJS, Kafka, CosmosDB"),

      job("Software Engineer", "Caya GmbH"),
      jobMeta("Berlin, Germany (Remote)", "2017 — 2018"),
      bul("Built visual and compute components for digitizing physical mail."),
      tools("Serverless Framework, React, TypeScript, Redux, NodeJS, AWS, DynamoDB"),

      job("Technical Lead", "M-Hospitality"),
      jobMeta("Athens, Greece (Remote)", "2019"),
      bul("Led team building companion apps for hotels from a unified codebase with config-driven architecture."),

      job("Full-Stack Developer", "AIRE Services LLC"),
      jobMeta("California, USA (Remote)", "2016 — 2017, 2019"),
      bul("Built real estate agent discovery platform with data ingestion from dozens of MLS Services."),

      job("Independent Contractor", "Upwork"),
      jobMeta("Remote", "2015 — 2019"),
      bul("100% job success rate · 91% client recommendation rate · 100% repeat collaboration interest."),

      // OPEN SOURCE
      heading("Open Source"),
      bul("LuLu (12k+ ★) — Leading open-source macOS firewall by Objective-See."),
      bul("devpod-provider-oracle-cloud — DevPod provider for Oracle Cloud Infrastructure."),
      bul("CloudStream (8.9k+ ★) — Open-source Android media streaming platform."),
      bul("serverless-dns — Privacy-first DNS resolver (RethinkDNS) for edge runtimes."),
      bul("tauri-etcher — Tauri-based reimagining of Balena Etcher."),

      // EDUCATION
      heading("Education"),
      new Paragraph({
        spacing: { before: 40 },
        children: [
          new TextRun({ text: "BE Software Engineering", font: F, size: 19, bold: true, color: C.dark }),
          new TextRun({ text: "  ·  SEECS — NUST, Islamabad, Pakistan  ·  2011 — 2015", font: F, size: 18, color: C.gray }),
        ],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = process.argv[2] || "resume-v2.docx";
  fs.writeFileSync(out, buf);
  console.log(`Saved ${out}`);
});
