<template>
  <div class="wishlist-product-card">
    <div class="image-wrapper" @click="$emit('click-product', product.id)">
      <img :src="product.image" :alt="product.name" />
      <div class="badges">
        <ion-chip class="brand">{{ product.brand }}</ion-chip>
      </div>
      <div class="wishlist-heart">♥</div>
    </div>

    <div class="card-content">
      <h3 class="product-name" @click="$emit('click-product', product.id)">
        {{ product.name }}
      </h3>
      <p class="product-category">{{ product.category }}</p>

      <div class="rating">
        <ion-icon
          v-for="n in 5"
          :key="n"
          :icon="n <= Math.round(product.rating) ? star : starOutline"
          :class="{'star-on': n <= Math.round(product.rating)}"
        />
        <span class="reviews">({{ product.reviews }})</span>
      </div>

      <div class="price-row">
        <div class="price">€{{ product.price.toFixed(2) }}</div>
        <div v-if="product.originalPrice" class="old-price">
          €{{ product.originalPrice.toFixed(2) }}
        </div>
      </div>

      <div class="stock" :class="{ low: product.stock > 0 && product.stock <= 5, out: product.stock === 0 }">
        <ion-icon :icon="cubeOutline" />
        <span v-if="product.stock > 0">{{ product.stock }} in stock</span>
        <span v-else>Out of stock</span>
      </div>

      <div class="card-actions">
        <ion-button
          expand="block"
          @click="$emit('add-to-cart', product)"
          :disabled="product.stock === 0"
          class="add-cart-btn"
        >
          <ion-icon slot="start" :icon="cartOutline" />
          Add to Cart
        </ion-button>

        <ion-button
          fill="clear"
          @click="$emit('remove', product.id)"
          class="remove-btn"
        >
          <ion-icon :icon="trashOutline" />
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IonButton, IonIcon, IonChip } from "@ionic/vue"
import { star, starOutline, cartOutline, trashOutline, cubeOutline } from "ionicons/icons"

defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['click-product', 'add-to-cart', 'remove'])
</script>

<style scoped>
.wishlist-product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid rgba(236, 72, 153, 0.1);
}

.wishlist-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
  border-color: rgba(236, 72, 153, 0.4);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  background: linear-gradient(180deg, #fce7f3, #ffffff);
  overflow: hidden;
  cursor: pointer;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-wrapper:hover img {
  transform: scale(1.05);
}

.wishlist-heart {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 28px;
  color: rgba(236, 72, 153, 0.4);
  text-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.badges {
  position: absolute;
  top: 12px;
  left: 12px;
}

ion-chip.brand {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(219, 39, 119, 0.15));
  color: #be185d;
  font-weight: 700;
  font-size: 12px;
  height: 28px;
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.product-name:hover {
  color: #ec4899;
}

.product-category {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating ion-icon {
  font-size: 16px;
  color: #fbbf24;
}

.rating .star-on {
  color: #f59e0b;
}

.rating .reviews {
  font-size: 13px;
  color: #6b7280;
  margin-left: 4px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 4px;
}

.price {
  font-size: 24px;
  font-weight: 800;
  color: #be185d;
}

.old-price {
  font-size: 14px;
  color: #9ca3af;
  text-decoration: line-through;
}

.stock {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #065f46;
}

.stock.low {
  color: #b45309;
}

.stock.out {
  color: #b91c1c;
}

.stock ion-icon {
  font-size: 18px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.add-cart-btn {
  flex: 1;
  --border-radius: 12px;
  font-weight: 600;
  --background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.add-cart-btn:hover {
  --background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
}

.remove-btn {
  width: 48px;
  flex: none;
  --color: #ef4444;
}

.remove-btn:hover {
  --background: rgba(239, 68, 68, 0.1);
}

@media (max-width: 768px) {
  .image-wrapper {
    height: 200px;
  }

  .product-name {
    font-size: 16px;
  }

  .price {
    font-size: 20px;
  }
}
</style>