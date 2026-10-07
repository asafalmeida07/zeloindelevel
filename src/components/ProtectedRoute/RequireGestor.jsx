import { useGestorAuth } from '../../hooks/useGestorAuth.js';
import Loading from '../components/Loading/Loading.jsx';

export default function RequireGestor({ children }) {
  const { isGestor, loading } = useGestorAuth();

  if (loading) return <Loading full label="Verificando acesso..." />;
  
  if (!isGestor) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Sem permissão</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>
          Você não tem acesso ao Gestor Ministerial.
        </p>
      </div>
    );
  }

  return children;
}


