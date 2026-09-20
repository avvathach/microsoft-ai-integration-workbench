const baseMetrics = {
  processed: 12840,
  deterministic: 9360,
  aiResidual: 1420,
  baselineHoursPerThousand: 42,
};

const reviewerName = "A. Thach (demo)";

const cases = [
  {
    id: "EDU-ID-2041",
    domain: "Identity",
    owner: "Registrar",
    priority: "High",
    age: "13h",
    proposal: "Accept match",
    confidence: 93,
    aiNeeded: true,
    rationale:
      "Same birth date and normalized phone. Name differs only by middle initial; program wording maps to the same nursing award.",
    evidence: ["Exact DOB", "Normalized phone", "Name similarity 0.94", "Program synonym"],
    source: {
      system: "Legacy SIS",
      studentId: "L-104883",
      name: "Elena Ramirez",
      dob: "2004-02-14",
      email: "e.ramirez04@example.edu",
      phone: "713-555-0194",
      program: "AAS Nursing",
      term: "2026FA",
      courseCode: "RNSG-1301",
      balance: "$0.00",
    },
    target: {
      system: "Target SIS",
      studentId: "T-88213",
      name: "Elena M Ramirez",
      dob: "2004-02-14",
      email: "elena.ramirez@student.example.edu",
      phone: "(713) 555-0194",
      program: "Associate Nursing",
      term: "Fall 2026",
      courseCode: "RNSG 1301",
      balance: "$0.00",
    },
  },
  {
    id: "EDU-CRS-1178",
    domain: "Course",
    owner: "Academic Affairs",
    priority: "Medium",
    age: "21h",
    proposal: "Accept mapping",
    confidence: 88,
    aiNeeded: true,
    rationale:
      "Course title, contact hours, and catalog description align. The target uses a space instead of a hyphen in the subject-number code.",
    evidence: ["Title match", "Hours match", "Code punctuation drift", "Catalog year 2026"],
    source: {
      system: "Legacy SIS",
      studentId: "Course catalog",
      name: "Introduction to Psychology",
      dob: "Not applicable",
      email: "psyc.dept@example.edu",
      phone: "Not applicable",
      program: "Core Curriculum",
      term: "2026FA",
      courseCode: "PSYC-2301",
      balance: "3 SCH",
    },
    target: {
      system: "Target SIS",
      studentId: "Course catalog",
      name: "Introductory Psychology",
      dob: "Not applicable",
      email: "social.sciences@example.edu",
      phone: "Not applicable",
      program: "Core",
      term: "Fall 2026",
      courseCode: "PSYC 2301",
      balance: "3 credit hours",
    },
  },
  {
    id: "EDU-ID-3199",
    domain: "Identity",
    owner: "Financial Aid",
    priority: "High",
    age: "2d",
    proposal: "Escalate",
    confidence: 71,
    aiNeeded: true,
    rationale:
      "The names are close and the email pattern is similar, but the date of birth and phone number do not agree. A functional owner should resolve this.",
    evidence: ["Name similarity 0.82", "DOB mismatch", "Phone mismatch", "Shared last name"],
    source: {
      system: "Legacy SIS",
      studentId: "L-209781",
      name: "Marcus Johnson",
      dob: "2003-11-08",
      email: "m.johnson3@example.edu",
      phone: "832-555-0150",
      program: "Business Administration",
      term: "2026SU",
      courseCode: "BUSI-1301",
      balance: "$425.00",
    },
    target: {
      system: "Target SIS",
      studentId: "T-50028",
      name: "Marcus Jonson",
      dob: "2003-10-08",
      email: "marcus.johnson@student.example.edu",
      phone: "281-555-0182",
      program: "Business AAS",
      term: "Summer 2026",
      courseCode: "BUSI 1301",
      balance: "$425.00",
    },
  },
  {
    id: "EDU-TRM-5220",
    domain: "Term",
    owner: "Registrar",
    priority: "Medium",
    age: "8h",
    proposal: "Accept mapping",
    confidence: 91,
    aiNeeded: false,
    rationale:
      "The term codes differ by format, but both records point to the same Fall 2026 academic period and campus session.",
    evidence: ["Term key match", "Campus match", "Start date match", "Rule-cleared candidate"],
    source: {
      system: "Legacy SIS",
      studentId: "L-775230",
      name: "Priya Nair",
      dob: "2005-06-30",
      email: "p.nair@example.edu",
      phone: "713-555-0117",
      program: "Computer Programming",
      term: "2026FA1",
      courseCode: "ITSE-1302",
      balance: "$0.00",
    },
    target: {
      system: "Target SIS",
      studentId: "T-775230",
      name: "Priya Nair",
      dob: "2005-06-30",
      email: "priya.nair@student.example.edu",
      phone: "713.555.0117",
      program: "Computer Programming",
      term: "Fall 2026 Session 1",
      courseCode: "ITSE 1302",
      balance: "$0.00",
    },
  },
  {
    id: "EDU-TXN-0836",
    domain: "Transaction",
    owner: "Student Accounts",
    priority: "High",
    age: "3d",
    proposal: "Reject match",
    confidence: 86,
    aiNeeded: true,
    rationale:
      "Payment amount and term align, but transaction dates, reference numbers, and payer channel differ enough to reject this match.",
    evidence: ["Amount match", "Reference mismatch", "Date outside tolerance", "Channel mismatch"],
    source: {
      system: "Legacy SIS",
      studentId: "L-661720",
      name: "Daniel Carter",
      dob: "2002-09-02",
      email: "d.carter@example.edu",
      phone: "346-555-0180",
      program: "Welding Technology",
      term: "2026FA",
      courseCode: "WLDG-1421",
      balance: "$1,140.00 payment",
    },
    target: {
      system: "Target SIS",
      studentId: "T-661720",
      name: "Daniel Carter",
      dob: "2002-09-02",
      email: "daniel.carter@student.example.edu",
      phone: "346-555-0180",
      program: "Welding",
      term: "Fall 2026",
      courseCode: "WLDG 1421",
      balance: "$1,140.00 waiver",
    },
  },
  {
    id: "EDU-ID-4427",
    domain: "Identity",
    owner: "Admissions",
    priority: "Low",
    age: "5h",
    proposal: "Accept match",
    confidence: 96,
    aiNeeded: false,
    rationale:
      "Exact institutional ID and date of birth. Email changed after admission, which is expected when a student account is provisioned.",
    evidence: ["Exact institutional ID", "Exact DOB", "Email lifecycle change", "Rule-cleared candidate"],
    source: {
      system: "Legacy SIS",
      studentId: "EDU-900318",
      name: "Sofia Chen",
      dob: "2006-04-11",
      email: "sofia.chen.personal@example.com",
      phone: "713-555-0176",
      program: "Cybersecurity",
      term: "2026FA",
      courseCode: "ITSC-1301",
      balance: "$0.00",
    },
    target: {
      system: "Target SIS",
      studentId: "EDU-900318",
      name: "Sofia Chen",
      dob: "2006-04-11",
      email: "sofia.chen@student.example.edu",
      phone: "713-555-0176",
      program: "Cybersecurity",
      term: "Fall 2026",
      courseCode: "ITSC 1301",
      balance: "$0.00",
    },
  },
  {
    id: "EDU-CRS-2084",
    domain: "Course",
    owner: "Workforce Programs",
    priority: "Medium",
    age: "1d",
    proposal: "Escalate",
    confidence: 78,
    aiNeeded: true,
    rationale:
      "The titles look related, but the target record carries a different contact-hour model. Workforce leadership should confirm before mapping.",
    evidence: ["Title similarity 0.79", "Hours mismatch", "Program owner match", "Catalog note differs"],
    source: {
      system: "Legacy SIS",
      studentId: "Course catalog",
      name: "Patient Care Technician I",
      dob: "Not applicable",
      email: "health.sciences@example.edu",
      phone: "Not applicable",
      program: "Continuing Education",
      term: "2026FA",
      courseCode: "NURA-1013",
      balance: "96 contact hours",
    },
    target: {
      system: "Target SIS",
      studentId: "Course catalog",
      name: "Patient Care Technician Clinical",
      dob: "Not applicable",
      email: "workforce@example.edu",
      phone: "Not applicable",
      program: "Continuing Education",
      term: "Fall 2026",
      courseCode: "NURA 1060",
      balance: "64 contact hours",
    },
  },
  {
    id: "EDU-ID-1182",
    domain: "Identity",
    owner: "Registrar",
    priority: "Medium",
    age: "16h",
    proposal: "Accept match",
    confidence: 90,
    aiNeeded: true,
    rationale:
      "The preferred name appears in the target system while the legal name appears in the legacy system. Birth date, phone, and address token match.",
    evidence: ["Preferred/legal name", "Exact DOB", "Address token match", "Phone match"],
    source: {
      system: "Legacy SIS",
      studentId: "L-113992",
      name: "Anthony Williams",
      dob: "2001-12-19",
      email: "a.williams@example.edu",
      phone: "832-555-0112",
      program: "Digital Communication",
      term: "2026FA",
      courseCode: "COMM-1307",
      balance: "$0.00",
    },
    target: {
      system: "Target SIS",
      studentId: "T-841129",
      name: "Tony Williams",
      dob: "2001-12-19",
      email: "tony.williams@student.example.edu",
      phone: "832-555-0112",
      program: "Digital Communications",
      term: "Fall 2026",
      courseCode: "COMM 1307",
      balance: "$0.00",
    },
  },
];

