import { AuthForm } from "@/components/auth-form";
import { publicSocialProviders } from "@/lib/social-providers";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return <AuthForm mode="sign-in" providers={publicSocialProviders} />;
}
