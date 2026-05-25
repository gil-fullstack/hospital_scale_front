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
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
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
  <div class="base-input" :class="{ 'base-input--error': error }">
    <label v-if="label" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required" aria-hidden="true">*</span>
    </label>
    <input
      class="base-input__field"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <span v-if="error" class="base-input__error-msg" role="alert">{{ error }}</span>
  </div>
</template>

<style lang="scss" scoped>
.base-input {
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

    &::placeholder {
      color: var(--color-text-muted);
    }

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
