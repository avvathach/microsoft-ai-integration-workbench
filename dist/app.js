const baseMetrics = {
  processed: 12840,
  deterministic: 9360,
  aiResidual: 1420,
  baselineHoursPerThousand: 42,
};

const reviewerName = "A. Thach (demo)";
const storageKey = "iavva-ai-integration-prototype";
const legacyStorageKey = "iavva-highered-mvp";

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

const controls = [
  { title: "Microsoft Entra ID", text: "Identity and authenticated access" },
  { title: "Role-Based Access Control", text: "Named reviewer, auditor and administrator roles" },
  { title: "Least Privilege", text: "Only the access each role and integration requires" },
  { title: "Azure Key Vault", text: "Protected secrets and integration credentials" },
  { title: "FERPA + privacy controls", text: "Purpose, access, retention and disclosure safeguards" },
  { title: "Audit logging", text: "Recommendation, reviewer, rationale and timestamp" },
  { title: "Azure Monitor / Application Insights", text: "Health, performance and exception telemetry" },
  { title: "Microsoft Sentinel", text: "Security monitoring where appropriate" },
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
    text: "Supports Microsoft 365 context, routing and approved workflow events, not SIS writeback.",
    bullets: ["Create Teams notifications", "Write SharePoint audit items", "Use least-privilege app permissions"],
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
    name: "Azure AI",
    state: "Exception assistance",
    text: "AI proposes matches only after deterministic logic cannot clear them.",
    bullets: ["Confidence and rationale", "No independent record changes", "Evaluation before production thresholds"],
  },
  {
    icon: "pie-chart",
    name: "Power BI or Fabric",
    state: "Executive dashboard",
    text: "Shows throughput, exception categories, queue age, and audit coverage.",
    bullets: ["Embedded report path", "Business-ready measures", "Operational owner slices"],
  },
];

const sourceSystems = [
  {
    id: "peoplesoft",
    icon: "landmark",
    name: "PeopleSoft",
    type: "Student information system",
    location: "Example on-premises data center",
    method: "Supported REST / integration API",
    data: "Student, program and term records",
    records: 12840,
    initialAge: 8,
    health: "Healthy",
  },
  {
    id: "banner",
    icon: "graduation-cap",
    name: "Banner",
    type: "Student information system",
    location: "Example vendor-hosted cloud",
    method: "Supported integration API",
    data: "Student, course and registration records",
    records: 12612,
    initialAge: 14,
    health: "Healthy",
  },
  {
    id: "lms",
    icon: "book-open-check",
    name: "Learning Management System",
    type: "Learning platform",
    location: "Example SaaS environment",
    method: "REST API",
    data: "Courses, sections and enrollment activity",
    records: 3824,
    initialAge: 21,
    health: "Healthy",
  },
  {
    id: "sharepoint",
    icon: "files",
    name: "SharePoint",
    type: "Microsoft 365 content",
    location: "Example Microsoft 365 tenant",
    method: "Microsoft Graph",
    data: "Review documents and decision records",
    records: 486,
    initialAge: 5,
    health: "Healthy",
  },
  {
    id: "crm",
    icon: "contact-round",
    name: "CRM",
    type: "Relationship management",
    location: "Example enterprise cloud",
    method: "Dataverse / supported API",
    data: "Contacts, cases and engagement history",
    records: 7461,
    initialAge: 34,
    health: "Review",
  },
  {
    id: "azure-sql",
    icon: "database-zap",
    name: "Azure SQL",
    type: "Curated integration data",
    location: "Example Azure subscription",
    method: "Private endpoint / SQL connector",
    data: "Crosswalks, normalized values and metrics",
    records: 19210,
    initialAge: 11,
    health: "Healthy",
  },
  {
    id: "github-live",
    icon: "github",
    name: "GitHub delivery telemetry",
    type: "Live public connector",
    location: "github.com/avvathach/microsoft-ai-integration-workbench",
    method: "GitHub REST API",
    data: "Branch, commit, release and repository status",
    records: 0,
    initialAge: 0,
    health: "Connecting",
    live: true,
    liveStatus: "Connecting",
  },
];

