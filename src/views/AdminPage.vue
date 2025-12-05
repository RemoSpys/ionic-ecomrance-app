<template>
  <ion-page>
    <ion-content fullscreen class="admin-page">
      <div class="shell">

        <div class="top">
          <h1>Product Management</h1>
        </div>

        <ProductList ref="list" />

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue"
import { IonPage, IonContent, IonButton } from "@ionic/vue"
import ProductList from "@/components/ProductList.vue"

const list = ref(null)
const reload = () => list.value?.load()
</script>

<style scoped>
.admin-page {
  --background: #f3f4f6;
}

.shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 96px 20px 30px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.actions {
  display: flex;
  gap: 10px;
}

h1 {
  font-size: 26px;
  font-weight: 800;
}

.state {
  text-align: center;
  padding: 30px 0;
  color: #6b7280;
}

.state.error {
  color: #dc2626;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.main {
  display: flex;
  gap: 14px;
}

.img {
  width: 82px;
  height: 82px;
  border-radius: 14px;
  overflow: hidden;
  background: #e5e7eb;
  flex-shrink: 0;
}

.img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
}

.row2 {
  display: flex;
  gap: 8px;
}

.row3 {
  display: flex;
  gap: 10px;
}

.group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.group label {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 3px;
  color: #6b7280;
}

.desc {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  padding: 10px;
  font-size: 13px;
  resize: vertical;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.save {
  --background: #2563eb;
  --border-radius: 999px;
}

.saved {
  padding: 4px 12px;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
}
</style>
