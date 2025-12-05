<template>
  <button 
    :class="['auth-button', variant, { 'full-width': fullWidth }]"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <span v-if="icon" class="button-icon">
      <ion-icon :icon="icon" />
    </span>
    <span class="button-text">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { IonIcon } from "@ionic/vue"

defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'social', 'google'].includes(value)
  },
  icon: String,
  fullWidth: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.auth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  outline: none;
}

@media (min-width: 768px) {
  .auth-button {
    padding: 16px 28px;
    font-size: 16px;
    gap: 12px;
  }
  
  .button-icon {
    font-size: 24px;
  }
}

@media (min-width: 1024px) {
  .auth-button {
    padding: 18px 32px;
    font-size: 16px;
  }
}

.auth-button.full-width {
  width: 100%;
}

.auth-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.auth-button:not(:disabled):active {
  transform: translateY(0);
}

.auth-button.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.auth-button.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.auth-button.secondary {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}

.auth-button.secondary:hover {
  background: #e5e7eb;
}

.auth-button.outline {
  background: transparent;
  color: #3b82f6;
  border-color: #3b82f6;
}

.auth-button.outline:hover {
  background: rgba(59, 130, 246, 0.05);
}

.auth-button.google {
  background: white;
  color: #3c4043;
  border-color: #dadce0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.auth-button.google:hover {
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.auth-button.social {
  background: white;
  color: #111827;
  border-color: #e5e7eb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.auth-button.social:hover {
  background: #f9fafb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.button-icon {
  display: flex;
  align-items: center;
  font-size: 22px;
}

.button-text {
  line-height: 1;
}
</style>