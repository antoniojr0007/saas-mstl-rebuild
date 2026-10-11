import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { socialProviders } from "@/lib/social-providers";
import { loadEnv } from "@/lib/env.mjs";

const env = loadEnv();

export const auth = betterAuth({
  ...authOptions,
  appName: "MSTL",
  baseURL: env.betterAuthUrl,
  secret: env.betterAuthSecret,
  socialProviders,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
});
