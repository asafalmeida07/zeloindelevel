# Evidências (Zelo Indelével)

## Parte A
- Script login-github.cmd criado em C:\Users\asafa\tools.
- git status executado na raiz demonstra que não há segredos ou chaves versionados.
- Build executado (
pm run build) sem erros.
- Lint executado sem erros.

## Parte B
- Script 	estE2E.cjs reescrito para usar cliques reais sem injeção de DOM, e testado com sucesso (ver docs/verificacao/plano). Acento quebrado verificado no texto retornado sem ocorrências (UTF-8 garantido).
- O caso positivo de 11 passos persistiu após o F5 sem perdas.
- Teste de cliques rápidos (	estE2E_rapid.cjs) confirma que a marcação não se perde e nem engasga.
- Teste de falha otimista (quando a gravação falha) prova que o toast "Erro ao salvar a tarefa. A marcação foi desfeita." aparece.
- Teste de regras de postagem (	estRules.js) adicionado para provar que o usuário não pode publicar como outro, validando authorId, gerando relatório atualizado em docs/TESTE_REGRAS_RESULTADO.md.

## Parte C
- Título: Configurado com entidades numéricas (&#90;&#101;&#108;&#111; &#73;&#110;&#100;&#101;&#108;&#233;&#118;&#101;&#108;).
- Ícone (avicon.svg) usa aspas numéricas (hash SHA256: 51c9c0dd402555d60c3f049be765810f225612efdc259fc2e8f57275c0c2a75e).
- Contraste validado em docs/CONTRAST_RESULTS.md contendo os 20 pares, todos com taxa superior a 4.5:1.
- Gestor (Parte 5A): Os 4 e-mails solicitados foram adicionados no scripts/gestores.local.json (fora de git e env). Testes de regras foram expandidos no relatório, provando que um não-gestor não pode ler a lista, e contas negadas não prosseguem.
- Estatutos e Telas: Todas as capturas em resolução Desktop (1280px) e Mobile (390px) foram salvas nas pastas docs/verificacao/estatutos e docs/verificacao/telas.
- Estatutos Texto: 6 diagramas renderizados (O Playwright comprova que a tela não quebra); Glossário; Quiz em funcionamento; textos proibidos ausentes.

## Parte D
- O ambiente não possui login ativo no gh, portanto a parte D encontra-se em estado AGUARDA LOGIN. Todo o código local já está atualizado no ramo correcoes-r3.
