---
name: test-coverage
description: Analisa a cobertura de testes de um arquivo ou módulo, identifica cenários não testados e sugere os testes mais importantes a adicionar ordenados por risco/impacto.
user-invocable: true
argument-hint: "[caminho/do/arquivo.ts ou src/composables/]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - LS
---

# Test Coverage Analysis

Analise a cobertura de testes para: **$ARGUMENTS**

## Passo 1 — Mapear o código de produção

Leia os arquivos em `$ARGUMENTS` e liste:
- Todas as funções/métodos
- Todos os branches de lógica (`if`, `switch`, operadores ternários)
- Todos os estados possíveis (loading, error, success, empty)
- Casos de borda identificados (valores null/undefined, listas vazias, limites)

## Passo 2 — Mapear os testes existentes

```!
find /home/gilvan/tinellus/hospital_scale/tests -name "*.spec.*" -o -name "*.test.*" 2>/dev/null | sort
```

Leia os arquivos de teste relevantes e mapeie o que já está coberto.

## Passo 3 — Executar cobertura (se configurada)

```!
cd /home/gilvan/tinellus/hospital_scale && npx vitest run --coverage 2>/dev/null | tail -30 || echo "Cobertura não configurada ainda"
```

## Passo 4 — Análise de gaps

Compare o mapeamento do código com os testes existentes. Identifique:

| Cenário não testado | Risco | Complexidade para testar |
|---|---|---|
| [cenário] | Alta/Média/Baixa | Fácil/Médio/Difícil |

## Critérios de risco para sistema hospitalar

**Alto risco** (deve ter cobertura ≥90%):
- Cálculos médicos ou de dosagem
- Validações de entrada de dados clínicos
- Lógica de autorização e permissão
- Fluxos de agendamento críticos

**Médio risco** (cobertura ≥80%):
- Composables de estado (loading/error/data)
- Serviços de API
- Transformações de dados

**Baixo risco** (cobertura ≥60%):
- Componentes puramente visuais
- Utilitários de formatação simples

## Formato de resposta

```
## Resumo de cobertura
- Funções cobertas: X/Y
- Branches cobertos: X/Y
- Cobertura estimada: ~X%

## 🔴 Cenários críticos não testados
[ordenados por risco]

## 🟡 Cenários importantes não testados
[...]

## Próximos passos recomendados
[3-5 testes a escrever, em ordem de prioridade]
```
