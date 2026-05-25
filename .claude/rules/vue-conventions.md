---
paths:
  - "src/**/*.vue"
  - "src/**/*.ts"
---

# Convenções Vue.js

- Use sempre `<script setup>` com Composition API — nunca Options API em código novo
- Props tipadas com `defineProps<{}>()`, emits com `defineEmits<{}>()`
- Nomes de componentes em PascalCase; nomes de arquivos idem
- Eventos em kebab-case no template: `@update-value`, não `@updateValue`
- Evite lógica complexa no template — mova para `computed` ou composable
- Sempre trate os três estados de UI: **loading**, **erro** e **dados vazios**
- Componentes com mais de 300 linhas devem ser divididos em sub-componentes
- Limpeza de efeitos colaterais em `onUnmounted` (requests, event listeners)
- Prefira `computed()` a `watch()` para valores derivados
