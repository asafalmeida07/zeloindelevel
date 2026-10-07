import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser.js";
import { userService } from "../../services/userService.js";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import { useToast } from "../../components/Toast/ToastContext.jsx";
import styles from "./Plan.module.css";

export default function Plan() {
  const { profile, loading } = useUser();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (profile) {
      setContent(profile.strategicPlan || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await userService.update(profile.uid, { strategicPlan: content });
      toast.success("Plano estratégico salvo com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar o plano.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) return null;

  return (
    <div className={`fade-in ${styles.planPage}`}>
      <Card title="Plano Estratégico de Atuação">
        <p className={styles.desc}>
          Preencha aqui o seu plano operacional para a fase atual (metas, leituras, dias de jejum e treinos).
        </p>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Cole ou digite aqui o seu Plano..."
        />
        <div className={styles.actions}>
          <Button onClick={handleSave} disabled={saving} loading={saving}>
            Salvar Plano
          </Button>
        </div>
      </Card>
    </div>
  );
}
