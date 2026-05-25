<script setup>
import { ref, computed, reactive } from 'vue'
import BaseModal from './base/BaseModal.vue'
import BaseInput from './base/BaseInput.vue'
import BaseSelect from './base/BaseSelect.vue'
import BaseButton from './base/BaseButton.vue'
import { CATEGORIAS } from '../constants/index.js'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

// O evento 'salvo' passa os dados para o pai, que chama a API e retorna
// uma Promise. Se a Promise rejeitar com detalhes[], o modal exibe inline.
const emit = defineEmits(['close', 'salvo'])

const CATEGORIA_OPTIONS = Object.entries(CATEGORIAS).map(([value, label]) => ({ value, label }))

const form = reactive({
  nome: '',
  crm: '',
  categoria: '',
  cargaHorariaSemanal: '',
})

const erros = reactive({
  nome: '',
  crm: '',
  categoria: '',
  cargaHorariaSemanal: '',
  geral: '',
})

const loading = ref(false)

const labelCrm = computed(() => {
  return form.categoria === 'MEDICO' ? 'CRM' : 'COREN / Identificação'
})

function limparFormulario() {
  form.nome = ''
  form.crm = ''
  form.categoria = ''
  form.cargaHorariaSemanal = ''
  erros.nome = ''
  erros.crm = ''
  erros.categoria = ''
  erros.cargaHorariaSemanal = ''
  erros.geral = ''
}

function fechar() {
  limparFormulario()
  emit('close')
}

function validarLocal() {
  let valido = true
  erros.nome = ''
  erros.crm = ''
  erros.categoria = ''
  erros.cargaHorariaSemanal = ''
  erros.geral = ''

  if (!form.nome.trim()) {
    erros.nome = 'Nome é obrigatório.'
    valido = false
  }
  if (!form.categoria) {
    erros.categoria = 'Categoria é obrigatória.'
    valido = false
  }
  if (!form.cargaHorariaSemanal || Number(form.cargaHorariaSemanal) <= 0) {
    erros.cargaHorariaSemanal = 'Informe uma carga horária válida.'
    valido = false
  }
  return valido
}

async function salvar() {
  if (!validarLocal()) return

  loading.value = true
  erros.geral = ''

  const dados = {
    nome: form.nome.trim(),
    crm: form.crm.trim(),
    categoria: form.categoria,
    cargaHorariaSemanal: Number(form.cargaHorariaSemanal),
  }

  // O pai (App.vue) deve retornar uma Promise via handler do evento.
  // Se o pai não retorna Promise (emit normal), funciona como fire-and-forget
  // mas para tratar erros de API precisamos que o pai propague a Promise.
  // A solução é emitir um callback que o pai chama com a Promise.
  // Implementamos com uma Promise local que o pai resolve/rejeita.
  try {
    await new Promise((resolve, reject) => {
      emit('salvo', dados, resolve, reject)
    })
    fechar()
  } catch (e) {
    // Tratar erros de campo vindos da API (detalhes[])
    if (e && e.detalhes && e.detalhes.length > 0) {
      e.detalhes.forEach((detalhe) => {
        const campo = detalhe.campo || detalhe.field
        if (campo && campo in erros) {
          erros[campo] = detalhe.mensagem || detalhe.message || String(detalhe)
        }
      })
      if (!Object.keys(erros).some((k) => k !== 'geral' && erros[k])) {
        erros.geral = e.message || 'Erro ao salvar profissional.'
      }
    } else {
      erros.geral = (e && e.message) || 'Erro ao salvar profissional.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <BaseModal :open="open" title="Novo Profissional" @close="fechar">
    <form class="form-profissional" @submit.prevent="salvar" novalidate>
      <BaseInput
        v-model="form.nome"
        label="Nome completo"
        placeholder="Ex: Dra. Ana Silva"
        :error="erros.nome"
        required
      />

      <BaseSelect
        v-model="form.categoria"
        label="Categoria"
        :options="CATEGORIA_OPTIONS"
        placeholder="Selecione a categoria..."
        :error="erros.categoria"
        required
      />

      <BaseInput
        v-model="form.crm"
        :label="labelCrm"
        placeholder="Ex: 123456-SP"
        :error="erros.crm"
      />

      <BaseInput
        v-model="form.cargaHorariaSemanal"
        label="Carga horária semanal (horas)"
        type="number"
        placeholder="Ex: 36"
        :error="erros.cargaHorariaSemanal"
        required
      />

      <p v-if="erros.geral" class="form-profissional__erro-geral" role="alert">
        {{ erros.geral }}
      </p>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="fechar" :disabled="loading">
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" :loading="loading" @click="salvar">
        Salvar
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.form-profissional {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__erro-geral {
    font-size: 13px;
    color: var(--color-danger);
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 10px 12px;
    margin: 0;
  }
}
</style>
