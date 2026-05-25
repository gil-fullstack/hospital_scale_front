<script setup>
import { ref, computed, onMounted } from 'vue'
import GradeSemanal from './components/GradeSemanal.vue'
import ListaProfissionais from './components/ListaProfissionais.vue'
import ModalNovoProfissional from './components/ModalNovoProfissional.vue'
import ModalNovoPlantao from './components/ModalNovoPlantao.vue'
import BaseButton from './components/base/BaseButton.vue'
import BaseAlert from './components/base/BaseAlert.vue'
import { useEscalaSemanal } from './composables/useEscalaSemanal.js'
import { useProfissionais } from './composables/useProfissionais.js'
import { TURNO_KEYS } from './constants/index.js'

// ── Estado da aba ativa ──────────────────────────────────────────────
const abaAtiva = ref('escala') // 'escala' | 'profissionais'

// ── Composables ──────────────────────────────────────────────────────
const {
  escala,
  loading: loadingEscala,
  erro: erroEscala,
  dataInicio,
  carregar: carregarEscala,
  semanaAnterior,
  proximaSemana,
  agendar,
  excluir,
} = useEscalaSemanal()

const {
  profissionais,
  loading: loadingProfissionais,
  erro: erroProfissionais,
  cadastrar,
  carregar: carregarProfissionais,
} = useProfissionais()

// ── Modais ───────────────────────────────────────────────────────────
const modalProfissionalAberto = ref(false)
const modalPlantaoAberto = ref(false)

const plantaoContexto = ref({
  profissional: null,
  data: '',
  turnosDisponiveis: [],
})

// ── Toasts / alertas ─────────────────────────────────────────────────
const toasts = ref([]) // { id, type, message }
let toastCounter = 0

function adicionarToast(type, message) {
  const id = ++toastCounter
  toasts.value.push({ id, type, message })
}

function removerToast(id) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

// ── Formatação do período da semana ──────────────────────────────────
const periodoSemana = computed(() => {
  if (!escala.value) {
    if (!dataInicio.value) return ''
    const inicio = new Date(dataInicio.value + 'T00:00:00')
    const fim = new Date(inicio)
    fim.setDate(inicio.getDate() + 6)
    return formatarPeriodo(inicio, fim)
  }
  const inicio = new Date(escala.value.dataInicio + 'T00:00:00')
  const fim = new Date(escala.value.dataFim + 'T00:00:00')
  return formatarPeriodo(inicio, fim)
})

function formatarPeriodo(inicio, fim) {
  const opts = { day: '2-digit', month: '2-digit', year: 'numeric' }
  const i = inicio.toLocaleDateString('pt-BR', opts)
  const f = fim.toLocaleDateString('pt-BR', opts)
  return `${i} – ${f}`
}

// ── Handlers de eventos da GradeSemanal ──────────────────────────────
function abrirModalPlantao({ profissional, data, turnosTomados }) {
  const disponiveis = TURNO_KEYS.filter((t) => !turnosTomados.includes(t))
  if (disponiveis.length === 0) return

  plantaoContexto.value = {
    profissional,
    data,
    turnosDisponiveis: disponiveis,
  }
  modalPlantaoAberto.value = true
}

async function onExcluirPlantao({ id }) {
  const confirmado = window.confirm('Deseja remover este plantão?')
  if (!confirmado) return

  try {
    await excluir(id)
    adicionarToast('success', 'Plantão removido com sucesso.')
  } catch (e) {
    adicionarToast('error', e.message || 'Erro ao remover plantão.')
  }
}

// Recebe (dados, resolve, reject) do ModalNovoPlantao
async function onAgendarPlantao(dados, resolve, reject) {
  try {
    await agendar(dados)
    adicionarToast('success', 'Plantão agendado com sucesso.')
    resolve()
  } catch (e) {
    reject(e)
  }
}

// ── Handler do modal de profissional ─────────────────────────────────
// Recebe (dados, resolve, reject) do ModalNovoProfissional
async function onSalvarProfissional(dados, resolve, reject) {
  try {
    await cadastrar(dados)
    adicionarToast('success', 'Profissional cadastrado com sucesso.')
    abaAtiva.value = 'escala'
    await carregarEscala()
    resolve()
  } catch (e) {
    reject(e)
  }
}

// ── Inicialização ─────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([carregarEscala(), carregarProfissionais()])
})
</script>

