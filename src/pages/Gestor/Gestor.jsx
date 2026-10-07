import { useState } from "react";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import styles from "./Gestor.module.css";

const PROJETOS = [
  { id: 1, nome: "Acolhimento", desc: "Recepção e integração inicial." },
  { id: 2, nome: "Apelo", desc: "Acompanhamento pós-culto." },
  { id: 3, nome: "Batismo", desc: "Preparação e consolidação." },
  { id: 4, nome: "Células de Discipulado", desc: "Pastoreio nos lares." },
  { id: 5, nome: "Crescimento", desc: "Escola de líderes." },
  { id: 6, nome: "Culto", desc: "Liturgia e andamento geral." },
  { id: 7, nome: "Integração", desc: "Eventos e comunhão." },
  { id: 8, nome: "Liderança", desc: "Treinamento de capitães." },
  { id: 9, nome: "Louvor", desc: "Música e adoração." },
  { id: 10, nome: "Missões", desc: "Evangelismo criativo." },
  { id: 11, nome: "Oração", desc: "Intercessão e relógios." },
  { id: 12, nome: "Palavra", desc: "Mensagens e devocionais." }
];

export default function Gestor() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className={`fade-in ${styles.gestorPage}`}>
        <div className={styles.backBtn}>
          <Button variant="outline" onClick={() => setSelected(null)}>← Voltar para Projetos</Button>
        </div>
        <Card title={`Projeto: ${selected.nome}`}>
          <p className={styles.projectDesc} style={{fontSize: '1rem'}}>{selected.desc}</p>
          
          <div className={styles.details}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Equipe Base</div>
              <div className={styles.memberList}>
                <div className={styles.memberItem}>
                  <span className={styles.role}>Capitão de Cinquenta (Líder)</span>
                  <span className={styles.name}>Não definido</span>
                </div>
                <div className={styles.memberItem}>
                  <span className={styles.role}>Colíder</span>
                  <span className={styles.name}>Não definido</span>
                </div>
              </div>
            </div>
            
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Capitães de Dez (Missões)</div>
              <p style={{color: 'var(--text-dim)', fontSize: '0.9rem'}}>Nenhuma missão cadastrada ainda.</p>
              <Button>+ Nova Missão</Button>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Etapas do Projeto (1 a 3)</div>
              <p style={{color: 'var(--text-dim)', fontSize: '0.9rem'}}>As entregas estão atreladas às fases do MAPA.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`fade-in ${styles.gestorPage}`}>
      <Card title="Visão Geral do Zelo Indelével">
        <p style={{color: 'var(--text-dim)'}}>
          O Zelo Indelével não é uma coordenação separada, ele <b>é a união</b> destes 12 macro projetos (o Tekton).
        </p>
        
        <div className={styles.grid}>
          {PROJETOS.map(p => (
            <div key={p.id} className={styles.projectCard} onClick={() => setSelected(p)}>
              <div className={styles.projectName}>{p.nome}</div>
              <div className={styles.projectDesc}>{p.desc}</div>
              <div className={styles.meta}>
                <span>3 Etapas</span>
                <span>0 Membros</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
