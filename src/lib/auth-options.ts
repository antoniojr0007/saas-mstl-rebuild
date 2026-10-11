import type { BetterAuthOptions } from "better-auth";

export const authOptions = {
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 30,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
  },
} satisfies BetterAuthOptions;
