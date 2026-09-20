# iAvva Higher-Ed AI Integration Workbench

Static browser MVP for a white-label, Microsoft-ready AI applications integration workflow in higher education.

## Run

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

## What is included

- iAvva-branded dashboard and executive story flow
- Problem, solution, and benefits summary for CIO/CTO conversations
- Synthetic reviewer queue for identity, course, term, and transaction exceptions
- Side-by-side source and target record comparison
- Accept, reject, and escalate decision logging
- Downloadable audit CSV
- Microsoft enterprise integration map for Entra ID, Graph, SharePoint/Dataverse, Teams, Azure AI, and Power BI/Fabric
- CIO, technical, and recruiter explanation views

## Data and source notes

The app uses fictional records only. Public datasets and references informed the schema and story, not the row values:

- iAvva AI public positioning: https://www.iavva.ai/about
- UCI Student Performance dataset: https://archive.ics.uci.edu/dataset/320/student+performance
- Open University Learning Analytics Dataset article: https://www.nature.com/articles/sdata2017171
- Microsoft Entra SSO: https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/add-application-portal-setup-sso
- Microsoft Graph API: https://learn.microsoft.com/en-us/graph/use-the-api
- SharePoint list item creation via Graph: https://learn.microsoft.com/en-us/graph/api/listitem-create?view=graph-rest-1.0
- Power BI embedded analytics: https://learn.microsoft.com/en-us/power-bi/developer/embedded/embedded-analytics-power-bi
