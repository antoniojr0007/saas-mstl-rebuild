import { AuthForm } from "@/components/auth-form";
import { publicSocialProviders } from "@/lib/social-providers";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return <AuthForm mode="sign-up" providers={publicSocialProviders} />;
}
