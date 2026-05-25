<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
    // Cada item: { value: string|number, label: string }
  },
  placeholder: {
    type: String,
    default: 'Selecione...',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="base-select" :class="{ 'base-select--error': error }">
    <label v-if="label" class="base-select__label">
      {{ label }}
      <span v-if="required" class="base-select__required" aria-hidden="true">*</span>
    </label>
    <select
      class="base-select__field"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <span v-if="error" class="base-select__error-msg" role="alert">{{ error }}</span>
  </div>
</template>

<style lang="scss" scoped>
.base-select {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__label {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  &__required {
    color: var(--color-danger);
    margin-left: 2px;
  }

  &__field {
    height: 36px;
    padding: 0 10px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 14px;
    color: var(--color-text);
    background-color: var(--color-surface);
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;

    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-ring);
    }

    &:disabled {
      background-color: var(--color-bg);
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &--error &__field {
    border-color: var(--color-danger);

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    }
  }

  &__error-msg {
    font-size: 12px;
    color: var(--color-danger);
    margin-top: 2px;
  }
}
</style>
