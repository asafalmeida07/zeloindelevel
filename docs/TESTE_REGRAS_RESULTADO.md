# Resultado dos Testes de Segurança

| Usuário | Caminho | Operação | Esperado | Obtido |
|---------|---------|----------|----------|--------|
| alice | `posts/1` | CREATE | SUCESSO | SUCESSO (Passou) |
| alice | `posts/2` | CREATE | RECUSA | RECUSA (Passou) |
| alice | `posts/1` | DELETE | SUCESSO | SUCESSO (Passou) |
| gestor | `gestor_projetos/1` | CREATE | SUCESSO | SUCESSO (Passou) |
| alice | `gestor_projetos/1` | READ | RECUSA | RECUSA (Passou) |
| gestor | `gestor_projetos/1` | READ | SUCESSO | SUCESSO (Passou) |
| alice | `plans/team1_alice_0` | CREATE | SUCESSO | SUCESSO (Passou) |
| bob | `plans/team1_alice_1` | CREATE | RECUSA | RECUSA (Passou) |
| alice | `cycles/team1_alice_1` | CREATE | SUCESSO | SUCESSO (Passou) |
| bob | `cycles/team1_alice_2` | CREATE | RECUSA | RECUSA (Passou) |
| alice | `users/alice/estatutos_progresso/quiz` | CREATE | SUCESSO | SUCESSO (Passou) |
| bob | `users/alice/estatutos_progresso/quiz` | CREATE | RECUSA | RECUSA (Passou) |
| alice | `users/alice/estatutos_progresso/quiz` | READ | SUCESSO | SUCESSO (Passou) |
| bob | `users/alice/estatutos_progresso/quiz` | READ | RECUSA | RECUSA (Passou) |
| gestor | `gestores` | LIST | RECUSA | RECUSA (Passou) |
| alice | `gestor_projetos/2` | CREATE | RECUSA | RECUSA (Passou) |
| alice | `gestores` | LIST | RECUSA | RECUSA (Passou) |
