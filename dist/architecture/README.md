# HR1 architecture artifacts

`hr1-workbench.dsl` is the architecture-as-code source for the HR1 integration workbench. It uses Structurizr DSL and provides:

- a system-context view for CIO and business stakeholders;
- a system-landscape view showing all participating people, platforms, controls, and boundaries;
- a container view showing API management, orchestration, rules, AI assistance, human review, SharePoint workflow, and reporting;
- a component view showing the adapter registry, validator, retry queue, matcher, policy evaluator, evidence guard, exception summarizer, case workspace, decision recorder, and audit writer;
- three dynamic views showing the technical sequence for student record disputes, course-access/refund review, and recruiter triage;
- an illustrative revenue-cycle denial-management dynamic view using EHR/patient accounting, payer eligibility, clearinghouse, SharePoint, Teams, and an authorized RCM owner;
- an illustrative Azure deployment view.

The PeopleSoft, Banner, LMS, CRM, and Azure SQL integrations are labeled illustrative because the public prototype does not claim access to an institution's production systems. The model deliberately routes them through approved APIs and validation; it does not show direct PeopleSoft/Banner writes to SharePoint. Source systems remain authoritative.

Open the file in [Structurizr](https://structurizr.com/) or the Structurizr CLI to render PNG, SVG, or a workspace view.

In Structurizr, import the DSL file as a workspace and select these views:

1. **HR1 - Governed enterprise integration system context** for the executive relationship map.
2. **HR1 - System landscape** for the full ecosystem and ownership boundaries.
3. **HR1 - Rules-first reconciliation and accountable decision workflow** for the container-level technical view.
4. **HR1 - Integration boundary components** for the internal service/component view.
5. **HR1 - Student record dispute dynamic flow**, **HR1 - Online course access and refund dynamic flow**, **HR1 - Recruiter candidate triage dynamic flow**, or **HR1 - Illustrative revenue-cycle denial management flow** to walk through numbered integration steps.

## Diagram key

- **Light gray:** illustrative source or external system; production access requires customer-approved APIs.
- **Light blue:** Microsoft or integration boundary component.
- **Purple:** deterministic rules or bounded AI assistance.
- **Green:** governed SharePoint/workflow/audit surfaces.
- **Orange/person:** accountable human decision owner.
- **Dashed boundary:** HR1-controlled integration boundary.
- **Solid arrows:** approved data or workflow relationship; labels identify the interface or protocol.

The diagrams intentionally distinguish **evidence movement** from **authority**. PeopleSoft, Banner, EHR, payer, and clearinghouse systems remain authoritative for the records they own. HR1 may read approved evidence and write governed workflow/audit records to SharePoint, but it does not silently replace source records or perform autonomous healthcare, student, financial, or recruiting decisions.

The RCM view is a portfolio/architecture example, not a claim that HR1 has production access to a healthcare organization, patient data, EHR, payer, or claims clearinghouse. Any real deployment would require customer-approved interfaces, HIPAA/security review, contracts, data-minimization controls, and a named operational owner.
