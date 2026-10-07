# HR1 architecture artifacts

`hr1-workbench.dsl` is the architecture-as-code source for the HR1 integration workbench. It uses Structurizr DSL and provides:

- a system-context view for CIO and business stakeholders;
- a container view showing API management, orchestration, rules, AI assistance, human review, SharePoint workflow, and reporting;
- an illustrative Azure deployment view.

The PeopleSoft, Banner, LMS, CRM, and Azure SQL integrations are labeled illustrative because the public prototype does not claim access to an institution's production systems. The model deliberately routes them through approved APIs and validation; it does not show direct PeopleSoft/Banner writes to SharePoint. Source systems remain authoritative.

Open the file in [Structurizr](https://structurizr.com/) or the Structurizr CLI to render PNG, SVG, or a workspace view.