const pipelineSteps = [
  {
    icon: "database",
    title: "Enterprise sources",
    text: "Read SIS, LMS, advising, and workforce-program data through supported APIs.",
  },
  {
    icon: "cloud",
    title: "Microsoft tenant",
    text: "Stage normalized extracts in Azure or SharePoint/Dataverse with review-scoped access.",
  },
  {
    icon: "list-checks",
    title: "Rules first",
    text: "Exact IDs, normalized names, DOB, term keys, and code maps clear low-risk records.",
  },
  {
    icon: "sparkles",
    title: "Azure AI residuals",
    text: "Only unresolved cases receive a recommendation, confidence score, and written rationale.",
  },
  {
    icon: "users",
    title: "Human decision",
    text: "Functional owners accept, reject, or escalate. AI never writes to record systems.",
  },
  {
    icon: "bar-chart-3",
    title: "Audit and Power BI",
    text: "Decisions are written to governed audit storage and surfaced in executive dashboards.",
  },
];

const controls = [
  {
    title: "FERPA and least privilege",
    text: "Reviewer visibility is role-scoped through Entra groups and functional ownership.",
  },
  {
    title: "Tenant boundary",
    text: "The production version would use approved Azure AI services with retention, logging, and training controls.",
  },
  {
    title: "Segregation of duties",
    text: "The app records recommendations and decisions but leaves commit authority with system owners.",
  },
  {
    title: "Audit completeness",
    text: "Each recommendation, rationale, human action, reviewer, and timestamp is captured.",
  },
];

