const { app } = require("@azure/functions");
const { createSecurityHandlers, configFromEnvironment } = require("./securityAssurance");
const { createTokenVerifier } = require("./tokenVerifier");

const config = configFromEnvironment();
const verifyToken = createTokenVerifier({ tenantId: config.tenantId, audience: config.audience });
const handlers = createSecurityHandlers({ verifyToken, logger: console });

app.http("security-status", { methods: ["GET", "OPTIONS"], authLevel: "anonymous", route: "security/status", handler: handlers.status });
app.http("security-csrf", { methods: ["GET", "OPTIONS"], authLevel: "anonymous", route: "security/csrf", handler: handlers.csrf });
app.http("security-scan", { methods: ["POST", "OPTIONS"], authLevel: "anonymous", route: "security/scan", handler: handlers.scan });
