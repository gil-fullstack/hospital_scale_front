---
name: vue-debug
description: Diagnostica problemas de reatividade, performance e comportamento inesperado em componentes Vue 3. Analisa watchers, computed, renders desnecessários, memória de referências e problemas comuns com Pinia.
user-invocable: true
argument-hint: "[caminho/do/componente.vue] [descrição do problema]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - LS
---

# Vue Debug

Diagnostique o problema em: **$ARGUMENTS**

## Diagnóstico de reatividade

### Sintomas e causas comuns

**"O componente não atualiza quando o dado muda"**
- `reactive()` com propriedade atribuída diretamente no nível raiz (desestruturação perde reatividade)
- `ref()` acessado sem `.value` dentro de script (não no template)
- Array mutado com `push`/`splice` em `shallowRef` — use `ref()` ou `triggerRef()`
- Propriedade adicionada dinamicamente em objeto `reactive()` sem `reactive()`

**"O watcher não dispara"**
- Assistindo propriedade aninhada sem `deep: true`
- Assistindo `reactive()` diretamente — passe como getter: `watch(() => obj.prop, ...)`
- `immediate: true` esquecido quando precisa rodar no mount

**"O computed retorna valor errado"**
- Efeito colateral dentro do computed (computed deve ser puro)
- Dependência reativa não está dentro do computed (variável externa não reativa)

**"Re-renders excessivos"**
- `v-for` sem `:key` ou com `:key` não único
- Objeto/array criado inline no template (nova referência a cada render)
- Prop que é objeto recriado no pai a cada render

## Análise de performance

```!
grep -n "v-for" /home/gilvan/tinellus/hospital_scale/$0 2>/dev/null | head -20
grep -n ":key" /home/gilvan/tinellus/hospital_scale/$0 2>/dev/null | head -20
grep -n "watch\b" /home/gilvan/tinellus/hospital_scale/$0 2>/dev/null | head -20
```

## Diagnóstico de Pinia

**"Store não atualiza o componente"**
- Desestruturou o store sem `storeToRefs()`: `const { count } = store` perde reatividade
- Correto: `const { count } = storeToRefs(store)` para state/getters
- Ações podem ser desestruturadas diretamente: `const { fetch } = store`

**"Ação não reflete na UI"**
- Lógica assíncrona fora do try/finally — loading não reseta em erro
- Mutação de objeto nested sem triggerar reatividade

## Formato de diagnóstico

Para cada problema identificado:
```
### [Problema identificado]
**Causa raiz:** [o que está causando]
**Localização:** [arquivo:linha]
**Solução:** [código corrigido]
**Por que funciona:** [explicação da regra de reatividade do Vue]
```
