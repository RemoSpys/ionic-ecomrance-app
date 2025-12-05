<template>
  <ion-app>
    <ion-header class="global-header">
      <AppHeader />
    </ion-header>

    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet, IonHeader } from '@ionic/vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<style>
.global-header {
  position: sticky;
  top: 0;
  z-index: 9999;
}
</style>
