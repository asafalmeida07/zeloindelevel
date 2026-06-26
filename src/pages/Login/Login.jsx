import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import styles from "./Auth.module.css";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(""); setBusy(true);
    try {
      await login(email.trim(), password);
      nav(loc.state?.from?.pathname || "/", { replace: true });
    } catch {
      setError("Email ou senha inválidos.");
    } finally { setBusy(false); }
  }

  return (
    <div className={styles.form}>
      <h1 className={styles.h1}>Entrar</h1>
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
      <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && submit()} error={error} />
      <Link to="/recuperar" className={styles.minor}>Esqueci minha senha</Link>
      <Button full loading={busy} onClick={submit} disabled={!email || !password}>Entrar</Button>
      <p className={styles.foot}>Não tem conta? <Link to="/cadastro" className={styles.link}>Cadastre-se</Link></p>
    </div>
  );
}
