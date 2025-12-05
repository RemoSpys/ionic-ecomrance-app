<template>
  <ion-page>
    <AppHeader />

    <ion-content fullscreen class="page">
      <div class="container">
        <div class="page-header">
          <div class="page-header-left">
            <h1 class="page-title">Shopping Cart</h1>
            <p class="page-subtitle">
              {{ itemCount }} item<span v-if="itemCount !== 1">s</span> in your loadout
            </p>
          </div>

          <div v-if="items.length" class="page-header-right">
            <div class="chip">
              <ion-icon :icon="cartOutline" />
              <span>{{ itemCount }} items</span>
            </div>
            <div class="chip primary">
              <span>Subtotal</span>
              <strong>€{{ subtotal.toFixed(2) }}</strong>
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading">
          <ion-spinner />
        </div>

        <div v-else-if="items.length === 0" class="empty">
          <ion-icon :icon="cartOutline" class="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Add some gear to your loadout.</p>
          <ion-button @click="$router.push('/catalogue')" class="browse-btn">
            Browse products
          </ion-button>
        </div>

        <div v-else class="cart-layout">
          <div class="cart-items">
            <div v-for="item in items" :key="item.id" class="cart-item">
              <div class="cart-item-main">
                <div class="item-image-wrap">
                  <img :src="item.image" :alt="item.name" class="item-image" />
                </div>

                <div class="item-info">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <div class="item-meta">
                    <span class="item-price">€{{ item.price.toFixed(2) }}</span>
                    <span class="item-each">per unit</span>
                  </div>
                  <p class="item-stock">
                    Max available: <strong>{{ item.maxStock }}</strong>
                  </p>
                </div>
              </div>

              <div class="cart-item-side">
                <div class="qty-block">
                  <span class="qty-label">Quantity</span>
                  <div class="qty-controls">
                    <ion-button
                      size="small"
                      fill="clear"
                      @click="decrease(item)"
                      :disabled="item.quantity <= 1"
                    >
                      <ion-icon :icon="removeOutline" />
                    </ion-button>

                    <span class="qty-value">{{ item.quantity }}</span>

                    <ion-button
                      size="small"
                      fill="clear"
                      @click="increase(item)"
                      :disabled="item.quantity >= item.maxStock"
                    >
                      <ion-icon :icon="addOutline" />
                    </ion-button>
                  </div>
                </div>

                <div class="subtotal-block">
                  <span class="subtotal-label">Subtotal</span>
                  <span class="subtotal-value">
                    €{{ (item.price * item.quantity).toFixed(2) }}
                  </span>
                </div>

                <ion-button
                  fill="clear"
                  color="danger"
                  @click="remove(item.id)"
                  class="remove-btn"
                >
                  <ion-icon :icon="trashOutline" />
                </ion-button>
              </div>
            </div>
          </div>

          <aside class="summary-wrap">
            <div class="summary-card">
              <h2>Order summary</h2>

              <div class="summary-row">
                <span>Items ({{ itemCount }})</span>
                <span>€{{ subtotal.toFixed(2) }}</span>
              </div>

              <div class="summary-row">
                <span>Shipping</span>
                <span v-if="shipping === 0">Free</span>
                <span v-else>€{{ shipping.toFixed(2) }}</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span>Total</span>
                <span>€{{ total.toFixed(2) }}</span>
              </div>

              <ion-button expand="block" class="checkout-btn" @click="openPaymentModal">
                <ion-icon slot="start" :icon="checkmarkCircleOutline" />
                Proceed to checkout
              </ion-button>

              <ion-button
                expand="block"
                fill="outline"
                color="medium"
                class="secondary-btn"
                @click="$router.push('/catalogue')"
              >
                Continue shopping
              </ion-button>

              <ion-button
                expand="block"
                fill="outline"
                color="danger"
                class="secondary-btn"
                @click="clearCart"
              >
                Clear cart
              </ion-button>
            </div>
          </aside>
        </div>
      </div>
    </ion-content>

    <ion-modal :is-open="showPaymentModal" @did-dismiss="closeModal">
      <ion-header translucent>
        <ion-toolbar>
          <ion-title>Payment</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="payment-modal">
        <div class="payment-container">
          <div class="payment-header">
            <div class="payment-icon-wrap">
              <ion-icon :icon="cardOutline" class="payment-icon" />
            </div>

            <h2>Card details</h2>
            <p class="total-amount">Total: €{{ total.toFixed(2) }}</p>
          </div>

          <div class="payment-form">
            <div class="form-group">
              <label>Card number</label>
              <input
                v-model="cardNumber"
                maxlength="19"
                type="text"
                class="card-input"
                placeholder="1234 5678 9012 3456"
                @input="formatCardNumber"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Expiry</label>
                <input
                  v-model="expiryDate"
                  maxlength="5"
                  type="text"
                  class="card-input"
                  placeholder="MM/YY"
                  @input="formatExpiryDate"
                />
              </div>

              <div class="form-group">
                <label>CVV</label>
                <input
                  v-model="cvv"
                  maxlength="3"
                  type="text"
                  class="card-input"
                  placeholder="123"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Cardholder name</label>
              <input
                v-model="cardholderName"
                type="text"
                class="card-input"
                placeholder="JOHN DOE"
              />
            </div>

            <ion-button
              expand="block"
              color="success"
              class="pay-btn"
              :disabled="processing || !isFormValid"
              @click="processPayment"
            >
              <ion-icon slot="start" :icon="processing ? hourglassOutline : checkmarkCircleOutline" />
              {{ processing ? "Processing..." : `Pay €${total.toFixed(2)}` }}
            </ion-button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonContent, IonButton, IonIcon, IonSpinner,
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons
} from '@ionic/vue'

