# HR1 architecture artifacts

`hr1-workbench.dsl` is the architecture-as-code source for the HR1 integration workbench. It uses Structurizr DSL and provides:

- a system-context view for CIO and business stakeholders;
- a container view showing API management, orchestration, rules, AI assistance, human review, SharePoint workflow, and reporting;
- three dynamic views showing the technical sequence for student record disputes, course-access/refund review, and recruiter triage;
- an illustrative revenue-cycle denial-management dynamic view using EHR/patient accounting, payer eligibility, clearinghouse, SharePoint, Teams, and an authorized RCM owner;
- an illustrative Azure deployment view.

The PeopleSoft, Banner, LMS, CRM, and Azure SQL integrations are labeled illustrative because the public prototype does not claim access to an institution's production systems. The model deliberately routes them through approved APIs and validation; it does not show direct PeopleSoft/Banner writes to SharePoint. Source systems remain authoritative.

Open the file in [Structurizr](https://structurizr.com/) or the Structurizr CLI to render PNG, SVG, or a workspace view.

In Structurizr, import the DSL file as a workspace and select these views:

1. **HR1 - Governed enterprise integration system context** for the executive relationship map.
2. **HR1 - Rules-first reconciliation and accountable decision workflow** for the component-level technical view.
3. **HR1 - Student record dispute dynamic flow**, **HR1 - Online course access and refund dynamic flow**, or **HR1 - Recruiter candidate triage dynamic flow** to walk through the numbered integration steps.
4. **HR1 - Illustrative revenue-cycle denial management flow** for the healthcare RCM example requested in the architecture discussion.

The RCM view is a portfolio/architecture example, not a claim that HR1 has production access to a healthcare organization, patient data, EHR, payer, or claims clearinghouse. Any real deployment would require customer-approved interfaces, HIPAA/security review, contracts, data-minimization controls, and a named operational owner.
