# EVIDÊNCIAS - CE-R4

## Fase E: Plano e Painel (Prova na tela)
- Teste E2E com Playwright concluído com sucesso.
- O teste criou usuário, equipe, gerou plano e concluiu ciclo.
- Caminho das capturas:
  - `docs/verificacao/plano/01-cadastro.png`
  - `docs/verificacao/plano/02-painel-vazio.png`
  - `docs/verificacao/plano/03-plano.png`
  - `docs/verificacao/plano/04-plano-gerado.png`
  - `docs/verificacao/plano/05-painel-ciclo-1.png`
  - `docs/verificacao/plano/06-painel-marcado.png`
  - `docs/verificacao/plano/07-ciclo-concluido.png`

## Fase 2A: Feed fora do Painel
- Componente `<Card title="Feed">` foi removido de `src/pages/Dashboard/Dashboard.jsx`.
- Busca no código (nenhum Feed vazando de `src/pages/Feed`): `Select-String -Path src\pages\Dashboard\Dashboard.jsx -Pattern "Feed"` não retornou resultados.
- Capturas:
  - `docs/verificacao/plano/02-painel-vazio.png` (Painel sem feed)
  - `docs/verificacao/plano/08-feed.png` (Aba Feed)

## Título e ícone
- `<title>` e `favicon.svg` estão com entidades numéricas corretas.
- Aba do navegador capturada nos testes Playwright exibe "Zelo Indelével".

## 5A: Gestores
- E-mails de gestor (4 e-mails) dependem de banco de dados e NENHUM está versionado no código.
- Status: AGUARDA CADASTRO NA TELA ACESSOS. O gestor mestre fará os 4 inserts.
- Regra de recusa de não-gestores testada com sucesso em `docs/TESTE_REGRAS_RESULTADO.md`.

## Contraste do Topo
- Fundo: rgba(20, 40, 75)
- Texto: #ffffff
- Ratio medido por script (`measureContrast.cjs`): 14.64:1
- Conclusão: PASSOU (≥ 4.5:1)

## Estatutos (Fase Códice)
- Hash SHA-256 de `src/content/estatutos.md`: 57559BD377CD9A8C4F49B88E7A90AAD5F5266BC75FEEE4C52929C039A1E4E44F (Idêntico ao anexoB.txt)
- Diagramas: presentes no código e no `anexoB.txt`.
- Capturas Códice responsivo:
  - `docs/verificacao/plano/09-estatutos-1280.png`
  - `docs/verificacao/plano/10-estatutos-390.png`

## Regras de Segurança
- `docs/TESTE_REGRAS_RESULTADO.md` gerado usando Emulador Firebase + `@firebase/rules-unit-testing`.
- Todas as validações (gestores, plans, cycles, posts) passaram. 100% de sucesso nos asserts.
