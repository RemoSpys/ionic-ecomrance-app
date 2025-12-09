<template>
  <ion-page>
    <AppHeader title="Product" />

    <ion-content fullscreen class="page">
      <LoadingState v-if="loading" />

      <ErrorState v-else-if="!product" message="Product not found." />

      <div v-else class="container">

        <section class="hero">
          <div class="image-wrap">
            <img :src="product.image" :alt="product.name" />
            <div class="badges">
              <ion-chip class="brand">
                <ion-label>{{ product.brand }}</ion-label>
              </ion-chip>

              <ion-chip class="type">
                <ion-label>{{ product.type }}</ion-label>
              </ion-chip>
            </div>

            <div class="rating" aria-hidden>
              <ion-icon
                v-for="n in 5"
                :key="n"
                :icon="n <= Math.round(product.rating) ? star : starOutline"
                :class="{'star-on': n <= Math.round(product.rating)}"
              />
              <span class="reviews">({{ product.reviews }})</span>
            </div>
          </div>

          <div class="hero-card">
            <h1 class="name">{{ product.name }}</h1>
            <p class="subtitle">{{ product.category }} · {{ product.system }}</p>

            <div class="price-row">
              <div class="price-block">
                <div class="price">€{{ product.price.toFixed(2) }}</div>
                <div v-if="product.originalPrice" class="old">€{{ product.originalPrice.toFixed(2) }}</div>
              </div>

              <div class="stock" :class="{ low: product.stock > 0 && product.stock <= 5, out: product.stock === 0 }">
                <ion-icon :icon="cubeOutline" />
                <span v-if="product.stock > 0">{{ product.stock }} in stock</span>
                <span v-else>Out of stock</span>
              </div>
            </div>

            <p class="short-desc">{{ product.description }}</p>

            <div class="controls">
              <div class="qty">
                <ion-button size="small" fill="clear" @click="decr" :disabled="qty === 1 || product.stock === 0">
                  <ion-icon :icon="removeOutline" />
                </ion-button>
                <div class="qty-value">{{ qty }}</div>
                <ion-button size="small" fill="clear" @click="incr" :disabled="qty >= product.stock">
                  <ion-icon :icon="addOutline" />
                </ion-button>
              </div>

              <ion-button
                class="add"
                color="primary"
                :disabled="product.stock === 0"
                @click="addToCart"
              >
                <ion-icon slot="start" :icon="cartOutline" />
                Add to cart2
              </ion-button>

              <ion-button 
                class="wish" 
                fill="clear" 
                @click="toggleWishlist"
                :disabled="wishlistLoading"
              >
                <ion-icon :icon="isInWishlist ? heart : heartOutline" />
              </ion-button>
            </div>
          </div>
        </section>

        <section class="details">
          <ion-item lines="none" @click="showSpecs = !showSpecs" class="accordion-toggle">
            <ion-label>
              <h3>Specifications</h3>
              <p class="muted">Tap to expand</p>
            </ion-label>
            <ion-icon :icon="chevronDown" :class="{ open: showSpecs }" />
          </ion-item>

          <div v-if="showSpecs" class="spec-grid">
            <div class="spec" v-for="(val, key) in product.specifications" :key="key">
              <div class="k">{{ prettifyKey(key) }}</div>
              <div class="v">{{ val }}</div>
            </div>
          </div>

          <div class="features">
            <h3>Features</h3>
            <ul>
              <li v-for="(f, i) in product.features" :key="i">
                <ion-icon :icon="checkmarkDoneOutline" /> {{ f }}
              </li>
            </ul>
          </div>

          <div class="meta">
            <div>SKU: <strong>{{ product.id }}</strong></div>
            <div>Added: <strong>{{ createdAt }}</strong></div>
            <div class="muted">Database: eur3</div>
          </div>
        </section>

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
  IonChip,
  IonLabel,
  IonItem,
  IonToast
} from '@ionic/vue'

import AppHeader from '@/components/AppHeader.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { ref, computed, onMounted } from 'vue'
import { auth } from '@/firebase/config'
import { 
  addToWishlist, 
  removeFromWishlist, 
  isInWishlist as checkIsInWishlist 
} from '@/services/wishlistService'

import {
  star,
  starOutline,
  chevronDown,
  cartOutline,
  heartOutline,
  heart,
  addOutline,
  removeOutline,
  cubeOutline,
  checkmarkDoneOutline
} from 'ionicons/icons'

const route = useRoute()
const store = useProductStore()
const cart = useCartStore()

const loading = ref(true)
const product = ref(null)
const qty = ref(1)
const isInWishlist = ref(false)
const wishlistLoading = ref(false)
const showSpecs = ref(false)
const showToast = ref(false)
const toastMessage = ref("")
const toastColor = ref("success")

