import assert from "node:assert/strict";
import test from "node:test";
import { loadEnv } from "../src/lib/env.mjs";

const validEnvironment = {
  DATABASE_URL: "postgresql://user:pass@localhost:5432/app",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: "a-secure-test-secret-with-at-least-32-chars",
};

test("loads core settings and disables social providers by default", () => {
  const env = loadEnv(validEnvironment);

  assert.equal(env.databaseUrl, validEnvironment.DATABASE_URL);
  assert.equal(env.socialProviders.google.enabled, false);
  assert.equal(env.socialProviders.github.enabled, false);
  assert.equal(env.socialProviders.facebook.enabled, false);
});

test("rejects invalid required URLs and short auth secrets", () => {
  assert.throws(
    () =>
      loadEnv({
        ...validEnvironment,
        DATABASE_URL: "https://db.example",
        BETTER_AUTH_SECRET: "short",
      }),
    /DATABASE_URL precisa ser uma URL PostgreSQL válida[\s\S]*BETTER_AUTH_SECRET precisa ter pelo menos 32 caracteres/,
  );
});

test("requires credentials when a social provider is enabled", () => {
  assert.throws(
    () => loadEnv({ ...validEnvironment, AUTH_FACEBOOK_ENABLED: "true" }),
    /AUTH_FACEBOOK_CLIENT_ID e AUTH_FACEBOOK_CLIENT_SECRET são obrigatórias/,
  );
});

test("loads a social provider only when enabled and fully configured", () => {
  const env = loadEnv({
    ...validEnvironment,
    AUTH_GOOGLE_ENABLED: "true",
    AUTH_GOOGLE_CLIENT_ID: "google-client-id",
    AUTH_GOOGLE_CLIENT_SECRET: "google-client-secret",
  });

  assert.deepEqual(env.socialProviders.google, {
    enabled: true,
    clientId: "google-client-id",
    clientSecret: "google-client-secret",
  });
});
