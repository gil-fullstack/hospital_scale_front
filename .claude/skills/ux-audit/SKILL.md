---
name: ux-audit
description: Realiza uma auditoria completa de UX em um componente ou página Vue. Analisa fluxo do usuário, hierarquia visual, feedback de estado, consistência e acessibilidade. Gera relatório priorizado com problemas críticos, importantes e sugestões.
user-invocable: true
argument-hint: "[caminho/do/componente.vue ou nome da view]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - LS
---

# UX Audit

Realize uma auditoria de UX completa no arquivo ou componente: **$ARGUMENTS**

## Passos

1. **Leia o componente/view** especificado em `$ARGUMENTS`
2. Se for uma view, busque os componentes filhos que ela usa
3. Analise as 5 dimensões abaixo
4. Gere o relatório no formato especificado

## Dimensões de análise

### 1. Fluxo do usuário
- O caminho até a ação principal é direto (≤3 interações)?
- Há pontos de confusão ou decisões desnecessárias?
- O usuário sabe onde está e como voltar?

### 2. Hierarquia visual e informação
- Informações críticas têm destaque adequado?
- Agrupamentos visuais correspondem a agrupamentos funcionais?
- Terminologia clara para o contexto hospitalar?

### 3. Feedback de estado
- **Loading**: há indicação visual enquanto dados carregam?
- **Erro**: a mensagem diz o que aconteceu E o que fazer?
- **Sucesso**: confirmação clara da ação concluída?
- **Vazio**: estado vazio orientado à ação?

### 4. Consistência
- Mesma ação usa o mesmo padrão visual em todo o componente?
- Cores de status têm significado único e consistente?

### 5. Acessibilidade (WCAG 2.1 AA)
- `aria-label` em todos os ícones sem texto visível?
- Navegação por teclado funcional (Tab, Enter, Escape)?
- Foco visível em elementos interativos?
- Informação não depende apenas de cor?

## Formato do relatório

```
# Auditoria UX — [Nome do componente]

## Resumo executivo
[2-3 frases sobre o estado geral]

## 🔴 Problemas críticos (bloqueiam uso ou causam erro)
- **[Problema]**: [descrição] → [solução]

## 🟡 Problemas importantes (degradam experiência)
- **[Problema]**: [descrição] → [solução]

## 🟢 Sugestões de melhoria
- **[Sugestão]**: [descrição] → [implementação]
```
