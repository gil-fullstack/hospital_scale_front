---
paths:
  - "**/*.spec.ts"
  - "**/*.spec.js"
  - "**/*.test.ts"
  - "**/*.test.js"
  - "tests/**"
---

# Convenções de Testes

- Use **Vitest** como framework (compatível com Vite, sem config extra)
- Estrutura **AAA**: Arrange → Act → Assert, separados por linha em branco
- Nomes descritivos: `deve [comportamento esperado] quando [condição]`
- Um comportamento por `it()` — múltiplos `expect` só se relacionados ao mesmo cenário
- Mocks com `vi.fn()`, `vi.mock()`, `vi.spyOn()`
- Limpe mocks em `afterEach`: `vi.clearAllMocks()`
- Fixtures em `tests/fixtures/` — nunca objetos grandes inline nos testes
- Testes de componente Vue com `@vue/test-utils` — use `mount` com opções mínimas
- Não testar detalhes de implementação, apenas comportamento observável pelo usuário
