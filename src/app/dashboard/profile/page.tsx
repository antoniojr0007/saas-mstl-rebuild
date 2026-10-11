import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { ProfileSettings } from "@/components/profile-settings";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <a className="brand" href="/">
          <span className="brand-mark">m</span>
          <span>
            mstl<span className="brand-dot">.</span>
          </span>
        </a>
        <nav className="dashboard-nav" aria-label="Navegação da conta">
          <Link className="top-link" href="/dashboard">
            Painel
          </Link>
          <SignOutButton />
        </nav>
      </header>
      <section className="profile-content">
        <Link className="profile-back" href="/dashboard">
          ← Voltar ao painel
        </Link>
        <div className="eyebrow">
          <span className="eyebrow-line" /> CONTA
        </div>
        <h1>Seu perfil</h1>
        <p className="profile-intro">
          Atualize seus dados pessoais e mantenha sua conta protegida.
        </p>
        <ProfileSettings name={session.user.name} email={session.user.email} />
      </section>
    </main>
  );
}
