<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['success', 'error', 'warning', 'info'].includes(v),
  },
  message: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['dismiss'])

let timer = null

onMounted(() => {
  timer = setTimeout(() => {
    emit('dismiss')
  }, 5000)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}
</script>

<template>
  <div class="base-alert" :class="`base-alert--${type}`" role="alert">
    <span class="base-alert__icon">{{ icons[type] }}</span>
    <span class="base-alert__message">{{ message }}</span>
    <button class="base-alert__close" @click="emit('dismiss')" aria-label="Fechar notificação">
      &times;
    </button>
  </div>
</template>

<style lang="scss" scoped>
.base-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 260px;
  max-width: 360px;
  border-left: 4px solid;

  &--success {
    background-color: #f0fdf4;
    border-left-color: #22c55e;
    color: #15803d;
  }

  &--error {
    background-color: #fef2f2;
    border-left-color: var(--color-danger);
    color: #b91c1c;
  }

  &--warning {
    background-color: #fffbeb;
    border-left-color: #f59e0b;
    color: #92400e;
  }

  &--info {
    background-color: #eff6ff;
    border-left-color: var(--color-primary);
    color: #1e40af;
  }

  &__icon {
    font-size: 15px;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__message {
    flex: 1;
    line-height: 1.4;
  }

  &__close {
    background: none;
    border: none;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    padding: 0 2px;
    flex-shrink: 0;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
