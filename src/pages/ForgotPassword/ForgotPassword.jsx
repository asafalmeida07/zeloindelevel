import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import styles from "../Login/Auth.module.css";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError(""); setBusy(true);
    try { await resetPassword(email.trim()); setSent(true); }
    catch { setError("Não foi possível enviar. Verifique o email."); }
    finally { setBusy(false); }
  }

  return (
    <div className={styles.form}>
      <h1 className={styles.h1}>Recuperar senha</h1>
      {sent ? (
        <p className={styles.minor}>Enviamos um link de redefinição para <b>{email}</b>. Verifique sua caixa de entrada.</p>
      ) : (
        <>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com" error={error} onKeyDown={(e) => e.key === "Enter" && submit()} />
          <Button full loading={busy} onClick={submit} disabled={!email}>Enviar link</Button>
        </>
      )}
      <p className={styles.foot}><Link to="/login" className={styles.link}>Voltar para o login</Link></p>
    </div>
  );
}