const loadProduct = async () => {
  loading.value = true
  if (store.products.length === 0) await store.fetchProducts()
  product.value = store.getProductById(route.params.id)
  loading.value = false
  if (product.value && product.value.stock === 0) qty.value = 0
  
  if (product.value && auth.currentUser) {
    isInWishlist.value = await checkIsInWishlist(product.value.id)
  }
}

const addToCart = () => {
  if (!product.value || product.value.stock === 0) return
  
  try {
    cart.add(product.value, qty.value)
    toastMessage.value = 'Added to cart successfully'
    toastColor.value = 'success'
    showToast.value = true
  } catch (error) {
    toastMessage.value = error.message
    toastColor.value = 'danger'
    showToast.value = true
  }
}

const toggleWishlist = async () => {
  if (!auth.currentUser) {
    toastMessage.value = 'Please login to add to wishlist'
    toastColor.value = 'warning'
    showToast.value = true
    return
  }

  wishlistLoading.value = true
  
  try {
    if (isInWishlist.value) {
      await removeFromWishlist(product.value.id)
      isInWishlist.value = false
      toastMessage.value = 'Removed from wishlist'
    } else {
      await addToWishlist(product.value.id)
      isInWishlist.value = true
      toastMessage.value = 'Added to wishlist'
    }
    toastColor.value = 'success'
    showToast.value = true
  } catch (error) {
    toastMessage.value = error.message
    toastColor.value = 'danger'
    showToast.value = true
  } finally {
    wishlistLoading.value = false
  }
}

const incr = () => {
  if (!product.value) return
  if (qty.value < product.value.stock) qty.value++
}

const decr = () => {
  if (qty.value > 1) qty.value--
}

const createdAt = computed(() => {
  if (!product.value) return ''
  const d = new Date(product.value.createdAt)
  return d.toLocaleDateString()
})

const prettifyKey = (k) => {
  return k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

onMounted(loadProduct)
</script>

<style scoped>
.page {
  --background: linear-gradient(180deg, #f6f8fb 0%, #eef2f7 100%);
  padding-bottom: 80px;
}

.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 18px 14px 120px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-items: start;
}

.image-wrap {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  min-height: 360px;
  box-shadow: 0 18px 40px rgba(16,24,40,0.08);
  background: linear-gradient(180deg,#e6eefc,#ffffff);
}

.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform-origin: center;
  transition: transform .45s ease;
}
.image-wrap:hover img { transform: scale(1.03); }

.image-wrap .badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
}
ion-chip.brand {
  background: rgba(37,99,235,0.12);
  color: #1e3a8a;
  font-weight: 700;
  border-radius: 999px;
}
ion-chip.type {
  background: rgba(16,185,129,0.08);
  color: #065f46;
  font-weight: 700;
  border-radius: 999px;
}

.rating {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.7);
  padding: 6px 8px;
  border-radius: 999px;
  box-shadow: 0 6px 16px rgba(16,24,40,0.06);
}
.rating ion-icon { font-size: 16px; color: #fbbf24; }
.rating .star-on { color: #f59e0b; }
.rating .reviews { font-size: 13px; color: #374151; }

.hero-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 14px 34px rgba(16,24,40,0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.name {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
}

.subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: -4px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.price-block { display: flex; align-items: baseline; gap: 10px; }
.price { font-size: 28px; color: #1e40af; font-weight: 800; }
.old { color: #9ca3af; text-decoration: line-through; font-size: 14px; }

.stock {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #065f46;
  font-weight: 700;
}
.stock.out { color: #b91c1c; }
.stock.low { color: #b45309; }

.short-desc { color: #374151; line-height: 1.45; }

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 6px;
}

.qty {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 12px;
  background: #f3f4f6;
}
.qty-value { min-width: 26px; text-align: center; font-weight: 700; }

.add { --border-radius: 12px; padding: 10px 14px; font-weight: 700; }
.wish { color: #ef4444; }

.details {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 10px 30px rgba(16,24,40,0.04);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.accordion-toggle {
  --padding-start: 0;
  --padding-end: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.accordion-toggle ion-icon { transition: transform .28s ease; }
.accordion-toggle ion-icon.open { transform: rotate(180deg); }

.spec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(160px,1fr));
  gap: 12px;
  padding: 8px 0;
}

.spec { background: #f8fafc; padding: 10px; border-radius: 10px; }
.spec .k { font-size: 12px; color: #6b7280; font-weight: 700; }
.spec .v { font-size: 14px; color: #111827; margin-top: 6px; }

.features ul { padding-left: 18px; margin: 6px 0; color: #374151; }
.features li { margin: 8px 0; display:flex; gap:8px; align-items:flex-start; }
.features ion-icon { color:#10b981; margin-top:4px }

.meta { display:flex; gap: 18px; color:#6b7280; font-size:13px; }

@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; }
  .image-wrap { min-height: 300px; order: -1; }
}

@media (max-width: 640px) {
  .add { flex: 1; }
}
</style>