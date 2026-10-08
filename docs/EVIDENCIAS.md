# Evidências (Zelo Indelével)

## Parte A
- Deploy publicado e status Vercel validado no ramo main do github.
- Firebase e projeto linkados com domínios autorizados checados pelo Capitão.

## Parte B
- Script tests/testE2E.cjs, tests/testE2E_rapid.cjs e tests/testE2E_fail.cjs rodam localmente. A interface desfaz clique (falha otimista) em caso de erro na rede.
- Teste de regras de postagem (tests/testRules.js) executa 12 casos reais contra o emulador local usando a porta 8080.
- Nenhuma falha identificada nas regras de segurança; Gestor (Parte 5A) validado isolando leitura e escrita de projetos e painéis por autenticação.

## Parte C
- Título configurado com entidades numéricas.
- Ícone favicon.svg validado: 51c9c0dd402555d60c3f049be765810f225612efdc259fc2e8f57275c0c2a75e.
- Contraste validado em docs/CONTRAST_RESULTS.md com 20 pares (> 4.5:1).
- Os 4 e-mails de gestores solicitados estão no arquivo não-versionado scripts/gestores.local.json. 
- A leitura das autorizações de Gestor é puramente baseada no banco real, evitando que qualquer vazamento ocorra por código do app.
- Estatutos e Telas Desktop (1280px) e Mobile (390px) disponíveis para conferência; diagramas renderizados sem crash, e quiz validado.

## Parte D
- O clique real via E2E foi consertado expandindo as touch targets com um pseudo-elemento CSS (44x44px), evitando que o Playwright ou usuários percam cliques no limite de toques nativos.
- ESLint configurado de forma robusta e livre de erros (somente avisos de Fast Refresh).
- Todos os testes refatorados para a pasta tests/.
