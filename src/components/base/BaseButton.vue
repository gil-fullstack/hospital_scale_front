<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger', 'ghost'].includes(v),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v),
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :type="type"
    class="base-btn"
    :class="[`base-btn--${variant}`, `base-btn--${size}`, { 'base-btn--loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="base-btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s, opacity 0.15s, box-shadow 0.15s;
  white-space: nowrap;
  line-height: 1;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &--md {
    padding: 8px 16px;
    height: 36px;
  }

  &--sm {
    padding: 5px 10px;
    height: 28px;
    font-size: 12px;
    border-radius: 4px;
  }

  &--primary {
    background-color: var(--color-primary);
    color: #fff;

    &:hover:not(:disabled) {
      background-color: var(--color-primary-dark);
    }
  }

  &--secondary {
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);

    &:hover:not(:disabled) {
      background-color: var(--color-bg);
    }
  }

  &--danger {
    background-color: var(--color-danger);
    color: #fff;

    &:hover:not(:disabled) {
      background-color: #b91c1c;
    }
  }

  &--ghost {
    background-color: transparent;
    color: var(--color-primary);

    &:hover:not(:disabled) {
      background-color: var(--color-primary-light);
    }
  }

  &__spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: btn-spin 0.7s linear infinite;
    opacity: 0.8;
  }
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
