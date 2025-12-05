<template>
  <div class="auth-divider">
    <span class="divider-line"></span>
    <span class="divider-text">{{ text }}</span>
    <span class="divider-line"></span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'OR'
  }
})
</script>

<style scoped>
.auth-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 28px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
}

.divider-text {
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>