const sourceEventMessages = [
  "Student records validated",
  "Course mappings refreshed",
  "Enrollment changes received",
  "Review documents synchronized",
  "Contact records normalized",
  "Cross-system metrics updated",
  "Deployment telemetry received",
];

const sourceMonitor = {
  running: true,
  tick: 0,
  events: [],
};

const m365State = {
  tenantId: sessionStorage.getItem("iavva-m365-tenant") || "",
  clientId: sessionStorage.getItem("iavva-m365-client") || "",
  account: null,
  token: null,
  pca: null,
  connected: false,
};

const useCaseDemos = [
  {
    id: "student-dispute",
    icon: "graduation-cap",
    title: "Student record dispute",
    trigger: "A former student requests a historical refund review.",
    sources: "SIS, LMS, bookstore, payment, support history",
    owner: "Student Accounts administrator",
    decision: "Evidence packet ready for authorized review",
    benefit: "Faster, defensible answers for students and fewer unresolved historical disputes for staff.",
    controls: "FERPA purpose limitation, role-based access, retention rules, refund policy approval, complete audit trail",
    inputLabel: "Evidence condition",
    inputOptions: ["Complete payment and enrollment trail", "Conflicting student IDs", "Missing historical bookstore record"],
    steps: ["Collect linked records", "Normalize student and transaction IDs", "Flag missing or conflicting evidence", "Route case to Student Accounts", "Write audit record"],
  },
  {
    id: "course-refund",
    icon: "book-open-check",
    title: "Online course access and refund",
    trigger: "A student reports they could not enter a paid online class.",
    sources: "SIS enrollment, LMS access, payment, bookstore, help desk",
    owner: "Department chair",
    decision: "Chair review required before any remedy",
    benefit: "A chair can make a fair, evidence-based decision without reconstructing the case across six systems.",
    controls: "FERPA, accessibility, policy deadline checks, least privilege, appeal path, and human approval",
    inputLabel: "Reported access condition",
    inputOptions: ["LMS access confirmed", "No LMS access found", "Access disputed by student"],
    steps: ["Build dated access timeline", "Compare enrollment and payment rules", "Summarize login and support gaps", "Route case to the chair", "Record rationale and appeal path"],
  },
  {
    id: "recruiter-triage",
    icon: "user-search",
    title: "Recruiter candidate triage",
    trigger: "A new application arrives for an urgent vacancy.",
    sources: "Applicant system, resume, transcript, job requirements",
    owner: "Internal recruiter and hiring manager",
    decision: "Recruiter decides who advances",
    benefit: "Shorter time to qualified review while preserving recruiter judgment and candidate fairness.",
    controls: "EEOC and ADA review, no protected-class scoring, explainable evidence, retention limits, recruiter approval",
    inputLabel: "Candidate evidence",
    inputOptions: ["Requirements clearly met", "Relevant experience partially documented", "Insufficient evidence to advance"],
    steps: ["Extract role requirements", "Check deterministic evidence", "Summarize relevant experience", "Hold unclear cases for human review", "Record routing and review reason"],
  },
];

const useCaseDemoState = useCaseDemos.reduce((acc, item) => {
  acc[item.id] = { running: false, step: 0, events: [], timer: null };
  return acc;
}, {});

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
  threshold: 92,
  audit: [],
  graphEvents: 0,
};

function loadState() {
  const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
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
    localStorage.removeItem(storageKey);
    localStorage.removeItem(legacyStorageKey);
  }
}

