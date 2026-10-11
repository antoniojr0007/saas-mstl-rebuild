import type { Metadata } from "next";
import "./globals.css";
import "./social-auth.css";

export const metadata: Metadata = {
  title: "MSTL — Workspace SaaS",
  description: "Uma base segura para organizar equipes, espaços e projetos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
