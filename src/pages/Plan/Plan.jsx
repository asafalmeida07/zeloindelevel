import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser.js";
import { useTeam } from "../../hooks/useTeam.js";
import { userService } from "../../services/userService.js";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import { useToast } from "../../components/Toast/ToastContext.jsx";
import styles from "./Plan.module.css";

export default function Plan() {
  const { profile, loading } = useUser();
  const { team } = useTeam();
  const [plans, setPlans] = useState({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (profile && profile.strategicPlan && typeof profile.strategicPlan === "object") {
      setPlans(profile.strategicPlan);
    }
  }, [profile]);

  const handleChange = (taskName, val) => {
    setPlans(p => ({ ...p, [taskName]: val }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await userService.update(profile.uid, { strategicPlan: plans });
      toast.success("Plano salvo com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar o plano.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile || !team) return null;

  return (
    <div className={`fade-in ${styles.planPage}`}>
      <Card title="Plano Estratégico por Tarefa">
        <p className={styles.desc}>
          Defina o que será feito em cada tarefa do seu ciclo. Isso aparecerá abaixo de cada tarefa no Painel.
        </p>
        <div className={styles.taskPlans}>
          {team.tasks.map((task, i) => (
            <div key={i} className={styles.taskPlan}>
              <label className={styles.taskLabel}>{task}</label>
              <textarea
                className={styles.textareaSmall}
                value={plans[task] || ""}
                onChange={(e) => handleChange(task, e.target.value)}
                placeholder={`O que você vai fazer na tarefa: ${task}?`}
              />
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <Button onClick={handleSave} disabled={saving} loading={saving}>
            Salvar Plano
          </Button>
        </div>
        <div style={{marginTop: '2rem'}}>
          <label className={styles.taskLabel}>Tarefas Extras (Emergentes)</label>
          <textarea
            className={styles.textareaSmall}
            style={{marginTop: '0.5rem'}}
            value={plans['Extras'] || ''}
            onChange={(e) => handleChange('Extras', e.target.value)}
            placeholder='Anote aqui as tarefas extras fora das 13 principais...'
          />
        </div>
      </Card>
    </div>
  );
}