const integrations = [
  {
    icon: "key-round",
    name: "Microsoft Entra ID",
    state: "SSO and RBAC",
    text: "Single sign-on and reviewer access map to enterprise app roles and groups.",
    bullets: ["OIDC or SAML enterprise app", "Role claims for reviewer, auditor, admin", "Conditional Access compatible"],
  },
  {
    icon: "workflow",
    name: "Microsoft Graph",
    state: "Workflow API",
    text: "Routes exceptions, reads profile context, and writes post-decision events.",
    bullets: ["Create Teams notifications", "Write SharePoint list items", "Use least-privilege app permissions"],
  },
  {
    icon: "folder-check",
    name: "SharePoint or Dataverse",
    state: "Governed store",
    text: "Decision records land in a governed list, library, or Dataverse table.",
    bullets: ["Retention labels", "Functional owner columns", "Exportable audit record"],
  },
  {
    icon: "message-square",
    name: "Microsoft Teams",
    state: "Review routing",
    text: "Exception owners receive queue summaries where they already work.",
    bullets: ["Registrar queue", "Financial Aid queue", "Student Accounts queue"],
  },
  {
    icon: "bot",
    name: "Azure AI Foundry",
    state: "Residual-only AI",
    text: "AI proposes matches only after deterministic logic cannot clear them.",
    bullets: ["Confidence and rationale", "No system-of-record writes", "Held-out validation before thresholds"],
  },
  {
    icon: "pie-chart",
    name: "Power BI or Fabric",
    state: "Executive dashboard",
    text: "Shows throughput, exception categories, queue age, and audit coverage.",
    bullets: ["Embedded report path", "CIO-ready measures", "Operational owner slices"],
  },
];

