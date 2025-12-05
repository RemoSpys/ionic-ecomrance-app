<template>
  <div class="state-root">
    <ion-icon :icon="alertCircleOutline" class="icon" />
    <h2>Something went wrong</h2>
    <p>{{ message }}</p>
    <ion-button fill="outline" @click="$emit('retry')">
      Retry
    </ion-button>
  </div>
</template>

<script setup>
import { IonButton, IonIcon } from '@ionic/vue'
import { alertCircleOutline } from 'ionicons/icons'

defineProps({
  message: {
    type: String,
    default: 'Failed to load data.'
  }
})
</script>

<style scoped>
.state-root {
  min-height: 50vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  color: #6b7280;
}

.icon {
  font-size: 64px;
  color: var(--ion-color-danger);
}
</style>
