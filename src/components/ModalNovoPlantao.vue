<script setup>
import { ref, computed } from 'vue'
import BaseModal from './base/BaseModal.vue'
import BaseSelect from './base/BaseSelect.vue'
import BaseButton from './base/BaseButton.vue'
import { TURNOS } from '../constants/index.js'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  profissional: {
    type: Object,
    default: null,
  },
  data: {
    type: String, // YYYY-MM-DD
    default: '',
  },
  turnosDisponiveis: {
    type: Array,
    default: () => [],
  },
})

// O pai recebe (dados, resolve, reject) e deve chamar a API.
// Se a API falhar, o pai chama reject(erro) e o modal exibe inline.
const emit = defineEmits(['close', 'agendado'])

const turnoSelecionado = ref('')
const erroTurno = ref('')
const erroGeral = ref('')
const loading = ref(false)

const turnoOptions = computed(() =>
  props.turnosDisponiveis.map((t) => ({
    value: t,
    label: `${TURNOS[t].label} — ${TURNOS[t].horario}`,
  }))
)

const dataFormatada = computed(() => {
  if (!props.data) return ''
  const [ano, mes, dia] = props.data.split('-')
  const d = new Date(Number(ano), Number(mes) - 1, Number(dia))
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
})

function fechar() {
  turnoSelecionado.value = ''
  erroTurno.value = ''
  erroGeral.value = ''
  emit('close')
}

async function agendar() {
  erroTurno.value = ''
  erroGeral.value = ''

  if (!turnoSelecionado.value) {
    erroTurno.value = 'Selecione um turno.'
    return
  }

  loading.value = true

  const dados = {
    profissionalId: props.profissional.id,
    data: props.data,
    turno: turnoSelecionado.value,
  }

  try {
    await new Promise((resolve, reject) => {
      emit('agendado', dados, resolve, reject)
    })
    fechar()
  } catch (e) {
    erroGeral.value = (e && e.message) || 'Erro ao agendar plantão.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <BaseModal :open="open" title="Agendar Plantão" @close="fechar">
    <div class="form-plantao">
      <div class="form-plantao__info" v-if="profissional">
        <div class="form-plantao__info-row">
          <span class="form-plantao__info-label">Profissional</span>
          <span class="form-plantao__info-value">{{ profissional.nome }}</span>
        </div>
        <div class="form-plantao__info-row">
          <span class="form-plantao__info-label">Data</span>
          <span class="form-plantao__info-value form-plantao__info-value--capitalize">
            {{ dataFormatada }}
          </span>
        </div>
      </div>

      <BaseSelect
        v-model="turnoSelecionado"
        label="Turno"
        :options="turnoOptions"
        placeholder="Selecione o turno..."
        :error="erroTurno"
        required
      />

      <p v-if="erroGeral" class="form-plantao__erro-geral" role="alert">
        {{ erroGeral }}
      </p>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="fechar" :disabled="loading">
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" :loading="loading" @click="agendar">
        Agendar
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.form-plantao {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__info {
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__info-row {
    display: flex;
    gap: 8px;
    align-items: baseline;
  }

  &__info-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-muted);
    min-width: 90px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__info-value {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);

    &--capitalize {
      text-transform: capitalize;
    }
  }

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
