import React from 'react';
import Card from '../../components/Card/Card.jsx';
import styles from './Estatutos.module.css';

export default function Estatutos() {
  return (
    <div className={`fade-in ${styles.page}`}>
      <Card title="Os Cinco Estatutos">
        <p>A bússola moral e espiritual do Capitão.</p>
        <div className={styles.estatutoList}>
          <div className={styles.estatuto}>
            <h3 style={{color: 'var(--color-sustentacao)'}}>1. Sustentação</h3>
            <p>O fundamento da nossa caminhada. Fé inabalável e base forte na Palavra.</p>
          </div>
          <div className={styles.estatuto}>
            <h3 style={{color: 'var(--color-avivamento)'}}>2. Avivamento</h3>
            <p>O fogo constante, a paixão pelas almas e o clamor incessante por um despertar.</p>
          </div>
          <div className={styles.estatuto}>
            <h3 style={{color: 'var(--color-fortalecimento)'}}>3. Fortalecimento</h3>
            <p>A constância no treinamento. Exercício espiritual e físico diário.</p>
          </div>
          <div className={styles.estatuto}>
            <h3 style={{color: 'var(--color-comprometimento)'}}>4. Comprometimento</h3>
            <p>A aliança inquebrável com a missão. Não desistimos, não recuamos.</p>
          </div>
          <div className={styles.estatuto}>
            <h3 style={{color: 'var(--color-direcionamento)'}}>5. Direcionamento</h3>
            <p>A visão clara do futuro, o foco no propósito e a sabedoria para guiar outros.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
