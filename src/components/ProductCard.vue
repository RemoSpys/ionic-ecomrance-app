<template>
  <ion-card class="card" @click="goToProduct">
    <div class="img-box">
      <img :src="product.image" :alt="product.name" loading="lazy" />

      <div class="rate">
        <ion-icon name="star"></ion-icon>
        {{ product.rating.toFixed(1) }}
      </div>

      <div v-if="product.stock <= 5 && product.stock > 0" class="low">
        <ion-icon name="warning"></ion-icon>
        Low stock
      </div>

      <div v-if="product.stock === 0" class="sold">
        <div class="sold-bg"></div>
        <span class="sold-label">
          <ion-icon name="close-circle"></ion-icon>
          OUT<br>CONTACT STAFF
        </span>
      </div>
    </div>

    <ion-card-header class="head">
      <ion-card-subtitle class="brand">{{ product.brand }}</ion-card-subtitle>
      <ion-card-title class="title">{{ product.name }}</ion-card-title>
      <p class="cat">{{ product.category }}</p>
    </ion-card-header>

    <ion-card-content class="body">
      <div class="row">
        <span class="price">€{{ formattedPrice }}</span>
        <ion-badge :color="stockColor" class="stock">{{ stockText }}</ion-badge>
      </div>

      <p class="desc">{{ shortDescription }}</p>

      <div class="feat" v-if="limitedFeatures.length">
        <span class="f" v-for="(f,i) in limitedFeatures" :key="i">
          <ion-icon name="checkmark"></ion-icon>
          {{ f }}
        </span>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonIcon } from '@ionic/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({ product: Object })
const router = useRouter()

const formattedPrice = computed(() => Number(props.product.price || 0).toFixed(2))
const shortDescription = computed(() => props.product.description?.length <= 70 ? props.product.description : props.product.description.substring(0,70) + '...')
const limitedFeatures = computed(() => props.product.features?.slice(0,3) || [])

const stockColor = computed(() => !props.product.stock ? 'danger' : props.product.stock <= 10 ? 'warning' : 'success')
const stockText = computed(() => !props.product.stock ? 'Out' : props.product.stock <= 10 ? `${props.product.stock} left` : `${props.product.stock} in stock`)

const goToProduct = () => router.push(`/product/${props.product.id}`)
</script>

<style scoped>
.card {
  margin: 14px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 8px 22px rgba(0,0,0,0.08);
  transition: .25s;
  overflow: hidden;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(0,0,0,0.15);
}

.img-box {
  position: relative;
  aspect-ratio: 4/3;
  background: #f3f4f6;
  overflow: hidden;
}
.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: .3s;
}
.card:hover img { transform: scale(1.07); }

.rate, .low {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.rate {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0,0,0,.75);
}
.low {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #fbbf24;
}

.sold {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sold-bg {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg, rgba(220,38,38,.65) 0, rgba(220,38,38,.65) 10px, rgba(0,0,0,.25) 10px, rgba(0,0,0,.25) 20px);
}
.sold-label {
  position: relative;
  color: #fff;
  font-weight: 900;
  text-align: center;
  text-shadow: 0 2px 6px rgba(0,0,0,.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 15px;
}

.head { padding-bottom: 0; }
.brand { font-size: 13px; text-transform: uppercase; color: #6b7280; }
.title { font-size: 19px; font-weight: 800; color: #111827; }
.cat { font-size: 13px; color: #9ca3af; }

.row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.price { font-size: 21px; font-weight: 900; color: #2563eb; }
.stock { padding: 6px 14px; border-radius: 12px; }

.desc { margin-top: 12px; font-size: 14px; color: #4b5563; line-height: 1.45; }

.feat { margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
.f {
  padding: 5px 12px;
  background: #eef2ff;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #3749ab;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