function saveState() {
  const decisions = cases.reduce((acc, item) => {
    if (item.decision) acc[item.id] = item.decision;
    return acc;
  }, {});

  localStorage.setItem(
    storageKey,
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
      label: "Projected hours saved",
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

function renderControls() {
  document.querySelector("#controlList").innerHTML = controls
    .map(
      (control) => `
        <article class="control-item">
          <i data-lucide="check"></i>
          <div>
          <h3>${control.title}</h3>
          <p>${control.text}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function initializeSourceMonitor() {
  const now = Date.now();
  sourceSystems.forEach((source) => {
    source.updatedAt = now - source.initialAge * 1000;
  });

  sourceMonitor.events = sourceSystems.slice(0, 5).map((source, index) => ({
    source: source.name,
    message: sourceEventMessages[index],
    rows: 8 + index * 7,
    timestamp: now - (index + 1) * 18000,
  }));
}

function sourceFreshness(source) {
  const seconds = Math.max(0, Math.floor((Date.now() - source.updatedAt) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

function renderSourceClock() {
  const clock = document.querySelector("#sourceClock");
  if (!clock) return;
  clock.textContent = `Demo clock ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}

function renderSourceDashboard() {
  const grid = document.querySelector("#sourceGrid");
  const metrics = document.querySelector("#sourceMetrics");
  const feed = document.querySelector("#activityFeed");
  if (!grid || !metrics || !feed) return;

  const totalRecords = sourceSystems.reduce((sum, source) => sum + source.records, 0);
  const healthySources = sourceSystems.filter((source) => ["Healthy", "Live"].includes(source.health)).length;
  const liveSources = sourceSystems.filter((source) => source.live && source.health === "Live").length;
  const illustrativeSources = sourceSystems.length - liveSources;
  const averageAge = Math.round(
    sourceSystems.reduce((sum, source) => sum + (Date.now() - source.updatedAt) / 1000, 0) / sourceSystems.length
  );

  metrics.innerHTML = `
    <article><span>Sources monitored</span><strong>${sourceSystems.length}</strong><small>Across enterprise and Microsoft platforms</small></article>
    <article><span>Connections healthy</span><strong>${healthySources}/${sourceSystems.length}</strong><small>${liveSources} live connector, ${illustrativeSources} illustrative sources</small></article>
    <article><span>Records observed</span><strong>${formatNumber(totalRecords)}</strong><small>Live telemetry plus illustrative volume</small></article>
    <article><span>Average freshness</span><strong>${averageAge}s</strong><small>Live connector polls every 30 seconds</small></article>
  `;

  grid.innerHTML = sourceSystems
    .map(
      (source) => `
        <article class="source-card" data-source-id="${source.id}">
          <div class="source-card-head">
            <span class="source-icon"><i data-lucide="${source.icon}"></i></span>
            <div><h4>${source.name}</h4><span>${source.type}</span></div>
            <span class="source-health ${["Healthy", "Live"].includes(source.health) ? "healthy" : "review"}">${source.health}</span>
          </div>
          <dl>
            <div><dt>Example location</dt><dd>${source.location}</dd></div>
            <div><dt>Connection</dt><dd>${source.method}</dd></div>
            <div><dt>Data</dt><dd>${source.data}</dd></div>
          </dl>
          <div class="source-card-foot"><span>${formatNumber(source.records)} ${source.live ? "events observed" : "records"}</span><time>${sourceFreshness(source)}</time></div>
        </article>
      `
    )
    .join("");

  feed.innerHTML = sourceMonitor.events
    .map(
      (event) => `
        <article class="activity-event">
          <span class="activity-pulse" aria-hidden="true"></span>
          <div><strong>${event.source}</strong><p>${event.message}</p></div>
          <div class="activity-meta"><span>${event.rows} rows</span><time>${new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time></div>
        </article>
      `
    )
    .join("");

  document.querySelector("#activityCount").textContent = sourceMonitor.events.length;
  renderSourceClock();
}

function renderUseCaseDemos() {
  const target = document.querySelector("#useCaseDemoGrid");
  if (!target) return;
  target.innerHTML = useCaseDemos.map((demo) => {
    const run = useCaseDemoState[demo.id];
    const current = run.events.length ? run.events[run.events.length - 1] : "Ready to run";
    const progress = run.running ? Math.min(100, Math.round((run.step / demo.steps.length) * 100)) : run.step >= demo.steps.length ? 100 : 0;
    const selectedInput = run.input || demo.inputOptions[0];
    return `
      <article class="case-demo-card" data-demo-id="${demo.id}">
        <div class="case-demo-head"><span class="use-case-icon"><i data-lucide="${demo.icon}"></i></span><div><p class="eyebrow">Live scenario</p><h4>${demo.title}</h4></div><span class="status ${run.running ? "review" : run.step >= demo.steps.length ? "good" : "warn"}">${run.running ? "Running" : run.step >= demo.steps.length ? "Complete" : "Ready"}</span></div>
        <p class="case-demo-trigger"><strong>Trigger:</strong> ${demo.trigger}</p>
        <dl class="case-demo-details"><div><dt>Evidence</dt><dd>${demo.sources}</dd></div><div><dt>Decision owner</dt><dd>${demo.owner}</dd></div></dl>
        <label class="case-demo-input"><span>${demo.inputLabel}</span><select data-use-case-input="${demo.id}">${demo.inputOptions.map((option) => `<option ${option === selectedInput ? "selected" : ""}>${option}</option>`).join("")}</select></label>
        <div class="case-demo-progress" aria-label="${progress}% complete"><span style="width: ${progress}%"></span></div>
        <div class="case-demo-current" aria-live="polite"><i data-lucide="activity"></i><span>${current}</span></div>
        <ol class="case-demo-events">${demo.steps.map((step, index) => `<li class="${index < run.step ? "done" : index === run.step && run.running ? "active" : ""}"><span>${index + 1}</span><div>${step}</div></li>`).join("")}</ol>
        <div class="case-demo-result"><strong>Expected outcome</strong><span>${demo.decision}</span><small>Selected condition: ${selectedInput}</small></div>
        <button class="button primary compact" type="button" data-run-use-case="${demo.id}" ${run.running ? "disabled" : ""}><i data-lucide="${run.step >= demo.steps.length ? "rotate-ccw" : "play"}"></i>${run.step >= demo.steps.length ? "Run again" : "Run live demo"}</button>
      </article>
    `;
  }).join("");
  refreshIcons();
}

function renderUseCasePages() {
  const target = document.querySelector("#useCasePages");
  if (!target) return;
  target.innerHTML = useCaseDemos.map((demo, index) => {
    const run = useCaseDemoState[demo.id];
    const selectedInput = run.input || demo.inputOptions[0];
    const current = run.events.length ? run.events[run.events.length - 1] : "Ready to run";
    const progress = run.running ? Math.min(100, Math.round((run.step / demo.steps.length) * 100)) : run.step >= demo.steps.length ? 100 : 0;
    return `
      <article class="use-case-page" id="use-case-${index + 1}" aria-labelledby="useCasePageTitle${index + 1}">
        <div class="use-case-page-heading"><div><p class="eyebrow">Dedicated use case page ${index + 1}</p><h3 id="useCasePageTitle${index + 1}">${demo.title}</h3></div><span class="status ${run.running ? "review" : run.step >= demo.steps.length ? "good" : "warn"}">${run.running ? "Running" : run.step >= demo.steps.length ? "Complete" : "Ready"}</span></div>
        <div class="use-case-page-grid">
          <div class="use-case-page-copy">
            <div class="page-fact"><strong>Pain point</strong><p>${demo.trigger} The organization must make a defensible decision even when records are incomplete, inconsistent, or spread across systems.</p></div>
            <div class="page-fact"><strong>Persona</strong><p>${demo.owner}. This person owns the decision and remains accountable for the outcome.</p></div>
            <div class="page-fact"><strong>Systems and evidence</strong><p>${demo.sources}. The source systems remain authoritative.</p></div>
            <div class="page-fact"><strong>Solution</strong><p>Apply deterministic validation first, use AI only to summarize unresolved ambiguity, route the case to the named owner, and record the rationale.</p></div>
            <div class="page-fact benefit-fact"><strong>Business benefit</strong><p>${demo.benefit}</p></div>
            <div class="page-fact"><strong>Controls</strong><p>${demo.controls}.</p></div>
          </div>
          <div class="use-case-page-demo">
            <div class="page-demo-label"><i data-lucide="radio"></i><span>Touch-and-run demo</span></div>
            <label class="case-demo-input"><span>${demo.inputLabel}</span><select data-use-case-input="${demo.id}">${demo.inputOptions.map((option) => `<option ${option === selectedInput ? "selected" : ""}>${option}</option>`).join("")}</select></label>
            <div class="case-demo-progress" aria-label="${progress}% complete"><span style="width: ${progress}%"></span></div>
            <div class="case-demo-current" aria-live="polite"><i data-lucide="activity"></i><span>${current}</span></div>
            <ol class="case-demo-events">${demo.steps.map((step, stepIndex) => `<li class="${stepIndex < run.step ? "done" : stepIndex === run.step && run.running ? "active" : ""}"><span>${stepIndex + 1}</span><div>${step}</div></li>`).join("")}</ol>
            <div class="case-demo-result"><strong>Decision boundary</strong><span>${demo.decision}</span><small>Selected condition: ${selectedInput}</small></div>
            <button class="button primary" type="button" data-run-use-case="${demo.id}" ${run.running ? "disabled" : ""}><i data-lucide="${run.step >= demo.steps.length ? "rotate-ccw" : "play"}"></i>${run.step >= demo.steps.length ? "Run again" : "Run live demo"}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
  refreshIcons();
}

function runUseCaseDemo(id) {
  const demo = useCaseDemos.find((item) => item.id === id);
  const run = useCaseDemoState[id];
  if (!demo || !run) return;
  if (run.timer) window.clearInterval(run.timer);
  run.running = true;
  run.step = 0;
  run.events = [`Workflow started: ${run.input || demo.inputOptions[0]}`];
  renderUseCaseDemos();
  renderUseCasePages();
  renderUseCasePages();
  run.timer = window.setInterval(() => {
    if (run.step >= demo.steps.length) {
      window.clearInterval(run.timer);
      run.timer = null;
      run.running = false;
      run.events.push(`Complete: ${demo.decision}`);
      renderUseCaseDemos();
      renderUseCasePages();
      showToast(`${demo.title} demo complete`);
      return;
    }
    run.events.push(demo.steps[run.step]);
    run.step += 1;
    renderUseCaseDemos();
    renderUseCasePages();
  }, 850);
}

function renderM365Status(message = "Not connected", connected = false) {
  const status = document.querySelector("#m365Status");
  const button = document.querySelector("#refreshMicrosoftButton");
  if (!status) return;
  status.textContent = message;
  status.className = `status ${connected ? "good" : "warn"}`;
  if (button) button.disabled = !connected;
}

function renderM365Data(cards = []) {
  const target = document.querySelector("#m365LiveData");
  if (!target) return;
  target.innerHTML = cards.length
    ? cards.map((card) => `<article class="tenant-live-card"><span>${card.label}</span><strong>${card.value}</strong></article>`).join("")
    : '<div class="tenant-empty"><i data-lucide="plug-zap"></i><span>Enter your tenant and application IDs to connect.</span></div>';
  refreshIcons();
}

function getM365Config() {
  const tenantId = document.querySelector("#tenantInput")?.value.trim() || m365State.tenantId;
  const clientId = document.querySelector("#clientInput")?.value.trim() || m365State.clientId;
  if (!tenantId || !clientId) throw new Error("Enter the tenant ID and client ID first");
  m365State.tenantId = tenantId;
  m365State.clientId = clientId;
  sessionStorage.setItem("iavva-m365-tenant", tenantId);
  sessionStorage.setItem("iavva-m365-client", clientId);
  return { tenantId, clientId };
}

async function createMsalClient() {
  if (!window.msal) throw new Error("Microsoft sign-in library is still loading. Try again in a moment.");
  const { tenantId, clientId } = getM365Config();
  m365State.pca = new window.msal.PublicClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: window.location.origin + "/",
    },
    cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false },
  });
  if (typeof m365State.pca.initialize === "function") await m365State.pca.initialize();
  return m365State.pca;
}

async function graphGet(path) {
  const response = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    headers: { Authorization: `Bearer ${m365State.token}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Microsoft Graph returned ${response.status}`);
  return response.json();
}

async function refreshMicrosoftData() {
  if (!m365State.pca || !m365State.account) throw new Error("Sign in to Microsoft first");
  const result = await m365State.pca.acquireTokenSilent({
    account: m365State.account,
    scopes: ["User.Read", "Files.Read"],
  });
  m365State.token = result.accessToken;
  const [profile, drive] = await Promise.all([
    graphGet("/me?$select=displayName,userPrincipalName,jobTitle"),
    graphGet("/me/drive/root/children?$top=8&$select=name,lastModifiedDateTime,size,file,folder"),
  ]);
  const files = Array.isArray(drive.value) ? drive.value : [];
  renderM365Status("Live tenant data", true);
  renderM365Data([
    { label: "Signed-in account", value: profile.userPrincipalName || profile.displayName || "Microsoft user" },
    { label: "Microsoft Graph profile", value: profile.jobTitle || "Authenticated" },
    { label: "OneDrive items observed", value: `${files.length} recent items` },
    { label: "Last Graph refresh", value: new Date().toLocaleTimeString() },
    { label: "Access model", value: "Delegated, read only" },
    { label: "SIS writeback", value: "Disabled" },
  ]);
  showToast("Microsoft Graph data refreshed");
}

async function connectMicrosoft() {
  try {
    renderM365Status("Signing in", false);
    const pca = await createMsalClient();
    const login = await pca.loginPopup({ scopes: ["User.Read", "Files.Read"] });
    m365State.account = login.account;
    m365State.connected = true;
    await refreshMicrosoftData();
  } catch (error) {
    m365State.connected = false;
    renderM365Status("Connection needs attention", false);
    showToast(error.message || "Microsoft sign-in failed");
  }
}

async function pollLiveConnectors() {
  const source = sourceSystems.find((item) => item.id === "github-live");
  if (!source) return;

  try {
    const response = await fetch("https://api.github.com/repos/avvathach/microsoft-ai-integration-workbench", {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const repo = await response.json();
    source.health = "Live";
    source.liveStatus = "Live";
    source.records = Number(repo.open_issues_count || 0) + Number(repo.watchers_count || 0);
    source.updatedAt = Date.now();
    source.location = `github.com/${repo.full_name}`;
    source.data = `Default branch ${repo.default_branch}; pushed ${new Date(repo.pushed_at).toLocaleString()}`;
    sourceMonitor.events.unshift({
      source: source.name,
      message: `Repository status received: ${repo.default_branch} is current`,
      rows: source.records,
      timestamp: Date.now(),
    });
    sourceMonitor.events = sourceMonitor.events.slice(0, 7);
  } catch (error) {
    source.health = "Review";
    source.liveStatus = "Unavailable";
    sourceMonitor.events.unshift({
      source: source.name,
      message: `Live check unavailable: ${error.message}`,
      rows: 0,
      timestamp: Date.now(),
    });
    sourceMonitor.events = sourceMonitor.events.slice(0, 7);
  }
  renderSourceDashboard();
  refreshIcons();
}

function updateSourceMonitor(refreshAll = false) {
  const now = Date.now();
  if (refreshAll) {
    sourceSystems.forEach((source) => {
      source.updatedAt = now;
    });
    sourceMonitor.events.unshift({ source: "All sources", message: "Manual source check completed", rows: sourceSystems.length, timestamp: now });
  } else {
    const index = sourceMonitor.tick % sourceSystems.length;
    const source = sourceSystems[index];
    const rows = 4 + ((sourceMonitor.tick * 7) % 31);
    source.records += rows;
    source.updatedAt = now;
    sourceMonitor.events.unshift({ source: source.name, message: sourceEventMessages[index], rows, timestamp: now });
    sourceMonitor.tick += 1;
  }

  sourceMonitor.events = sourceMonitor.events.slice(0, 7);
  renderSourceDashboard();
  refreshIcons();
}

function toggleSourceMonitor() {
  sourceMonitor.running = !sourceMonitor.running;
  const button = document.querySelector("#liveToggleButton");
  button.setAttribute("aria-pressed", String(!sourceMonitor.running));
  button.innerHTML = sourceMonitor.running
    ? '<i data-lucide="pause"></i>Pause live demo'
    : '<i data-lucide="play"></i>Resume live demo';
  refreshIcons();
  showToast(sourceMonitor.running ? "Simulated live updates resumed" : "Simulated live updates paused");
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
  renderSourceDashboard();
  renderUseCaseDemos();
  renderControls();
  renderDomainFilters();
  renderQueue();
  renderCaseDetail();
  renderIntegrations();
  renderApiSnippet();
  renderCharts();
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
  showToast(`${ready.length} recommendation${ready.length === 1 ? "" : "s"} ready for human review; no records changed`);
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
  localStorage.removeItem(storageKey);
  localStorage.removeItem(legacyStorageKey);
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
  document.querySelector("#aiPassButton")?.addEventListener("click", simulateAiPass);
  document.querySelector("#graphButton").addEventListener("click", simulateGraphRouting);
  document.querySelector("#resetButton").addEventListener("click", resetDemo);
  document.querySelector("#connectMicrosoftButton")?.addEventListener("click", connectMicrosoft);
  document.querySelector("#refreshMicrosoftButton")?.addEventListener("click", async () => {
    try {
      await refreshMicrosoftData();
    } catch (error) {
      showToast(error.message || "Microsoft Graph refresh failed");
    }
  });
  document.querySelector("#useCaseDemoGrid")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-run-use-case]");
    if (button) runUseCaseDemo(button.dataset.runUseCase);
  });
  document.querySelector("#useCasePages")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-run-use-case]");
    if (button) runUseCaseDemo(button.dataset.runUseCase);
  });
  document.querySelector("#useCasePages")?.addEventListener("change", (event) => {
    const select = event.target.closest("[data-use-case-input]");
    if (!select) return;
    useCaseDemoState[select.dataset.useCaseInput].input = select.value;
    renderUseCaseDemos();
    renderUseCasePages();
  });
  document.querySelector("#useCaseDemoGrid")?.addEventListener("change", (event) => {
    const select = event.target.closest("[data-use-case-input]");
    if (!select) return;
    useCaseDemoState[select.dataset.useCaseInput].input = select.value;
  });
  document.querySelector("#sourceRefreshButton")?.addEventListener("click", () => {
    updateSourceMonitor(true);
    showToast("All simulated sources refreshed");
  });
  document.querySelector("#liveToggleButton")?.addEventListener("click", toggleSourceMonitor);
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
  initializeSourceMonitor();
  renderAll();
  bindEvents();
  const tenantInput = document.querySelector("#tenantInput");
  const clientInput = document.querySelector("#clientInput");
  if (tenantInput) tenantInput.value = m365State.tenantId;
  if (clientInput) clientInput.value = m365State.clientId;
  renderM365Status("Not connected", false);
  renderM365Data();
  pollLiveConnectors();
  window.setInterval(() => {
    if (sourceMonitor.running) updateSourceMonitor();
    else renderSourceClock();
  }, 3000);
  window.setInterval(pollLiveConnectors, 30000);
});
