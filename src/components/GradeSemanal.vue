<script setup>
import { computed } from 'vue'
import TurnoBadge from './TurnoBadge.vue'
import { CATEGORIAS, TURNO_KEYS } from '../constants/index.js'

const props = defineProps({
  escala: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['agendar-plantao', 'excluir-plantao'])

// Nomes curtos dos dias da semana para o cabeçalho
const DIA_SEMANA_ABREV = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

/**
 * Formata uma string YYYY-MM-DD como "SEG 19/05"
 */
function formatarDiaHeader(dateStr) {
  const [ano, mes, dia] = dateStr.split('-')
  const novaData = new Date(Number(ano), Number(mes) - 1, Number(dia))
  const abrev = DIA_SEMANA_ABREV[novaData.getDay()]
  return `${abrev} ${dia}/${mes}`
}

const dias = computed(() => props.escala?.dias ?? [])

function getPlantoesDoDia(linha, dia) {
  return linha.plantoesPorDia?.[dia] ?? []
}

function turnosOcupados(linha, dia) {
  return getPlantoesDoDia(linha, dia).map((p) => p.turno)
}

function turnosDisponiveis(linha, dia) {
  const ocupados = turnosOcupados(linha, dia)
  return TURNO_KEYS.filter((t) => !ocupados.includes(t))
}

function podeMaisPlantoes(linha, dia) {
  if (linha.limitAtingido) return false
  return turnosDisponiveis(linha, dia).length > 0
}

function onAgendar(linha, dia) {
  emit('agendar-plantao', {
    profissional: linha.profissional,
    data: dia,
    turnosTomados: turnosOcupados(linha, dia),
  })
}

function onExcluir(plantaoId) {
  emit('excluir-plantao', { id: plantaoId })
}

function labelCategoria(cat) {
  return CATEGORIAS[cat] ?? cat
}
</script>

<template>
  <div class="grade-wrapper">
    <!-- Estado de loading -->
    <div v-if="loading" class="grade-skeleton" aria-label="Carregando escala...">
      <div class="grade-skeleton__header" />
      <div v-for="i in 5" :key="i" class="grade-skeleton__row" />
    </div>

    <!-- Estado vazio -->
    <div v-else-if="!escala || !escala.linhas || escala.linhas.length === 0" class="grade-empty">
      <p class="grade-empty__msg">Nenhum profissional encontrado na escala desta semana.</p>
    </div>

    <!-- Grade real -->
    <div v-else class="grade-scroll">
      <table class="grade" role="grid">
        <thead>
          <tr>
            <th class="grade__th grade__th--profissional" scope="col">Profissional</th>
            <th class="grade__th grade__th--horas" scope="col">Horas</th>
            <th
              v-for="dia in dias"
              :key="dia"
              class="grade__th grade__th--dia"
              scope="col"
            >
              {{ formatarDiaHeader(dia) }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="linha in escala.linhas"
            :key="linha.profissional.id"
            class="grade__row"
            :class="{ 'grade__row--limit-atingido': linha.limitAtingido }"
          >
            <!-- Célula: profissional -->
            <td class="grade__td grade__td--profissional">
              <span class="grade__prof-nome">{{ linha.profissional.nome }}</span>
              <span class="grade__prof-cat">{{ labelCategoria(linha.profissional.categoria) }}</span>
            </td>

            <!-- Célula: horas alocadas -->
            <td class="grade__td grade__td--horas">
              <span
                class="grade__horas-badge"
                :class="{ 'grade__horas-badge--alerta': linha.limitAtingido }"
                :title="linha.limitAtingido ? 'Limite semanal atingido' : ''"
              >
                {{ linha.horasAlocadas }}h/{{ linha.profissional.cargaHorariaSemanal }}h
              </span>
            </td>

            <!-- Células dos dias -->
            <td
              v-for="dia in dias"
              :key="dia"
              class="grade__td grade__td--dia"
            >
              <div class="grade__dia-cell">
                <TurnoBadge
                  v-for="plantao in getPlantoesDoDia(linha, dia)"
                  :key="plantao.id"
                  :turno="plantao.turno"
                  :deletavel="true"
                  @deletar="onExcluir(plantao.id)"
                />

                <button
                  v-if="podeMaisPlantoes(linha, dia)"
                  class="grade__add-btn"
                  @click="onAgendar(linha, dia)"
                  :title="`Agendar plantão para ${linha.profissional.nome}`"
                  aria-label="Adicionar plantão"
                >
                  +
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grade-wrapper {
  width: 100%;
  overflow: hidden;
}

// Skeleton
.grade-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__header {
    height: 40px;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
  }

  &__row {
    height: 56px;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
  }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// Empty state
.grade-empty {
  padding: 48px 24px;
  text-align: center;

  &__msg {
    color: var(--color-text-muted);
    font-size: 15px;
    margin: 0;
  }
}

// Scroll wrapper
.grade-scroll {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

// Table
.grade {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;

  &__th {
    padding: 10px 12px;
    background-color: var(--color-bg);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
    border-bottom: 1px solid var(--color-border);
    white-space: nowrap;
    text-align: left;

    &--profissional {
      position: sticky;
      left: 0;
      z-index: 2;
      min-width: 160px;
      background-color: var(--color-bg);
    }

    &--horas {
      min-width: 90px;
    }

    &--dia {
      min-width: 120px;
      text-align: center;
    }
  }

  &__row {
    &:not(:last-child) {
      border-bottom: 1px solid var(--color-border);
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.01);
    }

    &--limit-atingido {
      background-color: #fef2f2;
      border-left: 3px solid #ef4444;

      .grade__td--profissional {
        background-color: #fef2f2;
      }
    }
  }

  &__td {
    padding: 10px 12px;
    vertical-align: middle;

    &--profissional {
      position: sticky;
      left: 0;
      z-index: 1;
      background-color: var(--color-surface);
    }

    &--horas {
      text-align: center;
    }

    &--dia {
      text-align: center;
    }
  }

  &__prof-nome {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
    line-height: 1.3;
  }

  &__prof-cat {
    display: block;
    font-size: 11px;
    color: var(--color-text-muted);
    margin-top: 2px;
  }

  &__horas-badge {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    white-space: nowrap;

    &--alerta {
      background-color: #fef2f2;
      border-color: #fca5a5;
      color: #b91c1c;
    }
  }

  &__dia-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
    align-items: center;
    min-height: 32px;
  }

  &__add-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px dashed var(--color-border);
    background: none;
    color: var(--color-text-muted);
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, color 0.15s, background-color 0.15s;

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background-color: var(--color-primary-light);
      border-style: solid;
    }
  }
}
</style>
