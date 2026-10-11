export type SocialProviderId = "google" | "github" | "facebook";

export type PublicSocialProvider = {
  id: SocialProviderId;
  label: string;
};

import { loadEnv } from "@/lib/env.mjs";

const configuredProviders = loadEnv().socialProviders;

const providerDefinitions = [
  {
    id: "google",
    label: "Google",
    enabled: configuredProviders.google.enabled,
    clientId: configuredProviders.google.clientId,
    clientSecret: configuredProviders.google.clientSecret,
  },
  {
    id: "github",
    label: "GitHub",
    enabled: configuredProviders.github.enabled,
    clientId: configuredProviders.github.clientId,
    clientSecret: configuredProviders.github.clientSecret,
  },
  {
    id: "facebook",
    label: "Facebook",
    enabled: configuredProviders.facebook.enabled,
    clientId: configuredProviders.facebook.clientId,
    clientSecret: configuredProviders.facebook.clientSecret,
  },
] as const;

export const socialProviders = Object.fromEntries(
  providerDefinitions
    .filter(
      (provider) =>
        provider.enabled && provider.clientId && provider.clientSecret,
    )
    .map(({ id, clientId, clientSecret }) => [id, { clientId, clientSecret }]),
);

export const publicSocialProviders: PublicSocialProvider[] = providerDefinitions
  .filter(
    (provider) =>
      provider.enabled && provider.clientId && provider.clientSecret,
  )
  .map(({ id, label }) => ({ id, label }));
