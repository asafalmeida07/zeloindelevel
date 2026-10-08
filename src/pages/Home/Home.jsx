import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card/Card.jsx";
import styles from "./Home.module.css";
import { useGestorAuth } from "../../hooks/useGestorAuth.js";
import { db } from "../../firebase/config.js";
import { collection, getCountFromServer } from "firebase/firestore";

export default function Home() {
  const { isGestor } = useGestorAuth();
  const [stats, setStats] = useState({ users: "—", posts: "—" });

  useEffect(() => {
    async function loadStats() {
      try {
        const uSnap = await getCountFromServer(collection(db, "users"));
        const pSnap = await getCountFromServer(collection(db, "posts"));
        setStats({
          users: uSnap.data().count || 0,
          posts: pSnap.data().count || 0
        });
      } catch (e) {
        setStats({ users: "—", posts: "—" });
      }
    }
    if (isGestor) loadStats();
  }, [isGestor]);

  return (
    <div className={`fade-in ${styles.page}`}>
      <Card title="Zelo Indelével — central de gestão">
        <p className={styles.introText}>
          Este site é a central de gestão do Zelo Indelével: o lugar onde a liderança acompanha os projetos e os objetivos do ministério, e onde cada pessoa vive, registra e compartilha a sua caminhada.
        </p>

        <section className={styles.section}>
          <h2 className={styles.h2}>O que é o Zelo Indelével</h2>
          <p>
            O Zelo Indelével é a materialização das engrenagens dentro do Dokmos, o ministério de adolescentes. Tudo influi para ele. Os doze macro projetos <em>são</em> o Zelo Indelével: não são supervisionados por ele, eles o constituem.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Como o site funciona</h2>
          <div className={styles.cardsGrid}>
            <Link to="/" className={styles.siteCard}>
              <h3>Início</h3>
              <p>Esta página. Explica o projeto e o site e mostra, em números, o que está acontecendo.</p>
            </Link>
            <Link to="/apenas-continue" className={styles.siteCard}>
              <h3>Apenas Continue</h3>
              <p>É o acompanhamento do seu caminho, feito em ciclos. O MAPA divide a jornada em 360 fases de 43 dias, de 05/10/2026 a 20/02/2069. Você programa o seu plano e cumpre as tarefas de cada ciclo no Painel. Ao concluir um ciclo, você sobe um nível. O ciclo não expira à meia-noite: se terminar depois, ele continua valendo até ser concluído.</p>
            </Link>
            <Link to="/plano" className={styles.siteCard}>
              <h3>Plano</h3>
              <p>Aqui você programa, por ciclo, as tarefas do seu caminho. Cada pessoa edita o seu próprio plano, e as mudanças valem dali para a frente.</p>
            </Link>
            <Link to="/apenas-continue" className={styles.siteCard}>
              <h3>Painel</h3>
              <p>Mostra o ciclo atual: o que programar e marcar como feito. Quando você conclui o ciclo, o próximo aparece.</p>
            </Link>
            <Link to="/feed" className={styles.siteCard}>
              <h3>Feed</h3>
              <p>Espaço para compartilhar o que você está vivendo, com texto, fotos, vídeo e links. Cada publicação escolhe uma das cinco categorias: Sustentação, Avivamento, Fortalecimento, Comprometimento ou Direcionamento. Todos os usuários podem ver o Feed.</p>
            </Link>
            <Link to="/gestor" className={styles.siteCard}>
              <h3>Gestor Ministerial</h3>
              <p>Área restrita a quem recebeu acesso. É onde a liderança acompanha os doze projetos, as entregas de cada fase do MAPA e os objetivos do Zelo Indelével.</p>
            </Link>
            <Link to="/estatutos" className={styles.siteCard}>
              <h3>Os Cinco Estatutos</h3>
              <p>Página que ensina o sistema: o que são os Estatutos, como se ligam e como se vive cada um.</p>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Quem vê o quê</h2>
          <ul className={styles.list}>
            <li>Todo usuário logado vê o Início, o Apenas Continue (com o seu Plano e o seu Painel), o Feed e a página dos Cinco Estatutos.</li>
            <li>Só quem recebeu acesso vê o Gestor Ministerial e os números de gestão do Início.</li>
            <li>O Início mostra apenas números do conjunto, nunca nomes, fotos ou classificações de pessoas.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Por onde começar</h2>
          <ol className={styles.numberedList}>
            <li>Entre no Apenas Continue e abra o Plano.</li>
            <li>Programe as tarefas do seu primeiro ciclo.</li>
            <li>Volte ao Painel todos os dias e marque o que cumpriu.</li>
            <li>Conclua o ciclo e acompanhe o seu nível subir.</li>
            <li>Conte o que está vivendo no Feed.</li>
            <li>Leia Os Cinco Estatutos para entender o sistema por inteiro.</li>
          </ol>
        </section>
      </Card>

      {isGestor ? (
        <Card title="Indicadores (Gestão)" style={{marginTop: '20px'}}>
          <div className={styles.grid}>
            <div className={styles.metricCard}>
              <div className={styles.metricTitle}>Usuários Cadastrados</div>
              <div className={styles.metricValue}>{stats.users}</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricTitle}>Postagens no Feed</div>
              <div className={styles.metricValue}>{stats.posts}</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricTitle}>Postagens Sem Categoria</div>
              <div className={styles.metricValue}>0</div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
