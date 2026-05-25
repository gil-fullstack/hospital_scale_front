---
name: extract-composable
description: Extrai lógica repetida ou complexa de componentes Vue para um composable reutilizável (use*). Analisa o código-fonte, propõe a interface do composable, implementa e atualiza os pontos de uso.
user-invocable: true
argument-hint: "[caminho/do/componente.vue] ou ['descrição da lógica a extrair']"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - LS
---

# Extract Composable

Extraia a lógica para um composable reutilizável a partir de: **$ARGUMENTS**

## Processo

### 1. Análise
- Leia o arquivo especificado
- Identifique a lógica candidata à extração:
  - Estado interno (`ref`, `reactive`) com lógica associada
  - Watchers e computed que podem ser isolados
  - Lógica assíncrona (loading + error + data)
  - Padrões que aparecem em outros componentes (busque com Grep)

### 2. Critérios para extrair
✅ Extraia se:
- A lógica tem estado próprio e comportamento associado
- A mesma lógica aparece (ou provavelmente aparecerá) em 2+ lugares
- O componente ficaria mais simples e legível sem essa lógica

⚠️ Não extraia se:
- É lógica específica de UM componente sem chance de reuso
- A extração tornaria a interface do composable mais complexa que o código original

### 3. Implementação

Crie o composable em `src/composables/use[Nome].ts`:

```typescript
// Estrutura padrão de composable
export function use[Nome](/* parâmetros */) {
  // Estado interno
  const estado = ref(valorInicial)

  // Computed derivados
  const derivado = computed(() => /* ... */)

  // Ações
  async function acao() {
    /* ... */
  }

  // Cleanup (se necessário)
  onUnmounted(() => {
    /* cleanup */
  })

  // Expor apenas o necessário
  return { estado, derivado, acao }
}
```

### 4. Atualizar pontos de uso
- Substitua a lógica original no componente pelo uso do composable
- Se outros componentes têm lógica similar, atualize-os também

## Formato de resposta

1. **Análise**: O que vai ser extraído e por quê
2. **Interface do composable**: Parâmetros, estado exposto e ações
3. **Código do composable** (`src/composables/use[Nome].ts`)
4. **Componente atualizado**: Como fica o componente após a extração
5. **Outros usos**: Se há outros arquivos para atualizar
