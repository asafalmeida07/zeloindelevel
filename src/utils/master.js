// UIDs com poder de "conta mestre" (super-admin global).
// Definidos via variável de ambiente VITE_MASTER_UIDS (separados por vírgula).
// A interface usa isto para exibir o painel; as REGRAS do Firestore validam
// de verdade através do documento config/app (masterUids). Os dois devem bater.
export const MASTER_UIDS = (import.meta.env.VITE_MASTER_UIDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const isMasterUid = (uid) => !!uid && MASTER_UIDS.includes(uid);
