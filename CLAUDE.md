# hospital_scale — Instruções do Projeto

Aplicação Vue 3 para gestão hospitalar (escala, agendamentos, pacientes).

## Stack

- Vue 3 + `<script setup>` (Composition API)
- Vite como bundler
- Axios para integração com APIs REST
- Vitest para testes

## Estrutura de pastas esperada

```
src/
  components/        # Componentes reutilizáveis
    base/            # Primitivos (BaseButton, BaseInput, etc.)
  views/             # Páginas (mapeadas no router)
  composables/       # Lógica reutilizável (use*.ts)
  stores/            # Pinia stores
  http/              # Instância Axios e interceptors
  services/          # Serviços de domínio (chamam a API)
  utils/             # Funções puras utilitárias
  constants/         # Constantes e enums
  types/             # Tipos TypeScript compartilhados
tests/
  unit/
  component/
  integration/
  fixtures/
```

## Convenções gerais

- Idioma do código: inglês (variáveis, funções, componentes)
- Mensagens de UI e comentários: português brasileiro
- Nunca armazenar dados sensíveis de pacientes em localStorage/sessionStorage
- Todo fluxo assíncrono trata loading, erro e estado vazio
- Commits em português seguindo Conventional Commits

## Agentes disponíveis

Os agentes abaixo são carregados **sob demanda** pelo Claude conforme o contexto:

| Agente | Acionar quando... |
|---|---|
| `ux-designer` | Avaliar UX, acessibilidade, fluxo de usuário |
| `frontend-patterns` | Padrões arquiteturais, SOLID, design de componentes |
| `code-reuse` | Identificar duplicação, extrair composables |
| `test-specialist` | Escrever ou revisar testes |
| `vuejs-specialist` | Componentes Vue, Pinia, Vue Router, performance |
| `axios-integration` | Configurar Axios, criar serviços de API |
