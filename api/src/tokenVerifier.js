const { createRemoteJWKSet, jwtVerify } = require("jose");

function createTokenVerifier({ tenantId, audience }) {
  if (!tenantId || !audience) return async () => null;
  const issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;
  const jwks = createRemoteJWKSet(new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`));
  return async (request) => {
    const authorization = request.headers?.get ? request.headers.get("authorization") : request.headers?.authorization || request.headers?.Authorization;
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return null;
    const { payload } = await jwtVerify(token, jwks, { issuer, audience });
    return { oid: payload.oid, roles: Array.isArray(payload.roles) ? payload.roles : [] };
  };
}

module.exports = { createTokenVerifier };