import AppHeader from '@/components/AppHeader.vue'

import { useCartStore } from '@/stores/cartStore'
import { useProductStore } from '@/stores/productStore'

import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import {
  addOutline, removeOutline, trashOutline, cartOutline,
  checkmarkCircleOutline, cardOutline, hourglassOutline
} from 'ionicons/icons'

const cartStore = useCartStore()
const productStore = useProductStore()
const router = useRouter()

const loading = ref(false)
const showPaymentModal = ref(false)
const processing = ref(false)

const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const cardholderName = ref('')

const items = computed(() => cartStore.cartItems)
const itemCount = computed(() => cartStore.cartItemCount)
const subtotal = computed(() => cartStore.cartTotalAmount)
const shipping = computed(() => (subtotal.value > 100 ? 0 : 5.99))
const total = computed(() => subtotal.value + shipping.value)

const isFormValid = computed(() => {
  return (
    cardNumber.value.replace(/\s/g, '').length === 16 &&
    expiryDate.value.length === 5 &&
    cvv.value.length === 3 &&
    cardholderName.value.trim().length > 0
  )
})

const formatCardNumber = e => {
  let v = e.target.value.replace(/\s/g, '')
  let formatted = v.match(/.{1,4}/g)?.join(' ') || v
  cardNumber.value = formatted
}

const formatExpiryDate = e => {
  let v = e.target.value.replace(/\D/g, '')
  if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4)
  expiryDate.value = v
}

const syncCart = async () => {
  loading.value = true

  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }

  cartStore.cartItems.forEach(item => {
    const product = productStore.getProductById(item.id)
    if (product) {
      item.maxStock = product.stock
      item.price = product.price
      item.name = product.name
      item.image = product.image
    }
  })

  loading.value = false
}

onMounted(() => {
  syncCart()
})

const increase = item => {
  try {
    const product = productStore.getProductById(item.id)
    cartStore.add(product, 1)
  } catch (e) {
    alert(e.message)
  }
}

const decrease = item => {
  if (item.quantity <= 1) {
    cartStore.remove(item.id)
  } else {
    cartStore.update(item.id, item.quantity - 1)
  }
}

const remove = id => {
  if (confirm('Remove this item?')) cartStore.remove(id)
}

const clearCart = () => {
  if (confirm('Clear cart?')) cartStore.clear()
}

const openPaymentModal = () => {
  showPaymentModal.value = true
}

