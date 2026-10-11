import {
  ArrowUpRight,
  Blocks,
  Check,
  CircleHelp,
  Layers3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const pillars = [
  {
    icon: Layers3,
    title: "Organizações e projetos",
    description:
      "Cada espaço de trabalho mantém seus membros e projetos separados.",
  },
  {
    icon: ShieldCheck,
    title: "Acesso por função",
    description: "Permissões verificadas no servidor para cada recurso e ação.",
  },
  {
    icon: UsersRound,
    title: "Colaboração segura",
    description:
      "Convites com validade, papéis claros e histórico administrativo.",
  },
];

const milestones = [
  { label: "Fundação da aplicação", state: "Concluída" },
  { label: "Autenticação e sessão", state: "Configurada; banco pendente" },
  { label: "Organizações e isolamento", state: "Próxima etapa" },
];

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="MSTL início">
          <span className="brand-mark">
            <Blocks size={18} strokeWidth={2.4} />
          </span>
          <span>
            mstl<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="topbar-right">
          <span className="status">
            <i /> Projeto em construção
          </span>
          <a className="top-link" href="/sign-in">
            Entrar
          </a>
          <a className="top-link" href="/sign-up">
            Criar conta
          </a>
          <button className="icon-button" aria-label="Ajuda">
            <CircleHelp size={18} />
          </button>
          <div className="avatar">A</div>
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow">
          <span className="eyebrow-line" /> NOVA BASE · MVP
        </div>
        <h1>
          Seu espaço para
          <br />
          <em>construir em equipe.</em>
        </h1>
        <p className="hero-copy">
          Estamos preparando uma plataforma simples para organizar organizações,
          membros e projetos com segurança desde a primeira versão.
        </p>
        <div className="hero-actions">
          <a className="button-primary" href="/sign-up">
            Criar conta <ArrowUpRight size={16} />
          </a>
          <span className="scope-note">
            Primeiro: uma base sólida. Depois: novas funcionalidades.
          </span>
        </div>
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-glow" />
        <div className="hero-grid" />
      </section>

      <section className="pillars" aria-label="Fundamentos do produto">
        {pillars.map(({ icon: Icon, title, description }, index) => (
          <article className="pillar" key={title}>
            <div className="pillar-top">
              <span className="pillar-icon">
                <Icon size={18} />
              </span>
              <span className="pillar-index">0{index + 1}</span>
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="roadmap" id="roadmap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" /> ROTEIRO
            </div>
            <h2>Construindo por etapas.</h2>
          </div>
          <span className="roadmap-count">
            02 <span>/ 07 fases</span>
          </span>
        </div>
        <div className="milestone-list">
          {milestones.map((item, index) => (
            <div
              className={`milestone ${index === 0 ? "milestone-active" : ""}`}
              key={item.label}
            >
              <span className="milestone-check">
                {index === 0 ? (
                  <span className="pulse" />
                ) : index === 1 ? (
                  "02"
                ) : (
                  "03"
                )}
              </span>
              <span className="milestone-name">{item.label}</span>
              <span className="milestone-state">
                {index === 0 && <Check size={13} />}
                {item.state}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>
          mstl<span className="brand-dot">.</span>{" "}
          <span className="footer-muted">Um começo bem pensado.</span>
        </span>
        <span className="footer-note">MVP · 2026</span>
      </footer>
    </main>
  );
}
