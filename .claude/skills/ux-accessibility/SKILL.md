---
name: ux-accessibility
description: Verifica conformidade de acessibilidade WCAG 2.1 AA em um componente ou diretório. Identifica ausência de aria-labels, problemas de contraste, navegação por teclado quebrada, ordem de foco incorreta e dependências exclusivas de cor.
user-invocable: true
argument-hint: "[caminho/do/componente.vue ou src/components/]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - LS
---

# Accessibility Check — WCAG 2.1 AA

Verifique a conformidade de acessibilidade em: **$ARGUMENTS**

## Checklist de verificação

### Conteúdo semântico
- [ ] Elementos HTML semânticos usados corretamente (`<button>`, `<nav>`, `<main>`, `<article>`)
- [ ] `<img>` sem `alt` ou com `alt=""` apenas quando decorativo
- [ ] Links com texto descritivo (não "clique aqui" ou "saiba mais")
- [ ] Headings em hierarquia lógica (h1 → h2 → h3, sem pular níveis)

### ARIA
- [ ] `aria-label` em todos os ícones interativos sem texto visível
- [ ] `aria-describedby` em campos de formulário com instruções adicionais
- [ ] `aria-live` em regiões que atualizam dinamicamente (notificações, status)
- [ ] `role` correto quando elemento HTML não é semântico o suficiente
- [ ] Não use `aria-*` onde HTML nativo resolveria

### Formulários
- [ ] `<label>` associado a cada `<input>` (via `for` ou encapsulamento)
- [ ] Mensagens de erro associadas ao campo com `aria-describedby`
- [ ] Campos obrigatórios com `required` e indicador visual
- [ ] Não depende apenas de placeholder como label

### Teclado e foco
- [ ] Todos os elementos interativos acessíveis por Tab
- [ ] Foco visível (não removido com `outline: none` sem alternativa)
- [ ] Modais: foco fica preso dentro do modal enquanto aberto (focus trap)
- [ ] Esc fecha modais e dropdowns
- [ ] Ordem de foco segue ordem visual lógica

### Cor e contraste
- [ ] Contraste de texto ≥ 4.5:1 (texto normal) ou ≥ 3:1 (texto grande/bold)
- [ ] Informação de estado não depende exclusivamente de cor
- [ ] Links distinguíveis do texto comum por mais do que cor

## Formato de resposta

Liste cada problema encontrado com:
- **Localização**: linha ou seção no código
- **Critério WCAG violado**: ex. "1.3.1 Info and Relationships (A)"
- **Impacto**: quem é afetado (usuários de leitor de tela, navegação por teclado, etc.)
- **Correção**: código concreto para resolver
