<template>
  <div class="auth-input-wrapper">
    <label v-if="label" class="auth-label">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="auth-input"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.auth-input-wrapper {
  margin-bottom: 20px;
}

.auth-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  letter-spacing: 0.01em;
}

.auth-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  color: #111827;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
}

@media (min-width: 768px) {
  .auth-input {
    padding: 16px 18px;
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .auth-input {
    padding: 18px 20px;
    font-size: 16px;
  }
}

.auth-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.auth-input::placeholder {
  color: #9ca3af;
}

.auth-input:hover {
  border-color: #d1d5db;
}
</style>