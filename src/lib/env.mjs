const providerNames = ["GOOGLE", "GITHUB", "FACEBOOK"];

/**
 * Read and validate the server environment without returning secret values in
 * validation errors. Values are intentionally read at runtime, not inlined.
 * @param {NodeJS.ProcessEnv} source
 */
export function loadEnv(source = process.env) {
  const issues = [];
  const databaseUrl = source.DATABASE_URL?.trim();
  const betterAuthUrl = source.BETTER_AUTH_URL?.trim();
  const betterAuthSecret = source.BETTER_AUTH_SECRET;

  if (!databaseUrl) issues.push("DATABASE_URL é obrigatória.");
  else if (!isUrlWithProtocol(databaseUrl, ["postgres:", "postgresql:"])) {
    issues.push("DATABASE_URL precisa ser uma URL PostgreSQL válida.");
  }

  if (!betterAuthUrl) issues.push("BETTER_AUTH_URL é obrigatória.");
  else if (!isUrlWithProtocol(betterAuthUrl, ["http:", "https:"])) {
    issues.push("BETTER_AUTH_URL precisa usar HTTP ou HTTPS.");
  }

  if (!betterAuthSecret || betterAuthSecret.length < 32) {
    issues.push("BETTER_AUTH_SECRET precisa ter pelo menos 32 caracteres.");
  }

  /** @type {Record<string, { enabled: boolean, clientId: string, clientSecret: string }>} */
  const socialProviders = {};

  for (const provider of providerNames) {
    const key = `AUTH_${provider}_ENABLED`;
    const rawEnabled = source[key]?.trim().toLowerCase();
    if (rawEnabled && rawEnabled !== "true" && rawEnabled !== "false") {
      issues.push(`${key} aceita apenas true ou false.`);
    }

    const enabled = rawEnabled === "true";
    const clientId = source[`AUTH_${provider}_CLIENT_ID`]?.trim() ?? "";
    const clientSecret = source[`AUTH_${provider}_CLIENT_SECRET`]?.trim() ?? "";
    if (enabled && (!clientId || !clientSecret)) {
      issues.push(
        `AUTH_${provider}_CLIENT_ID e AUTH_${provider}_CLIENT_SECRET são obrigatórias quando o provedor está habilitado.`,
      );
    }

    socialProviders[provider.toLowerCase()] = {
      enabled,
      clientId,
      clientSecret,
    };
  }

  if (issues.length > 0) {
    throw new Error(
      `Configuração de ambiente inválida:\n- ${issues.join("\n- ")}`,
    );
  }

  return {
    databaseUrl: /** @type {string} */ (databaseUrl),
    betterAuthUrl: /** @type {string} */ (betterAuthUrl),
    betterAuthSecret: /** @type {string} */ (betterAuthSecret),
    socialProviders,
  };
}

/** @param {string} value @param {string[]} protocols */
function isUrlWithProtocol(value, protocols) {
  try {
    return protocols.includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
