---
paths:
  - "src/components/**"
  - "src/views/**"
  - "src/pages/**"
---

# Guidelines de UX e Componentes

- Todo componente assíncrono deve comunicar: **loading**, **erro** e **estado vazio**
- Ações destrutivas (deletar registro, finalizar atendimento) exigem **confirmação explícita**
- Mensagens de erro em português e **acionáveis**: diga o que aconteceu e o que fazer
- `aria-label` obrigatório em ícones sem texto visível (botões só com ícone)
- Formulários validam **inline** (por campo, ao sair do campo) — não só no submit
- Cores não podem ser o **único** indicador de estado (considere daltonismo)
- Foco visível em todos os elementos interativos — não remova `outline` sem alternativa
- Máximo 3 cliques para atingir qualquer ação principal do fluxo hospitalar
