---
name: solid-check
description: Avalia um componente, composable ou serviço em relação aos princípios SOLID aplicados ao frontend Vue.js. Identifica violações com exemplos concretos e sugere refatorações.
user-invocable: true
argument-hint: "[caminho/do/arquivo.vue ou caminho/do/composable.ts]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - LS
---

# SOLID Check

Avalie a conformidade SOLID em: **$ARGUMENTS**

## Checklist SOLID para Vue/Frontend

### S — Single Responsibility Principle
- [ ] O componente tem **uma única razão para mudar**?
- [ ] Há lógica de negócio misturada com lógica de apresentação?
- [ ] O composable faz apenas **uma coisa**?
- [ ] Está acessando API, transformando dados E gerenciando estado?

### O — Open/Closed Principle
- [ ] O componente pode ser **estendido via props e slots** sem modificar seu código?
- [ ] Comportamento novo exige alterar o componente ou pode ser configurado?
- [ ] Existem `if/switch` por "tipo" que crescem a cada feature?

### L — Liskov Substitution Principle
- [ ] Componentes filhos podem substituir o pai **sem quebrar quem os usa**?
- [ ] Um componente especializado respeita o contrato de props/emits do pai?

### I — Interface Segregation Principle
- [ ] Props são **específicas** ao componente ou há um objeto genérico `options/config`?
- [ ] O componente recebe props que ele nunca usa?
- [ ] Composables expõem **apenas o que é necessário** para quem os usa?

### D — Dependency Inversion Principle
- [ ] O componente depende de **composables/interfaces** ou de implementações concretas?
- [ ] É possível trocar o serviço de API sem alterar o componente?
- [ ] Referências diretas a `axios`, `localStorage`, `router` estão escondidas atrás de abstrações?

## Formato de resposta

Para cada princípio:
```
### [Princípio] — [✅ OK | ⚠️ Atenção | ❌ Violação]

**Situação atual:** [o que foi encontrado]
**Problema:** [qual é o impacto da violação]
**Refatoração sugerida:** [código concreto]
```
