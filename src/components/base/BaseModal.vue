<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

function handleKeydown(e) {
  if (e.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @click.self="emit('close')" role="dialog" :aria-modal="open" :aria-label="title">
        <div class="modal">
          <div class="modal__header">
            <h2 class="modal__title">{{ title }}</h2>
            <button class="modal__close" @click="emit('close')" aria-label="Fechar modal">
              &times;
            </button>
          </div>

          <div class="modal__body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal {
  background-color: var(--color-surface);
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px 14px;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  &__close {
    background: none;
    border: none;
    font-size: 22px;
    line-height: 1;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    transition: background-color 0.15s, color 0.15s;

    &:hover {
      background-color: var(--color-bg);
      color: var(--color-text);
    }
  }

  &__body {
    padding: 20px 24px;
    overflow-y: auto;
    flex: 1;
  }

  &__footer {
    padding: 14px 24px 18px;
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-shrink: 0;
  }
}

// Transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal {
    transform: translateY(-16px);
    opacity: 0;
  }
}
</style>