const roleStories = {
  cio: [
    {
      title: "CIO message",
      body:
        "This reduces integration risk by making reconciliation measurable. The value is not that AI replaces staff; it makes repetitive comparison faster while preserving human authority.",
      kicker: "What changes",
      kickerBody: "Manual spreadsheet judgment becomes a governed workflow with metrics and an audit trail.",
    },
    {
      title: "Institutional value",
      body:
        "A small internal team can pilot one record domain before broad expansion. Stop conditions are explicit, so the institution can halt if AI does not outperform rules.",
      kicker: "Why now",
      kickerBody: "The same capability can be reused after the SIS transition for any two systems that must agree.",
    },
    {
      title: "Governance posture",
      body:
        "Systems of record remain authoritative. Student data stays inside the institution's Microsoft boundary, and every recommendation is traceable to evidence.",
      kicker: "Governance point",
      kickerBody: "The app is designed for FERPA, auditability, accessibility, and segregation of duties from day one.",
    },
  ],
  technical: [
    {
      title: "Architecture message",
      body:
        "Ingestion should use supported SIS/LMS integration layers, then stage normalized extracts in Microsoft-controlled storage. Deterministic matching runs before model calls.",
      kicker: "Core pattern",
      kickerBody: "Rules clear exact or near-exact cases; Azure AI is reserved for unresolved candidates.",
    },
    {
      title: "Integration surface",
      body:
        "Entra handles identity and role claims. Microsoft Graph handles Teams routing and SharePoint or Dataverse audit writes. Power BI reads curated metrics.",
      kicker: "Implementation guardrail",
      kickerBody: "Use Graph v1.0 where production support is required and keep write operations behind reviewer decisions.",
    },
    {
      title: "Validation path",
      body:
        "Before auto-clear, compare AI recommendations against held-out human decisions and inspect false positives by domain.",
      kicker: "Model control",
      kickerBody: "Confidence thresholds are operational settings, not hard-coded promises.",
    },
  ],
  recruiter: [
    {
      title: "Role fit",
      body:
        "This demonstrates how Avva can translate a messy institutional workflow into a practical AI integration product that academic, IT, and operations leaders can use.",
      kicker: "What it shows",
      kickerBody: "Product thinking, Microsoft integration fluency, data stewardship, and executive communication.",
    },
    {
      title: "Experience proof",
      body:
        "The interface is built for reviewers with full-time jobs: plain rationale, side-by-side evidence, and clear accept, reject, or escalate actions.",
      kicker: "Why it matters",
      kickerBody: "This connects directly to adoption, change management, data quality, testing, and cross-campus stakeholder work.",
    },
    {
      title: "Credibility",
      body:
        "The story avoids invented savings and starts with baselines. It includes stopping conditions, so it reads as accountable leadership rather than AI hype.",
      kicker: "Interview angle",
      kickerBody: "It is easy to explain to CIOs, CTOs, functional owners, technical teams, and HR stakeholders.",
    },
  ],
};

const fieldLabels = {
  studentId: "ID",
  name: "Name",
  dob: "DOB",
  email: "Email",
  phone: "Phone",
  program: "Program",
  term: "Term",
  courseCode: "Course",
  balance: "Balance",
};

const state = {
  selectedId: cases[0].id,
  domain: "All",
  role: "cio",
  threshold: 92,
  audit: [],
  graphEvents: 0,
};

function loadState() {
  const saved = localStorage.getItem("iavva-highered-mvp");
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state.audit = Array.isArray(parsed.audit) ? parsed.audit : [];
    state.threshold = Number(parsed.threshold) || state.threshold;
    state.graphEvents = Number(parsed.graphEvents) || 0;

    if (parsed.decisions) {
      cases.forEach((item) => {
        if (parsed.decisions[item.id]) {
          item.decision = parsed.decisions[item.id];
        }
      });
    }
  } catch {
    localStorage.removeItem("iavva-highered-mvp");
  }
}

