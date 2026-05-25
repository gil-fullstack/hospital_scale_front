---
name: find-duplicates
description: Busca e reporta duplicação de código no projeto — lógica repetida, templates similares, constantes duplicadas e padrões copy-paste. Prioriza por impacto e sugere onde extrair cada abstração.
user-invocable: true
argument-hint: "[diretório ou padrão de busca, ex: src/components/ ou 'useLoading']"
allowed-tools:
  - Read
  - Glob
  - Grep
  - LS
---

# Find Duplicates

Busque duplicação de código em: **$ARGUMENTS**

## O que procurar

### 1. Lógica duplicada em composables/componentes
Execute buscas por padrões comuns:

```!
cd /home/gilvan/tinellus/hospital_scale
# Buscar padrões de loading state repetidos
grep -rn "const loading = ref(false)" src/ --include="*.vue" --include="*.ts" -l

# Buscar chamadas axios repetidas sem serviço
grep -rn "axios\.\(get\|post\|put\|delete\)" src/ --include="*.vue" --include="*.ts" -l

# Buscar tratamento de erro repetido
grep -rn "catch.*error\|\.catch(" src/ --include="*.vue" --include="*.ts" -l
```

### 2. Props/interfaces duplicadas
```!
cd /home/gilvan/tinellus/hospital_scale
grep -rn "interface\|type " src/ --include="*.ts" --include="*.vue" | grep -v "node_modules"
```

### 3. Constantes e strings duplicadas
```!
cd /home/gilvan/tinellus/hospital_scale
grep -rn "const.*=.*'" src/ --include="*.ts" --include="*.vue" | sort | head -50
```

### 4. Componentes com template similar
Liste todos os componentes:
```!
find /home/gilvan/tinellus/hospital_scale/src -name "*.vue" | sort
```

Leia os arquivos identificados e compare estrutura de template.

## Critérios de prioridade

| Prioridade | Critério |
|---|---|
| 🔴 Alta | Lógica de negócio duplicada 3+ vezes |
| 🟡 Média | Padrões de UI/estado duplicados 3+ vezes |
| 🟢 Baixa | Strings/constantes duplicadas 2+ vezes |

## Formato de resposta

```
# Relatório de Duplicação

## 🔴 Alta prioridade
### [Padrão duplicado]
- Encontrado em: [arquivo1:linha, arquivo2:linha, ...]
- Abstração sugerida: [nome e local do composable/utilitário]
- Benefício: [o que melhora ao extrair]

## 🟡 Média prioridade
[...]

## 🟢 Baixa prioridade
[...]
```