<template>
  <div class="app">
    <!-- Header com navegação por abas -->
    <header class="app-header">
      <div class="app-header__inner">
        <div class="app-header__brand">
          <span class="app-header__logo" aria-hidden="true">+</span>
          <h1 class="app-header__title">Escala Hospitalar</h1>
        </div>

        <nav class="app-nav" aria-label="Seções principais">
          <button
            class="app-nav__tab"
            :class="{ 'app-nav__tab--ativo': abaAtiva === 'escala' }"
            @click="abaAtiva = 'escala'"
            :aria-current="abaAtiva === 'escala' ? 'page' : undefined"
          >
            Escala Semanal
          </button>
          <button
            class="app-nav__tab"
            :class="{ 'app-nav__tab--ativo': abaAtiva === 'profissionais' }"
            @click="abaAtiva = 'profissionais'"
            :aria-current="abaAtiva === 'profissionais' ? 'page' : undefined"
          >
            Profissionais
          </button>
        </nav>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="app-main">
      <!-- ABA: ESCALA SEMANAL -->
      <section v-if="abaAtiva === 'escala'" class="aba-escala">
        <div class="aba-escala__toolbar">
          <BaseButton variant="ghost" size="sm" @click="semanaAnterior" :disabled="loadingEscala">
            &larr; Semana anterior
          </BaseButton>

          <span class="aba-escala__periodo" aria-live="polite">{{ periodoSemana }}</span>

          <BaseButton variant="ghost" size="sm" @click="proximaSemana" :disabled="loadingEscala">
            Pr&oacute;xima semana &rarr;
          </BaseButton>
        </div>

        <p v-if="erroEscala" class="app-erro" role="alert">{{ erroEscala }}</p>

        <GradeSemanal
          :escala="escala"
          :loading="loadingEscala"
          @agendar-plantao="abrirModalPlantao"
          @excluir-plantao="onExcluirPlantao"
        />
      </section>

      <!-- ABA: PROFISSIONAIS -->
      <section v-if="abaAtiva === 'profissionais'" class="aba-profissionais">
        <div class="aba-profissionais__toolbar">
          <h2 class="aba-profissionais__titulo">Profissionais</h2>
          <BaseButton variant="primary" @click="modalProfissionalAberto = true">
            + Novo Profissional
          </BaseButton>
        </div>

        <p v-if="erroProfissionais" class="app-erro" role="alert">{{ erroProfissionais }}</p>

        <ListaProfissionais
          :profissionais="profissionais"
          :loading="loadingProfissionais"
        />
      </section>
    </main>

    <!-- Toasts posicionados no canto superior direito -->
    <div class="app-toasts" aria-live="assertive" aria-atomic="false">
      <TransitionGroup name="toast">
        <BaseAlert
          v-for="toast in toasts"
          :key="toast.id"
          :type="toast.type"
          :message="toast.message"
          @dismiss="removerToast(toast.id)"
        />
      </TransitionGroup>
    </div>

    <!-- Modal: Novo Profissional -->
    <ModalNovoProfissional
      :open="modalProfissionalAberto"
      @close="modalProfissionalAberto = false"
      @salvo="onSalvarProfissional"
    />

    <!-- Modal: Novo Plantao -->
    <ModalNovoPlantao
      :open="modalPlantaoAberto"
      :profissional="plantaoContexto.profissional"
      :data="plantaoContexto.data"
      :turnosDisponiveis="plantaoContexto.turnosDisponiveis"
      @close="modalPlantaoAberto = false"
      @agendado="onAgendarPlantao"
    />
  </div>
</template>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

// Header
.app-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  &__inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 32px;
    height: 56px;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background-color: var(--color-primary);
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }
}

// Navegacao por abas
.app-nav {
  display: flex;
  gap: 4px;

  &__tab {
    padding: 8px 16px;
    border: none;
    background: none;
    color: var(--color-text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
    margin-bottom: -1px;

    &:hover {
      color: var(--color-text);
    }

    &--ativo {
      color: var(--color-primary);
      border-bottom-color: var(--color-primary);
    }
  }
}

// Main
.app-main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

// Aba: Escala Semanal
.aba-escala {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__periodo {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text);
    text-align: center;
    flex: 1;
  }
}

// Aba: Profissionais
.aba-profissionais {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__titulo {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }
}

// Mensagem de erro global
.app-erro {
  font-size: 13px;
  color: var(--color-danger);
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 10px 14px;
}

// Toasts
.app-toasts {
  position: fixed;
  top: 72px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
