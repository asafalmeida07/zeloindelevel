import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { userService } from "../../services/userService.js";
import { authService } from "../../services/authService.js";
import { PROFILE_COLORS } from "../../utils/constants.js";
import styles from "../Login/Auth.module.css";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    if (password.length < 6) { setError("A senha precisa de pelo menos 6 caracteres."); return; }
    setBusy(true);
    try {
      const cred = await register(email.trim(), password);
      await authService.setDisplayName(name.trim());
      await userService.createIfMissing(cred.user.uid, {
        name: name.trim(), email: email.trim(),
        color: PROFILE_COLORS[Math.floor(Math.random() * PROFILE_COLORS.length)],
      });
      nav("/", { replace: true });
    } catch (e) {
      setError(e?.code === "auth/email-already-in-use" ? "Este email já está cadastrado." : "Não foi possível cadastrar.");
    } finally { setBusy(false); }
  }

  return (
    <div className={styles.form}>
      <h1 className={styles.h1}>Criar conta</h1>
      <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" maxLength={32} />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
      <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="mínimo 6 caracteres" onKeyDown={(e) => e.key === "Enter" && submit()} error={error} />
      <Button full loading={busy} onClick={submit} disabled={!name || !email || !password}>Cadastrar</Button>
      <p className={styles.foot}>Já tem conta? <Link to="/login" className={styles.link}>Entrar</Link></p>
    </div>
  );
}
