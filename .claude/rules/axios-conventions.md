---
paths:
  - "src/http/**"
  - "src/services/**"
  - "src/api/**"
---

# Convenções de Integração HTTP

- Nunca use `axios` global — sempre a instância em `src/http/axios.ts`
- Serviços retornam o dado tipado, nunca o `AxiosResponse` bruto
- Erros HTTP são tratados nos interceptors — não repita try/catch em cada serviço
- Tipagem explícita para request e response: `http.get<Patient[]>('/endpoints')`
- Endpoints em constantes em `src/api/endpoints.ts` — nunca strings literais espalhadas
- Cancelamento de requests via `AbortController` + `onUnmounted` em composables
- Dados sensíveis (CPF, token) nunca em query params — use headers ou body
- `baseURL` sempre via `import.meta.env.VITE_API_URL`, nunca hardcoded
