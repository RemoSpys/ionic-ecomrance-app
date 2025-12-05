<template>
  <div class="state-root">
    <ion-spinner name="crescent" color="primary" />
    <p>Loading products…</p>
  </div>
</template>

<script setup>
import { IonSpinner } from '@ionic/vue'
</script>

<style scoped>
.state-root {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #6b7280;
  text-align: center;
}
</style>
