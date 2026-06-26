import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="container page-pad" style={{ textAlign: "center", paddingTop: 80 }}>
      <h1 style={{ fontSize: 48, fontFamily: "var(--font-num)" }}>404</h1>
      <p style={{ color: "var(--text-dim)", marginTop: 8 }}>Página não encontrada.</p>
      <Link to="/" style={{ color: "var(--accent-2)", fontWeight: 600, display: "inline-block", marginTop: 16 }}>Voltar ao painel</Link>
    </div>
  );
}