function saveState() {
  const decisions = cases.reduce((acc, item) => {
    if (item.decision) acc[item.id] = item.decision;
    return acc;
  }, {});

  localStorage.setItem(
    "iavva-highered-mvp",
    JSON.stringify({
      audit: state.audit,
      decisions,
      threshold: state.threshold,
      graphEvents: state.graphEvents,
    })
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function getDecisionLabel(item) {
  return item.decision ? item.decision.action : "Needs review";
}

function getMetrics() {
  const decided = cases.filter((item) => item.decision).length;
  const autoReady = cases.filter(
    (item) => !item.decision && item.confidence >= state.threshold && item.proposal !== "Escalate"
  ).length;
  const pending = cases.length - decided;
  const coverage = Math.round((decided / cases.length) * 100);
  const projectedHoursSaved = Math.round(
    (baseMetrics.deterministic / 1000) * baseMetrics.baselineHoursPerThousand * 0.68
  );

  return {
    decided,
    pending,
    coverage,
    autoReady,
    projectedHoursSaved,
  };
}

function renderMetrics() {
  const metrics = getMetrics();
  const metricData = [
    {
      icon: "database-zap",
      label: "Records processed",
      value: formatNumber(baseMetrics.processed),
      detail: `${formatNumber(baseMetrics.deterministic)} cleared by deterministic rules first`,
    },
    {
      icon: "sparkles",
      label: "Residual AI cases",
      value: formatNumber(baseMetrics.aiResidual),
      detail: `${metrics.autoReady} demo cases currently above threshold`,
    },
    {
      icon: "clipboard-check",
      label: "Human decisions",
      value: `${metrics.decided}/${cases.length}`,
      detail: `${metrics.pending} open reviewer decisions remain`,
    },
    {
      icon: "clock-3",
      label: "Hours to validate",
      value: formatNumber(metrics.projectedHoursSaved),
      detail: "Illustrative estimate until institutional baseline is measured",
    },
  ];

  document.querySelector("#metricsGrid").innerHTML = metricData
    .map(
      (metric) => `
        <article class="metric-card">
          <div class="metric-topline">
            <span class="eyebrow">${metric.label}</span>
            <span class="metric-icon"><i data-lucide="${metric.icon}"></i></span>
          </div>
          <div>
            <strong>${metric.value}</strong>
            <p>${metric.detail}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPipeline() {
  document.querySelector("#pipeline").innerHTML = pipelineSteps
    .map(
      (step) => `
        <article class="pipeline-node">
          <span class="node-icon"><i data-lucide="${step.icon}"></i></span>
          <h3>${step.title}</h3>
          <p>${step.text}</p>
        </article>
      `
    )
    .join("");
}

function renderControls() {
  document.querySelector("#controlList").innerHTML = controls
    .map(
      (control) => `
        <article class="control-item">
          <h3>${control.title}</h3>
          <p>${control.text}</p>
        </article>
      `
    )
    .join("");
}

function domains() {
  return ["All", ...Array.from(new Set(cases.map((item) => item.domain)))];
}

function renderDomainFilters() {
  document.querySelector("#domainFilters").innerHTML = domains()
    .map(
      (domain) => `
        <button type="button" role="tab" aria-selected="${state.domain === domain}" data-domain="${domain}">
          ${domain}
        </button>
      `
    )
    .join("");
}

function filteredCases() {
  const term = document.querySelector("#searchInput")?.value.trim().toLowerCase() || "";
  return cases.filter((item) => {
    const domainMatch = state.domain === "All" || item.domain === state.domain;
    const haystack = [
      item.id,
      item.domain,
      item.owner,
      item.priority,
      item.source.name,
      item.target.name,
      item.source.studentId,
      item.target.studentId,
      item.source.courseCode,
      item.target.courseCode,
    ]
      .join(" ")
      .toLowerCase();

    return domainMatch && (!term || haystack.includes(term));
  });
}

function renderQueue() {
  const queue = filteredCases();
  document.querySelector("#queueCount").textContent = queue.length;

  if (!queue.some((item) => item.id === state.selectedId) && queue[0]) {
    state.selectedId = queue[0].id;
  }

  document.querySelector("#queueList").innerHTML = queue.length
    ? queue
        .map((item) => {
          const active = item.id === state.selectedId ? "active" : "";
          const done = item.decision ? "done" : "";
          const badgeClass = item.domain.toLowerCase();
          return `
            <button class="queue-item ${active} ${done}" type="button" data-id="${item.id}">
              <span class="record-title">
                <strong>${item.source.name}</strong>
                <span class="status ${statusClass(item)}">${getDecisionLabel(item)}</span>
              </span>
              <span class="queue-meta">
                <span class="badge ${badgeClass}">${item.domain}</span>
                <span class="badge">${item.owner}</span>
                <span class="badge">${item.age}</span>
              </span>
              <span class="confidence-track" aria-label="Confidence ${item.confidence}%">
                <span style="--width: ${item.confidence}%"></span>
              </span>
            </button>
          `;
        })
        .join("")
    : `<div class="audit-empty"><i data-lucide="inbox"></i>No records match the current filter.</div>`;
}

function statusClass(item) {
  if (item.decision?.action === "Accept match" || item.decision?.action === "Accept mapping") return "good";
  if (item.decision?.action === "Reject match") return "danger";
  if (item.decision?.action === "Escalate") return "review";
  if (item.proposal === "Escalate") return "warn";
  return item.confidence >= state.threshold ? "good" : "review";
}

function normalizeValue(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function fieldStatus(sourceValue, targetValue) {
  if (sourceValue === "Not applicable" || targetValue === "Not applicable") return "review";
  if (normalizeValue(sourceValue) === normalizeValue(targetValue)) return "good";
  return "review";
}

function renderFieldRows(record, counterpart) {
  return Object.keys(fieldLabels)
    .map((key) => {
      const status = fieldStatus(record[key], counterpart[key]);
      const icon = status === "good" ? "check-circle-2" : "circle-alert";
      return `
        <div class="field-row">
          <span class="field-label"><i data-lucide="${icon}"></i>${fieldLabels[key]}</span>
          <span class="field-value">${record[key]}</span>
        </div>
      `;
    })
    .join("");
}

function selectedCase() {
  return cases.find((item) => item.id === state.selectedId) || cases[0];
}

function renderCaseDetail() {
  const item = selectedCase();
  const decision = item.decision;
  const actionLabel =
    item.proposal === "Accept mapping" ? "Accept mapping" : item.proposal === "Reject match" ? "Reject match" : "Accept match";

  document.querySelector("#caseDetail").innerHTML = `
    <div class="case-header">
      <div>
        <p class="eyebrow">${item.id}</p>
        <h3>${item.source.name}</h3>
        <div class="case-meta">
          <span class="badge ${item.domain.toLowerCase()}">${item.domain}</span>
          <span class="badge">${item.owner}</span>
          <span class="badge">${item.priority} priority</span>
          <span class="badge">${item.aiNeeded ? "AI residual" : "Rule-cleared candidate"}</span>
        </div>
      </div>
      <div class="score-lockup">
        <strong>${item.confidence}%</strong>
        <span>confidence</span>
      </div>
    </div>

    <div class="status-line">
      <span class="status ${statusClass(item)}">${decision ? decision.action : item.proposal}</span>
    </div>

    <div class="compare-grid">
      <article class="record-card">
        <h4>${item.source.system}</h4>
        ${renderFieldRows(item.source, item.target)}
      </article>
      <article class="record-card">
        <h4>${item.target.system}</h4>
        ${renderFieldRows(item.target, item.source)}
      </article>
    </div>

    <div class="case-rationale">
      <strong>Recommendation rationale</strong>
      <p>${item.rationale}</p>
    </div>

    <div class="evidence-list">
      ${item.evidence.map((evidence) => `<span class="badge">${evidence}</span>`).join("")}
    </div>

    <div class="decision-actions">
      <button class="button primary" type="button" data-decision="${actionLabel}">
        <i data-lucide="check"></i>
        ${actionLabel}
      </button>
      <button class="button danger" type="button" data-decision="Reject match">
        <i data-lucide="x"></i>
        Reject
      </button>
      <button class="button escalate" type="button" data-decision="Escalate">
        <i data-lucide="flag"></i>
        Escalate
      </button>
    </div>
  `;
}

function recordDecision(action) {
  const item = selectedCase();
  const timestamp = new Date().toISOString();
  const decision = {
    action,
    reviewer: reviewerName,
    timestamp,
    rationale: item.rationale,
  };

  item.decision = decision;
  state.audit.unshift({
    id: item.id,
    domain: item.domain,
    action,
    reviewer: reviewerName,
    timestamp,
    rationale: item.rationale,
  });

  saveState();
  renderAll();
  showToast(`${action} recorded for ${item.id}`);
}

function renderIntegrations() {
  document.querySelector("#integrationGrid").innerHTML = integrations
    .map(
      (item) => `
        <article class="integration-card">
          <div class="integration-head">
            <span class="integration-icon"><i data-lucide="${item.icon}"></i></span>
            <div>
              <h3>${item.name}</h3>
              <span class="status review">${item.state}</span>
            </div>
          </div>
          <p>${item.text}</p>
          <ul>
            ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderApiSnippet() {
  const item = selectedCase();
  const decision = item.decision?.action || "Accept match";
  const timestamp = item.decision?.timestamp || new Date().toISOString();
  const snippet = `POST https://graph.microsoft.com/v1.0/sites/{site-id}/lists/{audit-list-id}/items
Authorization: Bearer {entra-token}
Content-Type: application/json

{
  "fields": {
    "Title": "${item.id}",
    "Domain": "${item.domain}",
    "SourceSystem": "${item.source.system}",
    "TargetSystem": "${item.target.system}",
    "Recommendation": "${item.proposal}",
    "Confidence": ${item.confidence},
    "Decision": "${decision}",
    "Reviewer": "${reviewerName}",
    "DecisionTimestamp": "${timestamp}",
    "Rationale": "${item.rationale}"
  }
}`;

  document.querySelector("#apiSnippet").textContent = snippet;
}

function renderCharts() {
  const metrics = getMetrics();
  const coverage = metrics.coverage;
  const donut = document.querySelector("#donutChart");
  donut.style.setProperty("--coverage", `${coverage * 3.6}deg`);
  donut.dataset.label = `${coverage}%`;

  document.querySelector("#chartCopy").innerHTML = `
    <strong>${coverage}% decision coverage</strong>
    <p>${metrics.decided} of ${cases.length} demo exceptions have complete reviewer decisions. ${state.graphEvents} Graph routing event${state.graphEvents === 1 ? "" : "s"} simulated.</p>
  `;

  const categories = domains()
    .filter((domain) => domain !== "All")
    .map((domain) => {
      const count = cases.filter((item) => item.domain === domain).length;
      return { domain, count, percent: Math.round((count / cases.length) * 100) };
    });

  const colors = {
    Identity: "var(--microsoft-blue)",
    Course: "var(--teal)",
    Term: "var(--violet)",
    Transaction: "var(--red)",
  };

  document.querySelector("#barStack").innerHTML = categories
    .map(
      (item) => `
        <div class="bar-row">
          <span>${item.domain}</span>
          <span class="bar-track"><span style="--width: ${item.percent}%; --bar-color: ${colors[item.domain]}"></span></span>
          <span>${item.count}</span>
        </div>
      `
    )
    .join("");
}

function renderStory() {
  const cards = roleStories[state.role];
  document.querySelectorAll("#roleTabs button").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.role === state.role));
  });

  document.querySelector("#storyGrid").innerHTML = cards
    .map(
      (card) => `
        <article class="story-card">
          <h3>${card.title}</h3>
          <p>${card.body}</p>
          <strong>${card.kicker}</strong>
          <p>${card.kickerBody}</p>
        </article>
      `
    )
    .join("");
}

