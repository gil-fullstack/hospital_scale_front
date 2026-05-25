---
name: pattern-suggest
description: Analisa um componente, feature ou problema de design e sugere o design pattern mais adequado para o contexto Vue.js. Explica o padrão, mostra implementação concreta e aponta trade-offs.
user-invocable: true
argument-hint: "[descrição do problema ou caminho/do/componente.vue]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - LS
---

# Design Pattern Suggestion

Analise e sugira o design pattern mais adequado para: **$ARGUMENTS**

## Processo de análise

1. Se for um arquivo, leia-o com Read
2. Identifique o problema de design atual
3. Avalie os padrões candidatos
4. Recomende o mais adequado para o contexto

## Padrões a considerar

**Quando o comportamento varia por tipo/contexto:**
→ **Strategy** — encapsula algoritmos intercambiáveis

**Quando múltiplos componentes precisam reagir a um evento:**
→ **Observer / Event Bus** — via Pinia store ou mitt

**Quando a criação de objetos é complexa ou dinâmica:**
→ **Factory** — centraliza e encapsula a criação

**Quando uma API externa é complexa demais para o componente:**
→ **Facade** — simplifica através de um serviço de domínio

**Quando precisa adicionar comportamento sem herança:**
→ **Decorator** — composable que envolve outro composable

**Quando vários componentes precisam de dados sem prop drilling:**
→ **Provider (provide/inject)** ou **Pinia Store**

**Quando componentes trabalham juntos com API fluente:**
→ **Compound Components** — ex: `<Table>` + `<TableRow>`

**Quando lógica stateful é repetida em múltiplos componentes:**
→ **Composable Pattern** — extrai em `use*()`

**Quando acesso a dados deve ser abstraído:**
→ **Repository Pattern** — `usePatientRepository()`

## Formato de resposta

```
## Diagnóstico
[O que está errado ou pode melhorar no design atual]

## Padrão recomendado: [Nome]
[Por que este padrão resolve o problema específico]

## Implementação
[Código concreto usando os arquivos do projeto]

## Trade-offs
✅ Vantagens: ...
⚠️ Cuidados: ...
❌ Quando NÃO usar: ...
```
