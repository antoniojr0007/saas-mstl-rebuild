"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

type Props = { name: string; email: string };

export function ProfileSettings({ name, email }: Props) {
  const [displayName, setDisplayName] = useState(name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function updateName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const result = await authClient.updateUser({ name: displayName.trim() });
    setBusy(false);
    if (result.error)
      setError(
        "Não foi possível salvar seu nome. Confira os dados e tente novamente.",
      );
    else setMessage("Nome atualizado com sucesso.");
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setBusy(false);
    if (result.error)
      setError(
        "Não foi possível alterar a senha. Verifique a senha atual e tente novamente.",
      );
    else {
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Senha alterada. As outras sessões foram encerradas.");
    }
  }

  return (
    <div className="profile-panels">
      <form className="profile-panel auth-form" onSubmit={updateName}>
        <h2>Dados pessoais</h2>
        <label>
          E-mail
          <input type="email" value={email} readOnly aria-readonly="true" />
          <span className="field-hint">
            O e-mail de acesso não pode ser alterado por esta tela.
          </span>
        </label>
        <label>
          Nome
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            minLength={1}
            maxLength={80}
            autoComplete="name"
          />
        </label>
        <button
          className="button-primary auth-submit"
          disabled={busy || !displayName.trim()}
        >
          {busy ? "Salvando…" : "Salvar nome"}
        </button>
      </form>
      <form className="profile-panel auth-form" onSubmit={updatePassword}>
        <h2>Alterar senha</h2>
        <label>
          Senha atual
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <label>
          Nova senha
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={12}
            autoComplete="new-password"
          />
          <span className="field-hint">Use pelo menos 12 caracteres.</span>
        </label>
        <button
          className="button-primary auth-submit"
          disabled={busy || newPassword.length < 12}
        >
          {busy ? "Atualizando…" : "Alterar senha"}
        </button>
      </form>
      {message && (
        <p className="profile-message" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
