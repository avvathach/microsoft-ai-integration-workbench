workspace "HR1 Governed AI Integration Workbench" "Illustrative higher-education integration architecture for a governed, human-in-the-loop decision process." {

    !identifiers hierarchical

    model {
        reviewer = person "Authorized institutional owner" "Registrar, department chair, Student Accounts administrator, or recruiter who reviews evidence and makes the accountable decision." {
            tags "Person"
        }

        peopleSoft = softwareSystem "PeopleSoft" "Illustrative student information system. It remains authoritative for the records it owns." {
            tags "Illustrative source system"
        }
        banner = softwareSystem "Banner" "Illustrative student information system. It remains authoritative for the records it owns." {
            tags "Illustrative source system"
        }
        lms = softwareSystem "Learning platform" "Illustrative learning management system for course, section, and activity evidence." {
            tags "Illustrative source system"
        }
        crm = softwareSystem "CRM" "Illustrative relationship and case-management system." {
            tags "Illustrative source system"
        }

        hr1 = softwareSystem "HR1 Integration Workbench" "Rules-first reconciliation, AI-assisted exception review, human approval, workflow, and audit." {
            tags "HR1"

            api = container "API and integration boundary" "Approved adapters, authentication, throttling, retries, and routing." "Azure API Management" {
                tags "Integration"
            }
            orchestration = container "Orchestration and validation" "Normalizes IDs, validates required evidence, applies policy checks, and routes work." "Azure Functions / Power Automate" {
                tags "Integration"
            }
            rules = container "Deterministic reconciliation" "Matches identifiers and compares records before any AI assistance is used." "Application service" {
                tags "Decision"
            }
            ai = container "AI exception assistant" "Summarizes unresolved differences and cites the evidence; it cannot independently change source records." "Azure AI" {
                tags "Decision"
            }
            review = container "Human review and workflow" "Presents an evidence packet, records accept/reject/escalate, owner, rationale, and timestamp." "SharePoint + Microsoft Graph" {
                tags "Governed"
            }
            audit = container "Audit and reporting" "Maintains workflow evidence and produces operational and executive reporting." "SharePoint, Power BI / Fabric" {
                tags "Governed"
            }
        }

        sharePoint = softwareSystem "SharePoint / Microsoft 365" "Governed document and workflow data layer in the customer tenant. It does not replace the systems of record." {
            tags "Microsoft"
        }
        azureSql = softwareSystem "Azure SQL crosswalk store" "Illustrative normalized values, ID crosswalks, metrics, and processing state." {
            tags "Microsoft"
        }
        teams = softwareSystem "Teams" "Illustrative task and notification surface." {
            tags "Microsoft"
        }
        graph = softwareSystem "Microsoft Graph" "Read-only demo-tenant connection used by the public prototype." {
            tags "Live prototype"
        }
        entra = softwareSystem "Microsoft Entra ID" "Tenant authentication, MFA, and role-based access control." {
            tags "Control"
        }
        keyVault = softwareSystem "Azure Key Vault" "Server-side secret storage for API credentials and configuration." {
            tags "Control"
        }
        insights = softwareSystem "Application Insights" "Operational telemetry and alerts without secrets or vulnerability details." {
            tags "Control"
        }

        peopleSoft -> hr1.api "Reads student, program, and term records via approved integration API" "HTTPS / REST"
        banner -> hr1.api "Reads student, course, and registration records via approved integration API" "HTTPS / REST"
        lms -> hr1.api "Reads course, enrollment, and activity evidence via approved API" "HTTPS / REST"
        crm -> hr1.api "Reads cases and engagement history via supported API" "HTTPS / REST"
        graph -> hr1.api "Provides read-only demo-tenant context" "Microsoft Graph"

        hr1.api -> hr1.orchestration "Authenticates, throttles, retries, and routes approved requests"
        hr1.orchestration -> hr1.rules "Sends normalized evidence for deterministic matching"
        hr1.rules -> azureSql "Reads and writes normalized crosswalks and processing state" "Private endpoint / SQL connector"
        hr1.rules -> hr1.ai "Sends only unresolved exceptions with evidence references"
        hr1.ai -> hr1.review "Provides a bounded summary and evidence references"
        hr1.orchestration -> sharePoint "Stores governed evidence packets and workflow records" "Microsoft Graph / SharePoint API"
        hr1.review -> sharePoint "Records decision, rationale, owner, timestamp, and appeal path" "Microsoft Graph / SharePoint API"
        reviewer -> hr1.review "Reviews evidence and accepts, rejects, or escalates"
        hr1.review -> teams "Creates an owner task and notification" "Microsoft Graph"
        hr1.audit -> sharePoint "Reads the audit trail and evidence records"
        hr1.audit -> teams "Publishes operational notifications"
        hr1.review -> hr1.audit "Emits an auditable decision event"

        entra -> hr1.api "Authenticates callers and enforces role scope" "OAuth 2.0 / MFA"
        keyVault -> hr1.api "Provides server-side secrets at runtime" "Managed identity"
        insights -> hr1.api "Collects request and failure telemetry"
        insights -> hr1.orchestration "Collects processing and retry telemetry"
        insights -> hr1.review "Logs scan/workflow initiation and completion metadata"
    }

    views {
        systemContext hr1 "system-context" {
            include reviewer
            include peopleSoft
            include banner
            include lms
            include crm
            include hr1
            include sharePoint
            include azureSql
            include teams
            include graph
            include entra
            include insights
            autolayout lr
            description "System context: authoritative sources connect through HR1 to governed Microsoft workflow surfaces."
            title "HR1 - Governed enterprise integration system context"
        }

        container hr1 "container-view" {
            include reviewer
            include peopleSoft
            include banner
            include lms
            include crm
            include hr1.api
            include hr1.orchestration
            include hr1.rules
            include hr1.ai
            include hr1.review
            include hr1.audit
            include sharePoint
            include azureSql
            include teams
            include entra
            include keyVault
            include insights
            autolayout lr
            description "Container view: validation and rules precede AI assistance; only an authorized owner decides."
            title "HR1 - Rules-first reconciliation and accountable decision workflow"
        }

        deployment hr1 "azure-deployment" {
            include *
            autolayout lr
            description "Illustrative Azure deployment boundary. Final topology depends on the customer's Microsoft 365 and Azure plan."
            title "HR1 - Illustrative Azure deployment"
        }

        styles {
            element "Person" { background #fff7ed color #9a3412 shape person }
            element "HR1" { background #dbeafe color #1e3a8a }
            element "Illustrative source system" { background #f8fafc color #334155 }
            element "Integration" { background #eff6ff color #1d4ed8 }
            element "Decision" { background #f5f3ff color #5b21b6 }
            element "Governed" { background #dcfce7 color #166534 }
            element "Microsoft" { background #e0f2fe color #075985 }
            element "Live prototype" { background #d1fae5 color #065f46 }
            element "Control" { background #e2e8f0 color #0f172a }
        }
    }
}