const closeModal = () => {
  showPaymentModal.value = false
  cardNumber.value = ''
  expiryDate.value = ''
  cvv.value = ''
  cardholderName.value = ''
}

const processPayment = async () => {
  processing.value = true
  await new Promise(r => setTimeout(r, 1500))

  const result = await cartStore.checkout()
  processing.value = false

  if (result.success) {
    closeModal()
    alert('Payment successful!')
    router.push('/catalogue')
  } else {
    alert(result.message)
  }
}
</script>

<style scoped>
.page {
  --background: linear-gradient(180deg, #f5f7fb 0%, #eef1f7 100%);
}

.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 16px 120px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 30px;
  font-weight: 800;
  color: #111827;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.page-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(15,23,42,0.04);
  font-size: 13px;
  color: #111827;
}

.chip.primary {
  background: #111827;
  color: #f9fafb;
}

.chip ion-icon {
  font-size: 16px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
}

.empty {
  text-align: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 14px 40px rgba(15,23,42,0.06);
}

.empty-icon {
  font-size: 80px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty h2 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 6px;
  color: #111827;
}

.empty p {
  color: #6b7280;
  margin-bottom: 20px;
}

.browse-btn {
  --border-radius: 999px;
  padding-inline: 24px;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.9fr);
  gap: 24px;
  align-items: flex-start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cart-item {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(15,23,42,0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(15,23,42,0.1);
}

.cart-item-main {
  display: flex;
  gap: 14px;
  align-items: center;
  min-width: 0;
}

.item-image-wrap {
  width: 88px;
  height: 88px;
  border-radius: 14px;
  background: linear-gradient(150deg, #e5edff, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image {
  width: 82px;
  height: 82px;
  border-radius: 12px;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.item-name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.item-meta {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.item-price {
  font-size: 15px;
  font-weight: 700;
  color: #1d4ed8;
}

.item-each {
  font-size: 12px;
  color: #9ca3af;
}

.item-stock {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.cart-item-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.qty-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.qty-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
}

.qty-controls {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f3f4f6;
}

.qty-value {
  min-width: 30px;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
}

.subtotal-block {
  text-align: right;
}

.subtotal-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
}

.subtotal-value {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
}

.remove-btn {
  --padding-start: 6px;
  --padding-end: 6px;
}

.summary-wrap {
  position: sticky;
  top: 84px;
}

.summary-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 22px 20px 20px;
  box-shadow: 0 18px 46px rgba(15,23,42,0.12);
}

.summary-card h2 {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #374151;
}

.summary-row.total {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin-top: 6px;
}

.summary-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 14px 0;
}

.checkout-btn {
  margin-top: 18px;
  --border-radius: 12px;
  font-weight: 700;
}

.secondary-btn {
  margin-top: 8px;
  --border-radius: 12px;
  font-weight: 600;
}

.payment-modal {
  --background: linear-gradient(180deg, #f5f7fb 0%, #eef1f7 100%);
}

.payment-container {
  max-width: 520px;
  margin: 0 auto;
  padding: 24px 18px 40px;
}

.payment-header {
  text-align: center;
  margin-bottom: 24px;
}

.payment-icon-wrap {
  width: 70px;
  height: 70px;
  border-radius: 999px;
  margin: 0 auto 14px;
  background: #e0ebff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-icon {
  font-size: 38px;
  color: #1d4ed8;
}

.payment-header h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 4px;
  color: #111827;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #1d4ed8;
}

.payment-form {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 18px 22px;
  box-shadow: 0 14px 40px rgba(15,23,42,0.16);
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 12px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 6px;
}

.card-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  font-size: 15px;
  font-weight: 500;
  transition: border-color 0.16s ease, background-color 0.16s ease;
}

.card-input:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
}

.pay-btn {
  margin-top: 14px;
  --border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  height: 52px;
}

@media (max-width: 968px) {
  .cart-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .summary-wrap {
    position: static;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .container {
    padding-inline: 12px;
  }

  .cart-item {
    flex-direction: column;
    align-items: stretch;
  }

  .cart-item-main {
    width: 100%;
  }

  .cart-item-side {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .subtotal-block {
    text-align: left;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
