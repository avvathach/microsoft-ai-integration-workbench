const SYNTHETIC_CASES = {
  "SYN-ID-001": {
    id: "SYN-ID-001",
    title: "Identity reconciliation",
    owner: "Registrar",
    priority: "High",
    description: "Two synthetic records may represent the same learner, but the identifiers and program labels differ.",
    source: {
      recordId: "LEGACY-SYN-104883",
      name: "Synthetic Learner A",
      birthDate: "2004-02-14",
      phone: "713-555-0194",
      program: "AAS Nursing",
    },
    target: {
      recordId: "TARGET-SYN-88213",
      name: "Synthetic Learner A.",
      birthDate: "2004-02-14",
      phone: "(713) 555-0194",
      program: "Associate Nursing",
    },
    criticalFields: ["birthDate", "phone"],
    policy: [
      "Use synthetic evidence only.",
      "AI may recommend but cannot update a system of record.",
      "An authorized registrar must approve identity resolution.",
    ],
  },
  "SYN-TXN-002": {
    id: "SYN-TXN-002",
    title: "Payment exception",
    owner: "Student Accounts",
    priority: "High",
    description: "A synthetic payment and waiver share an amount but disagree on reference, date, and transaction type.",
    source: {
      recordId: "PAY-SYN-0836",
      amount: "1140.00",
      date: "2026-08-14",
      reference: "PAYMENT-SYN-44",
      type: "Payment",
    },
    target: {
      recordId: "WAIVER-SYN-0836",
      amount: "1140.00",
      date: "2026-08-21",
      reference: "WAIVER-SYN-91",
      type: "Waiver",
    },
    criticalFields: ["reference", "type"],
    policy: [
      "Amount equality alone is not sufficient evidence of a transaction match.",
      "AI may not issue a refund, waiver, or account adjustment.",
      "Student Accounts owns the final decision and rationale.",
    ],
  },
  "SYN-CRS-003": {
    id: "SYN-CRS-003",
    title: "Course mapping",
    owner: "Academic Affairs",
    priority: "Medium",
    description: "Two synthetic catalog entries have similar titles but different course codes and contact-hour models.",
    source: {
      recordId: "CAT-SYN-1013",
      title: "Patient Care Technician I",
      courseCode: "NURA-1013",
      hours: "96",
      award: "Continuing Education",
    },
    target: {
      recordId: "CAT-SYN-1060",
      title: "Patient Care Technician Clinical",
      courseCode: "NURA-1060",
      hours: "64",
      award: "Continuing Education",
    },
    criticalFields: ["courseCode", "hours"],
    policy: [
      "Course-title similarity cannot override a contact-hour mismatch.",
      "AI may summarize catalog evidence but cannot approve equivalency.",
      "Academic Affairs owns the final mapping decision.",
    ],
  },
};

const FIELD_LABELS = {
  recordId: "Record ID",
  name: "Name",
  birthDate: "Birth date",
  phone: "Phone",
  program: "Program",
  amount: "Amount",
  date: "Date",
  reference: "Reference",
  type: "Transaction type",
  title: "Title",
  courseCode: "Course code",
  hours: "Contact hours",
  award: "Award",
};

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function listSyntheticCases() {
  return Object.values(SYNTHETIC_CASES).map(({ id, title, owner, priority, description }) => ({ id, title, owner, priority, description }));
}

function getSyntheticCase(caseId) {
  const record = SYNTHETIC_CASES[caseId];
  return record ? JSON.parse(JSON.stringify(record)) : null;
}

function compareSyntheticCase(caseId) {
  const record = getSyntheticCase(caseId);
  if (!record) return null;
  const fields = Array.from(new Set([...Object.keys(record.source), ...Object.keys(record.target)]));
  const comparisons = fields.map((field) => {
    const sourceValue = record.source[field] ?? "Not provided";
    const targetValue = record.target[field] ?? "Not provided";
    const match = normalize(sourceValue) === normalize(targetValue);
    return {
      evidenceId: `field:${field}`,
      field,
      label: FIELD_LABELS[field] || field,
      sourceValue,
      targetValue,
      status: match ? "match" : "difference",
      critical: record.criticalFields.includes(field),
    };
  });
  const matches = comparisons.filter((item) => item.status === "match").length;
  const criticalDifferences = comparisons.filter((item) => item.critical && item.status === "difference");
  const recommendation = criticalDifferences.length ? "escalate" : "accept_match";
  const confidence = criticalDifferences.length ? Math.max(55, 82 - criticalDifferences.length * 8) : Math.min(96, 72 + matches * 4);
  return {
    caseId,
    comparisons,
    ruleSummary: {
      matches,
      differences: comparisons.length - matches,
      criticalDifferences: criticalDifferences.length,
      recommendation,
      confidence,
    },
  };
}

module.exports = { listSyntheticCases, getSyntheticCase, compareSyntheticCase };
