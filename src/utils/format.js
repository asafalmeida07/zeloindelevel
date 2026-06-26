const WD = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MON = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export const pad = (n) => String(n).padStart(2, "0");
export const fmtDate = (dt) => `${WD[dt.getDay()]} · ${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}`;
export const fmtShort = (dt) => `${pad(dt.getDate())} ${MON[dt.getMonth()]}`;
export const todayYMD = () => {
  const n = new Date();
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
};

export function timeAgo(ts) {
  const s = (Date.now() - ts) / 1000;
  if (s < 45) return "agora";
  const m = s / 60;
  if (m < 60) return `${Math.floor(m) || 1} min`;
  const h = m / 60;
  if (h < 24) return `${Math.floor(h)} h`;
  return `${Math.floor(h / 24)} d`;
}

// Gera um código de equipe no formato XXX-XXXXXX
export function generateTeamCode(prefix = "") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const head = (prefix || rand(3)).toUpperCase().slice(0, 3).padEnd(3, "X");
  return `${head}-${rand(6)}`;
}

export const firstName = (name = "") => name.trim().split(" ")[0] || name;
