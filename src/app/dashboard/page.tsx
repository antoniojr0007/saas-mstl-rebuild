import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <a className="brand" href="/">
          <span className="brand-mark">m</span>
          <span>
            mstl<span className="brand-dot">.</span>
          </span>
        </a>
        <SignOutButton />
      </header>
      <section className="dashboard-welcome">
        <div className="eyebrow">
          <span className="eyebrow-line" /> SESSÃO ATIVA
        </div>
        <h1>Olá, {session.user.name}.</h1>
        <p>
          Conta autenticada com segurança. A próxima etapa é criar sua
          organização e definir seu espaço de trabalho.
        </p>
        <div className="dashboard-next">
          <span className="next-number">01</span>
          <span>
            <strong>Próxima etapa</strong>
            <br />
            Organizações e isolamento entre equipes
          </span>
        </div>
      </section>
    </main>
  );
}