function renderAudit() {
  const table = document.querySelector("#auditTable");
  if (!state.audit.length) {
    table.innerHTML = `
      <tr>
        <td colspan="5">
          <span class="audit-empty"><i data-lucide="file-clock"></i>No reviewer decisions recorded yet.</span>
        </td>
      </tr>
    `;
    return;
  }

  table.innerHTML = state.audit
    .map(
      (entry) => `
        <tr>
          <td>${new Date(entry.timestamp).toLocaleString()}</td>
          <td><strong>${entry.id}</strong><br>${entry.domain}</td>
          <td>${entry.action}</td>
          <td>${entry.reviewer}</td>
          <td>${entry.rationale}</td>
        </tr>
      `
    )
    .join("");
}

function renderAll() {
  document.querySelector("#thresholdInput").value = state.threshold;
  document.querySelector("#thresholdValue").value = `${state.threshold}%`;
  document.querySelector("#thresholdValue").textContent = `${state.threshold}%`;
  renderMetrics();
  renderPipeline();
  renderControls();
  renderDomainFilters();
  renderQueue();
  renderCaseDetail();
  renderIntegrations();
  renderApiSnippet();
  renderCharts();
  renderStory();
  renderAudit();
  refreshIcons();
}

function exportCsv() {
  const headers = ["timestamp", "record_id", "domain", "decision", "reviewer", "rationale"];
  const rows = state.audit.map((entry) =>
    [entry.timestamp, entry.id, entry.domain, entry.action, entry.reviewer, entry.rationale]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "iavva-highered-audit-demo.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Audit CSV prepared");
}

