<script setup>
import { computed } from 'vue'
import { TURNOS } from '../constants/index.js'

const props = defineProps({
  turno: {
    type: String,
    required: true,
    validator: (v) => ['MANHA', 'TARDE', 'NOITE'].includes(v),
  },
  deletavel: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['deletar'])

const info = computed(() => TURNOS[props.turno] || { label: props.turno, horario: '' })
</script>

<template>
  <span class="turno-badge" :class="`turno-badge--${turno.toLowerCase()}`">
    <span class="turno-badge__label">{{ info.label }}</span>
    <span class="turno-badge__horario">{{ info.horario }}</span>
    <button
      v-if="deletavel"
      class="turno-badge__delete"
      @click.stop="emit('deletar')"
      :aria-label="`Remover plantão ${info.label}`"
      title="Remover plantão"
    >
      &times;
    </button>
  </span>
</template>

<style lang="scss" scoped>
.turno-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;

  &--manha {
    background-color: #fef3c7;
    color: #92400e;
    border: 1px solid #f59e0b;
  }

  &--tarde {
    background-color: #ffedd5;
    color: #9a3412;
    border: 1px solid #f97316;
  }

  &--noite {
    background-color: #ede9fe;
    color: #3730a3;
    border: 1px solid #4f46e5;
  }

  &__label {
    font-weight: 700;
  }

  &__horario {
    opacity: 0.8;
  }

  &__delete {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 0 1px;
    color: inherit;
    opacity: 0.7;
    margin-left: 2px;
    border-radius: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
