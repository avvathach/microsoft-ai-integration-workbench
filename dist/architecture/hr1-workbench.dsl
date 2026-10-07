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

        ehr = softwareSystem "EHR / patient accounting" "Illustrative healthcare source system for encounters, charges, coverage, and patient responsibility." {
            tags "Illustrative healthcare source"
        }
        clearinghouse = softwareSystem "Claims clearinghouse" "Illustrative external exchange for claim submission, acknowledgements, and remittance files." {
            tags "Illustrative healthcare source"
        }
        payer = softwareSystem "Payer / eligibility service" "Illustrative external service for eligibility, authorization, and claim-status evidence." {
            tags "Illustrative healthcare source"
        }
        rcmOwner = person "RCM operations owner" "Authorized billing or revenue-cycle reviewer who resolves a denial or exception." {
            tags "Person"
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

        ehr -> hr1.api "Reads encounter, charge, coverage, and patient-responsibility evidence" "FHIR / HL7 / REST"
        clearinghouse -> hr1.api "Returns claim acknowledgements and remittance evidence" "EDI / API"
        payer -> hr1.api "Returns eligibility, authorization, and claim-status evidence" "API"
        rcmOwner -> hr1.review "Reviews denial evidence and approves the next action"
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
            include ehr
            include clearinghouse
            include payer
            include rcmOwner
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

        dynamic hr1 "student-record-dispute-flow" {
            1: reviewer -> hr1.review "Submits a historical record or refund question"
            2: hr1.review -> hr1.api "Requests linked evidence using the authorized case scope"
            3: hr1.api -> peopleSoft "Reads enrollment, program, and term evidence" "HTTPS / REST"
            4: hr1.api -> banner "Reads registration and course evidence" "HTTPS / REST"
            5: hr1.api -> lms "Reads course activity evidence" "HTTPS / REST"
            6: hr1.api -> crm "Reads prior support or case history" "Dataverse / API"
            7: hr1.api -> hr1.orchestration "Returns the approved evidence set"
            8: hr1.orchestration -> hr1.rules "Normalizes identifiers and applies deterministic checks"
            9: hr1.rules -> azureSql "Reads or updates the crosswalk and processing state"
            10: hr1.rules -> hr1.ai "Sends only unresolved mismatches with evidence references"
            11: hr1.ai -> hr1.review "Presents an exception summary; no writeback authority"
            12: reviewer -> hr1.review "Accepts, rejects, or escalates with rationale"
            13: hr1.review -> sharePoint "Records evidence packet, decision, and audit event" "Microsoft Graph"
            14: hr1.review -> teams "Notifies the accountable owner or next queue" "Microsoft Graph"
            autolayout lr
            description "Technical sequence: historical student evidence is collected, reconciled, reviewed, and audited without replacing the authoritative systems."
            title "HR1 - Student record dispute dynamic flow"
        }

        dynamic hr1 "course-access-refund-flow" {
            1: reviewer -> hr1.review "Opens an online course access or refund review"
            2: hr1.review -> hr1.api "Requests enrollment, payment, textbook, and access evidence"
            3: hr1.api -> peopleSoft "Reads enrollment and term status" "HTTPS / REST"
            4: hr1.api -> banner "Reads course and registration status" "HTTPS / REST"
            5: hr1.api -> lms "Reads login and course access activity" "HTTPS / REST"
            6: hr1.api -> crm "Reads support contacts and prior cases" "Dataverse / API"
            7: hr1.api -> hr1.orchestration "Builds a dated evidence timeline"
            8: hr1.orchestration -> hr1.rules "Checks policy deadlines and payment/access conditions"
            9: hr1.rules -> hr1.ai "Summarizes contradictions or missing evidence"
            10: hr1.ai -> hr1.review "Shows the chair a bounded evidence summary"
            11: reviewer -> hr1.review "Makes the remedy decision; Student Accounts policy remains authoritative"
            12: hr1.review -> sharePoint "Stores the decision, rationale, and appeal path" "Microsoft Graph"
            13: hr1.review -> teams "Routes follow-up tasks"
            autolayout lr
            description "Technical sequence: course access and refund evidence is assembled into a reviewable timeline; AI assists, but the chair decides."
            title "HR1 - Online course access and refund dynamic flow"
        }

        dynamic hr1 "recruiter-triage-flow" {
            1: reviewer -> hr1.review "Opens a candidate review queue"
            2: hr1.review -> hr1.api "Requests the application, resume, transcript, and role criteria"
            3: hr1.api -> crm "Reads candidate and requisition context" "Dataverse / API"
            4: hr1.api -> hr1.orchestration "Extracts evidence into a normalized candidate packet"
            5: hr1.orchestration -> hr1.rules "Checks explicit requirements and missing evidence"
            6: hr1.rules -> hr1.ai "Summarizes relevant experience only for unclear cases"
            7: hr1.ai -> hr1.review "Provides a traceable summary with source references"
            8: reviewer -> hr1.review "Routes to recruiter or holds for human review"
            9: hr1.review -> sharePoint "Records routing reason and review history" "Microsoft Graph"
            10: hr1.review -> teams "Notifies recruiter and hiring manager"
            autolayout lr
            description "Technical sequence: deterministic evidence checks come first; AI does not auto-reject candidates or infer protected characteristics."
            title "HR1 - Recruiter candidate triage dynamic flow"
        }

        dynamic hr1 "rcm-denial-management-flow" {
            1: rcmOwner -> hr1.review "Opens a denial or underpayment case"
            2: hr1.review -> hr1.api "Requests the minimum case evidence"
            3: hr1.api -> ehr "Reads encounter, charge, coverage, and responsibility evidence" "FHIR / HL7 / REST"
            4: hr1.api -> payer "Checks eligibility, authorization, and claim status" "API"
            5: hr1.api -> clearinghouse "Reads acknowledgement and remittance evidence" "EDI / API"
            6: hr1.api -> hr1.orchestration "Returns evidence through the approved integration boundary"
            7: hr1.orchestration -> hr1.rules "Checks required fields, identifiers, payer rules, and timely-filing conditions"
            8: hr1.rules -> hr1.ai "Sends only unresolved denial patterns with evidence references"
            9: hr1.ai -> hr1.review "Summarizes likely cause and missing evidence; no autonomous claim change"
            10: rcmOwner -> hr1.review "Approves correction, appeal, hold, or escalation"
            11: hr1.review -> sharePoint "Stores the evidence packet, decision, and audit trail" "Microsoft Graph"
            12: hr1.review -> teams "Routes follow-up to the responsible queue" "Microsoft Graph"
            autolayout lr
            description "Illustrative RCM sequence: source evidence is assembled and governed before an authorized revenue-cycle owner decides. This is not a claim of production access or a completed healthcare deployment."
            title "HR1 - Illustrative revenue-cycle denial management flow"
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