function simulateAiPass() {
  const threshold = state.threshold;
  const ready = cases.filter((item) => !item.decision && item.aiNeeded && item.confidence >= threshold);
  if (!ready.length) {
    showToast("No unresolved AI residuals exceed the current threshold");
    return;
  }

  ready.forEach((item) => {
    const action = item.proposal === "Reject match" ? "Reject match" : item.proposal === "Accept mapping" ? "Accept mapping" : "Accept match";
    const timestamp = new Date().toISOString();
    item.decision = {
      action,
      reviewer: "Auto-clear policy preview",
      timestamp,
      rationale: item.rationale,
    };
    state.audit.unshift({
      id: item.id,
      domain: item.domain,
      action,
      reviewer: "Auto-clear policy preview",
      timestamp,
      rationale: item.rationale,
    });
  });

  saveState();
  renderAll();
  showToast(`${ready.length} high-confidence residual case${ready.length === 1 ? "" : "s"} cleared in preview`);
}

function simulateGraphRouting() {
  state.graphEvents += 1;
  const item = selectedCase();
  const timestamp = new Date().toISOString();
  state.audit.unshift({
    id: item.id,
    domain: item.domain,
    action: "Teams task routed",
    reviewer: "Microsoft Graph preview",
    timestamp,
    rationale: `Exception routed to ${item.owner} queue with SharePoint audit payload prepared.`,
  });

  saveState();
  renderAll();
  showToast(`Graph routing simulated for ${item.owner}`);
}

