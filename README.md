# Apenas Continue 2.0

Aplicativo cristão de disciplina diária em **fases de 43 dias**, com equipes, ranking, feed e evolução permanente de cada usuário. React 19 + Vite + Firebase (Auth, Firestore, Storage), pronto para deploy no Vercel.

---

## Como funciona

- **Fases de 43 dias, contínuas.** A contagem parte da data de início da Fase 1 (definida ao criar a equipe). Ao terminar uma fase, a próxima começa automaticamente.
- **14 tarefas diárias**, cada uma vale **3 pontos** → 42 por dia, **1806 por fase**.
- **Nível**: completar as 14 tarefas de um dia sobe **+1 nível**. O nível **nunca** diminui nem zera.
- **Estrelas ⭐**: o 1º colocado de cada fase ganha uma estrela permanente (acumulam: ⭐⭐⭐…).
- **Ranking**: pontos → dias perfeitos → sequência → nome.
- **Feed**: ao fechar um dia perfeito (14/14), publica "Fulano concluiu o Dia N".
- **Equipes**: o admin cria a equipe e recebe um código (ex.: `MCC-48DF92`); os demais entram com o código.

---

## Rodando localmente

### 1. Pré-requisitos
- Node.js 18+
- Uma conta no [Firebase](https://console.firebase.google.com)

### 2. Instalar dependências
```bash
npm install
```

### 3. Criar o projeto no Firebase
No console do Firebase:
1. **Authentication** → ativar o provedor **Email/Senha**.
2. **Firestore Database** → criar (modo produção).
3. **Storage** → criar.
4. Em **Configurações do projeto → Seus apps → Web**, copie as chaves.

### 4. Variáveis de ambiente
Copie `.env.example` para `.env` e preencha:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 5. Publicar regras e índices
Com o [Firebase CLI](https://firebase.google.com/docs/cli) instalado e logado:
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```
(Os índices compostos do Firestore estão em `firestore.indexes.json` — sem eles o ranking/feed não consultam.)

### 6. Desenvolvimento
```bash
npm run dev
```

---

## Deploy no Vercel

1. Suba o repositório no GitHub e importe no Vercel.
2. Em **Settings → Environment Variables**, adicione as mesmas chaves `VITE_FIREBASE_*`.
3. Build command `npm run build`, output `dist` (o `vercel.json` já cuida do roteamento SPA).
4. Deploy.

---

## Estrutura

```
src/
  assets/        logo
  components/    Button, Input, Card, Avatar, StarBadge, Loading, Toast,
                 Navbar, Sidebar, TaskCard, Leaderboard, Journey,
                 ProfileEditor, ProtectedRoute
  contexts/      AuthContext, UserContext, TeamContext, PhaseContext
  firebase/      config.js
  hooks/         useAuth, useUser, useTeam, usePhase
  layouts/       AppLayout, AuthLayout
  pages/         Login, Register, ForgotPassword, TeamGate,
                 Dashboard, Profile, NotFound
  services/      auth, user, team, progress, ranking, feed, storage, champion
  styles/        tokens.css, global.css
  utils/         constants, phase, format, rank
  App.jsx  main.jsx
```

### Coleções do Firestore
`users` · `teams` · `progress` · `ranking` · `feed` · `champions` · `phases`

---

## Decisões de arquitetura

- **Sem Cloud Functions.** A apuração do campeão de uma fase (estrela + fase vencida) é feita no cliente, de forma **idempotente** (transação no documento `champions/{teamId}_{fase}`): o primeiro membro que abrir o app após o fim da fase registra o campeão uma única vez.
- **Nível por dia perfeito é concedido no máximo uma vez** por dia: o documento de progresso guarda a flag `leveled`, então marcar/desmarcar não infla o nível.
- **Ranking no honor system.** Cada usuário grava o próprio progresso e o próprio agregado em `ranking` (as regras de segurança impedem escrever em nome de outro). Ideal para grupos de confiança/discipulado.
- O agregado de ranking é atualizado a cada tarefa marcada; o painel também faz *polling* leve (8s) para refletir o progresso dos colegas.

---

*"Apenas continue."*

---

## Conta mestre (super-admin global)

Uma conta mestre enxerga e gerencia **todos os grupos** do app (painel em `/grupos`): listar grupos, abrir qualquer um para visualizar ranking/feed/jornada, e editar nome, data de início e as 14 tarefas de qualquer grupo. Ela pode operar sem pertencer a nenhum grupo.

O poder de mestre **não** é um campo que o usuário se concede — ele é validado em dois lugares que precisam bater:

### 1. Descobrir o seu UID
No console do Firebase → **Authentication → Users** → copie o **User UID** da sua conta.

### 2. Liberar na interface (Vercel)
Adicione a variável de ambiente e **redeploy**:
```
VITE_MASTER_UIDS=SEU_UID_AQUI
```
(Para mais de uma conta mestre, separe por vírgula.)

### 3. Liberar nas regras (Firestore)
As regras conferem um documento de configuração. No **Firestore → Data**, crie manualmente:

- Coleção: `config`
- Documento (ID): `app`
- Campo: `masterUids` — tipo **array** — com o(s) mesmo(s) UID(s)

Esse documento só pode ser editado pelo console (as regras bloqueiam escrita pelo app), então ninguém vira mestre sozinho. Publique as regras atualizadas (`firestore.rules`) depois de criar o documento.

> Sem o passo 3, o painel aparece mas as edições em grupos de terceiros são recusadas pela segurança. Sem o passo 2, o painel nem aparece.
