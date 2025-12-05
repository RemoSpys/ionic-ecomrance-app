<template>
  <ion-grid>
    <ion-row>
      <ion-col
        v-for="product in products"
        :key="product.id"
        size="12"
        size-md="6"
        size-lg="4"
      >
        <ProductCard :product="product" />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup>
import { IonGrid, IonRow, IonCol } from "@ionic/vue"
import ProductCard from "@/components/ProductCard.vue"

defineProps({ products: Array })
</script>