function resetDemo() {
  cases.forEach((item) => {
    delete item.decision;
  });
  state.audit = [];
  state.graphEvents = 0;
  state.selectedId = cases[0].id;
  localStorage.removeItem("iavva-highered-mvp");
  renderAll();
  showToast("Demo state reset");
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const queueButton = event.target.closest(".queue-item");
    if (queueButton) {
      state.selectedId = queueButton.dataset.id;
      renderQueue();
      renderCaseDetail();
      renderApiSnippet();
      refreshIcons();
      return;
    }

    const filterButton = event.target.closest("#domainFilters button");
    if (filterButton) {
      state.domain = filterButton.dataset.domain;
      renderDomainFilters();
      renderQueue();
      renderCaseDetail();
      refreshIcons();
      return;
    }

    const roleButton = event.target.closest("#roleTabs button");
    if (roleButton) {
      state.role = roleButton.dataset.role;
      renderStory();
      return;
    }

    const decisionButton = event.target.closest("[data-decision]");
    if (decisionButton) {
      recordDecision(decisionButton.dataset.decision);
    }
  });

  document.querySelector("#searchInput").addEventListener("input", () => {
    renderQueue();
    renderCaseDetail();
    refreshIcons();
  });

  document.querySelector("#thresholdInput").addEventListener("input", (event) => {
    state.threshold = Number(event.target.value);
    saveState();
    renderAll();
  });

  document.querySelector("#exportButton").addEventListener("click", exportCsv);
  document.querySelector("#aiPassButton").addEventListener("click", simulateAiPass);
  document.querySelector("#graphButton").addEventListener("click", simulateGraphRouting);
  document.querySelector("#resetButton").addEventListener("click", resetDemo);
  document.querySelector("#contrastButton").addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.toggle("active", link.dataset.nav === entry.target.id);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );

  document.querySelectorAll("main > section").forEach((section) => observer.observe(section));
}

loadState();
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  bindEvents();
});
