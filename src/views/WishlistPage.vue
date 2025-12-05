<template>
  <ion-page>
    <AppHeader title="Wishlist" />

    <ion-content class="page">
      <div class="container">

        <div v-if="loading" class="loading-wrapper">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Loading your wishlist...</p>
        </div>

        <div v-else-if="wishlistProducts.length === 0" class="empty-state">
          <ion-icon :icon="heartOutline" class="empty-icon"></ion-icon>
          <h2>Your Wishlist is Empty</h2>
          <p>Start adding products you love!</p>
          <ion-button @click="$router.push('/catalogue')">
            Browse Products
          </ion-button>
        </div>

        <div v-else class="products-grid">
          <WishlistProductCard
            v-for="product in wishlistProducts"
            :key="product.id"
            :product="product"
            @click-product="goToProduct"
            @add-to-cart="addToCart"
            @remove="removeFromWishlist"
          />
        </div>

      </div>

      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :duration="2000"
        @didDismiss="showToast = false"
        :color="toastColor"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast
} from "@ionic/vue"

import AppHeader from "@/components/AppHeader.vue"
import WishlistProductCard from "@/components/WishlistProductCard.vue"

import { ref, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useProductStore } from "@/stores/productStore"
import { useCartStore } from "@/stores/cartStore"

import { heartOutline } from "ionicons/icons"

import { useWishlistStore } from "@/stores/wishlistStore"
const wishlist = useWishlistStore()

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const loading = ref(true)
const wishlistProducts = ref([])

const showToast = ref(false)
const toastMessage = ref("")
const toastColor = ref("success")

const syncWishlistProducts = () => {
  wishlistProducts.value = wishlist.wishlist
    .map(id => productStore.getProductById(id))
    .filter(p => p)
}

onMounted(async () => {
  loading.value = true

  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }

  await wishlist.load() 
  syncWishlistProducts()

  loading.value = false
})

watch(() => wishlist.wishlist, () => {
  syncWishlistProducts()
})

const removeFromWishlist = async (productId) => {
  await wishlist.remove(productId)

  toastMessage.value = "Removed from wishlist"
  toastColor.value = "success"
  showToast.value = true
}

const addToCart = (product) => {
  cartStore.add(product, 1)
  toastMessage.value = "Added to cart"
  toastColor.value = "success"
  showToast.value = true
}

const goToProduct = (id) => router.push(`/product/${id}`)
</script>

<style scoped>
.page {
  --background: #fdf2f8;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  color: #6b7280;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 80px;
  color: #fbcfe8;
  margin-bottom: 24px;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
