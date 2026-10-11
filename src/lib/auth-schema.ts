import { betterAuth } from "better-auth/minimal";
import { authOptions } from "./auth-options";

export const auth = betterAuth(authOptions);
