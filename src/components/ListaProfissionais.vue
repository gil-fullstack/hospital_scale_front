<script setup>
import { ref, computed } from 'vue'
import { CATEGORIAS } from '../constants/index.js'

const props = defineProps({
  profissionais: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const filtroAtivo = ref('')

const FILTROS = [
  { value: '', label: 'Todos' },
  ...Object.entries(CATEGORIAS).map(([value, label]) => ({ value, label })),
]

const profissionaisFiltrados = computed(() => {
  if (!filtroAtivo.value) return props.profissionais
  return props.profissionais.filter((p) => p.categoria === filtroAtivo.value)
})

function labelCategoria(cat) {
  return CATEGORIAS[cat] ?? cat
}
</script>

<template>
  <div class="lista-profissionais">
    <!-- Filtro por categoria -->
    <div class="lista-profissionais__filtros" role="group" aria-label="Filtrar por categoria">
      <button
        v-for="f in FILTROS"
        :key="f.value"
        class="lista-profissionais__filtro-btn"
        :class="{ 'lista-profissionais__filtro-btn--ativo': filtroAtivo === f.value }"
        @click="filtroAtivo = f.value"
        :aria-pressed="filtroAtivo === f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Skeleton de loading -->
    <div v-if="loading" class="lista-profissionais__skeleton" aria-label="Carregando profissionais...">
      <div v-for="i in 6" :key="i" class="lista-profissionais__skeleton-row" />
    </div>

    <!-- Estado vazio -->
    <div
      v-else-if="profissionaisFiltrados.length === 0"
      class="lista-profissionais__empty"
    >
      <p>Nenhum profissional encontrado.</p>
    </div>

    <!-- Tabela -->
    <div v-else class="lista-profissionais__table-wrap">
      <table class="lista-profissionais__table">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Identificação</th>
            <th scope="col">Categoria</th>
            <th scope="col">Carga Semanal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prof in profissionaisFiltrados" :key="prof.id">
            <td class="lista-profissionais__td-nome">{{ prof.nome }}</td>
            <td class="lista-profissionais__td-crm">{{ prof.crm || '—' }}</td>
            <td>
              <span
                class="lista-profissionais__cat-badge"
                :class="`lista-profissionais__cat-badge--${prof.categoria.toLowerCase()}`"
              >
                {{ labelCategoria(prof.categoria) }}
              </span>
            </td>
            <td class="lista-profissionais__td-carga">
              {{ prof.cargaHorariaSemanal }}h/semana
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lista-profissionais {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__filtros {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__filtro-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid var(--color-border);
    background-color: var(--color-surface);
    color: var(--color-text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    &--ativo {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;

      &:hover {
        color: #fff;
        background-color: var(--color-primary-dark);
      }
    }
  }

  // Skeleton
  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__skeleton-row {
    height: 48px;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
  }

  // Empty
  &__empty {
    padding: 48px 24px;
    text-align: center;
    color: var(--color-text-muted);

    p {
      margin: 0;
      font-size: 15px;
    }
  }

  // Table
  &__table-wrap {
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    th {
      padding: 10px 14px;
      background-color: var(--color-bg);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-secondary);
      border-bottom: 1px solid var(--color-border);
      text-align: left;
    }

    td {
      padding: 12px 14px;
      font-size: 14px;
      color: var(--color-text);
      border-bottom: 1px solid var(--color-border);
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background-color: var(--color-bg);
    }
  }

  &__td-nome {
    font-weight: 500;
  }

  &__td-crm {
    color: var(--color-text-secondary) !important;
    font-family: monospace;
    font-size: 13px !important;
  }

  &__td-carga {
    color: var(--color-text-secondary) !important;
    font-size: 13px !important;
  }

  &__cat-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;

    &--medico {
      background-color: #dbeafe;
      color: #1e40af;
    }

    &--enfermeiro {
      background-color: #d1fae5;
      color: #065f46;
    }

    &--tecnico {
      background-color: #f3e8ff;
      color: #6b21a8;
    }
  }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
