// Ordem oficial do ranking: pontos > dias perfeitos > sequência > nome.
export function rankCompare(a, b) {
  return (
    (b.points || 0) - (a.points || 0) ||
    (b.perfectDays || 0) - (a.perfectDays || 0) ||
    (b.streak || 0) - (a.streak || 0) ||
    (a.name || "").localeCompare(b.name || "")
  );
}
