"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { PublicSocialProvider } from "@/lib/social-providers";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  providers: PublicSocialProvider[];
};

export function AuthForm({ mode, providers }: AuthFormProps) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  async function handleSocialSignIn(provider: PublicSocialProvider) {
    setError("");
    setSocialLoading(provider.id);

    try {
      const result = await authClient.signIn.social({
        provider: provider.id,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(
          `Não foi possível entrar com ${provider.label}. Tente novamente.`,
        );
        setSocialLoading(null);
      }
    } catch {
      setError(
        `Não foi possível conectar ao ${provider.label}. Tente novamente.`,
      );
      setSocialLoading(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = isSignUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        setError(
          "Não foi possível concluir. Confira os dados e tente novamente.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(
        "Não foi possível conectar ao serviço. Tente novamente em instantes.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <Link className="brand auth-brand" href="/">
        <span className="brand-mark">m</span>
        <span>
          mstl<span className="brand-dot">.</span>
        </span>
      </Link>
      <section className="auth-card">
        <div className="eyebrow">
          <span className="eyebrow-line" /> ACESSO AO WORKSPACE
        </div>
        <h1>{isSignUp ? "Comece por aqui." : "Bom ter você de volta."}</h1>
        <p className="auth-intro">
          {isSignUp
            ? "Crie sua conta para começar a organizar seu trabalho."
            : "Entre com seu e-mail e senha para continuar."}
        </p>
        {providers.length > 0 && (
          <>
            <div
              className="social-auth-buttons"
              aria-label="Entrar com uma rede social"
            >
              {providers.map((provider) => (
                <button
                  className="social-auth-button"
                  key={provider.id}
                  type="button"
                  disabled={isSubmitting || socialLoading !== null}
                  onClick={() => void handleSocialSignIn(provider)}
                >
                  {socialLoading === provider.id
                    ? "Conectando…"
                    : `Continuar com ${provider.label}`}
                </button>
              ))}
            </div>
            <div className="auth-divider">
              <span>ou use seu e-mail</span>
            </div>
          </>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <label>
              Nome
              <input
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={80}
              />
            </label>
          )}
          <label>
            E-mail
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={isSignUp ? 12 : 1}
            />
            {isSignUp && (
              <span className="field-hint">Use pelo menos 12 caracteres.</span>
            )}
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button-primary auth-submit"
            type="submit"
            disabled={isSubmitting || socialLoading !== null}
          >
            {isSubmitting ? "Aguarde…" : isSignUp ? "Criar conta" : "Entrar"}
          </button>
        </form>
        <p className="auth-switch">
          {isSignUp ? "Já tem uma conta? " : "Ainda não tem conta? "}
          <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
            {isSignUp ? "Entrar" : "Criar conta"}
          </Link>
        </p>
      </section>
      <p className="auth-footnote">MSTL · Acesso protegido por sessão.</p>
    </main>
  );
}
