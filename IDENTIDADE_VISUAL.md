# Identidade Visual — Os Cinco Pilares

Este documento define a única Fonte de Verdade para o sistema de cores do projeto, baseada nos Cinco Pilares.

## 1. A Paleta (Os Cinco Pilares)

Não utilize valores hexadecimais soltos no projeto. Utilize exclusivamente os Design Tokens mapeados em `tokens.css`.

| Ordem | Pilar | Hex | Token (Base) | Função na Interface |
|---|---|---|---|---|
| 1 | **Sustentação** | `#7A1B1B` | `--pilar-sustentacao` | Erros, Alertas, Pendências, `var(--danger)` |
| 2 | **Avivamento** | `#E8731A` | `--pilar-avivamento` | Ação, Destaque, Botões principais, `var(--accent)` |
| 3 | **Fortalecimento**| `#1F4D36` | `--pilar-fortalecimento`| Conclusão, Sucesso, Ciclos concluídos, `var(--success)` |
| 4 | **Comprometimento**|`#F4EFE4` | `--pilar-comprometimento`| Fundo do App (`var(--bg)`), Texto sobre escuros |
| 5 | **Direcionamento**| `#14284B` | `--pilar-direcionamento` | Texto principal (`var(--text)`), Menu, Textos de ação |

## 2. Tema Ativo: Tema Claro

O projeto roda no **Tema Claro**, usando as seguintes designações de tokens:

- **Fundo (`--bg`):** Off-white (`#F4EFE4`)
- **Superfícies (`--surface`):** Branco puro (`#FFFFFF`) para cartões e modais destacarem do fundo.
- **Texto Principal (`--text`):** Azul Escuro (`#14284B`)
- **Marcação de Concluído / Check:** Fundo Verde Escuro (`#1F4D36`), Símbolo Off-white.
- **Botões de Ação:** Fundo Laranja (`#E8731A`), Texto Azul Escuro (`#14284B`).

## 3. Tabela de Contrastes (Validação WCAG)

Todas as cores foram medidas rigorosamente contra o fundo ou sobre a base onde interagem:

| Combinação | Fundo | Texto/Ícone | Razão WCAG | Resultado |
|---|---|---|---|---|
| **Padrão de Leitura** | Comprometimento (`#F4EFE4`) | Direcionamento (`#14284B`) | **12.8:1** | Aprovado (Excelente) |
| **Alertas/Erros** | Comprometimento (`#F4EFE4`) | Sustentação (`#7A1B1B`) | **9.2:1** | Aprovado |
| **Sucesso em texto** | Comprometimento (`#F4EFE4`) | Fortalecimento (`#1F4D36`) | **8.4:1** | Aprovado |
| **Botão Principal** | Avivamento (`#E8731A`) | Direcionamento (`#14284B`) | **4.8:1** | Aprovado |
| **Botão Concluído** | Fortalecimento (`#1F4D36`) | Comprometimento (`#F4EFE4`) | **8.4:1** | Aprovado |
| **Botão Perigo** | Sustentação (`#7A1B1B`) | Comprometimento (`#F4EFE4`) | **9.2:1** | Aprovado |

**Atenção (Falha Tratada):** Laranja (`#E8731A`) sobre Off-white ou Off-white sobre Laranja possui taxa de ~2.7:1 (Abaixo do WCAG AA de 4.5:1). Portanto, o Laranja **nunca deve conter texto Off-white/Branco** nem ser usado como texto fino num fundo Off-white. Como regra do projeto, elementos laranjas (como botões primários) devem ter o texto em **Azul Escuro**.

## 4. Regras de Ouro
1. **Nada de cores novas:** Precisa de uma sombra? Use o Azul com opacidade `rgba(20, 40, 75, 0.1)`. Precisa de um traço desativado? Use o Azul escuro diluído ou um Off-white escurecido. Não fuja dos 5 pilares.
2. **Textos em Cores Escuras:** Nunca coloque texto vermelho sobre fundo verde, nem azul sobre vermelho. Separe os três blocos escuros sempre usando Off-white ou Laranja para separar as seções.
3. **Ordem de Exibição:** Ao desenhar relatórios, estatísticas ou conquistas futuras que usem as cinco cores juntas, exiba da esquerda para a direita ou de cima para baixo: Vermelho > Laranja > Verde > Off-white > Azul.
