---
paths:
  - "src/**/*.vue"
  - "src/**/*.ts"
  - "src/**/*.js"
---

# Princípios de Reutilização de Código

- **Regra de três**: ao repetir lógica pela terceira vez, extraia para composable ou utilitário
- Composables em `src/composables/` com prefixo `use`: `usePatientSearch.ts`
- Funções utilitárias puras (sem estado, sem efeitos) em `src/utils/`
- Constantes compartilhadas em `src/constants/` — não repita strings/números mágicos
- Ao criar abstração, mantenha a interface simples — não antecipe casos futuros hipotéticos
- Evite prop drilling acima de 2 níveis: use `provide/inject` ou Pinia store
- Componentes base em `src/components/base/` — sem lógica de negócio, só UI
