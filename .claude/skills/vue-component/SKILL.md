---
name: vue-component
description: Cria um novo componente Vue 3 seguindo todas as boas práticas do projeto — script setup, props tipadas, emits declarados, estados de loading/erro/vazio, acessibilidade básica e estrutura de arquivo padronizada.
user-invocable: true
argument-hint: "[NomeDoComponente] [descrição breve do que faz]"
allowed-tools:
  - Read
  - Glob
  - Write
  - LS
---

# Vue Component Creator

Crie um componente Vue 3 chamado **$0** — $1

## Antes de criar

1. Verifique se já existe componente similar:
```!
find /home/gilvan/tinellus/hospital_scale/src/components -name "*$0*" 2>/dev/null
```

2. Consulte componentes existentes para manter consistência:
```!
ls /home/gilvan/tinellus/hospital_scale/src/components/ 2>/dev/null
```

## Template de componente

Crie em `src/components/$0.vue`:

```vue
<script setup lang="ts">
// Props com tipagem explícita
const props = defineProps<{
  // defina as props aqui
}>()

// Emits com tipagem
const emit = defineEmits<{
  // 'evento': [param: Tipo]
}>()

// Estado local (mínimo necessário)
// const loading = ref(false)
// const error = ref<string | null>(null)
</script>

<template>
  <!-- Sempre tratar os 3 estados: loading, erro e dados vazios -->
  <!-- Estado de loading -->
  <!-- <div v-if="loading" aria-busy="true">Carregando...</div> -->

  <!-- Estado de erro -->
  <!-- <div v-else-if="error" role="alert">{{ error }}</div> -->

  <!-- Estado normal -->
  <!-- <div v-else> conteúdo </div> -->
</template>
```

## Checklist do componente criado

- [ ] `<script setup lang="ts">` (ou sem `lang="ts"` se JS puro)
- [ ] Props definidas com `defineProps<{}>()` e tipadas
- [ ] Emits declarados com `defineEmits<{}>()`
- [ ] Template trata loading, erro e estado vazio (se assíncrono)
- [ ] `aria-label` em elementos interativos sem texto
- [ ] Nenhuma lógica de negócio inline no template
- [ ] Componente com responsabilidade única
