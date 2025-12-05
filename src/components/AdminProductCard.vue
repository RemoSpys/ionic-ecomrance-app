<script setup>
import { IonButton } from "@ionic/vue"

defineProps({
  product: Object,
  saving: Boolean,
  onSave: Function,
  onDelete: Function,
  onReset: Function   
})
</script>

<template>
  <div class="admin-card">

    <div class="header">
      <div class="title">
        <strong>{{ product.name || "Untitled Product" }}</strong>
        <span class="sub">ID: {{ product.id }}</span>
      </div>

      <img class="thumb" :src="product.image" :alt="product.name" />
    </div>

    <div class="fields">

      <div class="row">
        <label>Name</label>
        <input class="input" v-model="product.name" placeholder="Name" />
      </div>

      <div class="row">
        <label>Brand</label>
        <input class="input" v-model="product.brand" placeholder="Brand" />
      </div>

      <div class="row two">
        <div>
          <label>Category</label>
          <select class="input" v-model="product.category">
            <option value="rifles">Rifles</option>
            <option value="pistols">Pistols</option>
            <option value="smg">SMG</option>
            <option value="protection">Protection</option>
          </select>
        </div>

        <div>
          <label>Stock</label>
          <input type="number" class="input" v-model.number="product.stock" min="0" />
        </div>
      </div>

      <div class="row three">
        <div>
          <label>Price €</label>
          <input type="number" class="input" v-model.number="product.price" />
        </div>

        <div>
          <label>Original €</label>
          <input type="number" class="input" v-model.number="product.originalPrice" />
        </div>

        <div>
          <label>Image URL</label>
          <input class="input" v-model="product.image" placeholder="Image URL" />
        </div>
      </div>

      <div class="row">
        <label>Description</label>
        <textarea class="desc" rows="3" v-model="product.description" placeholder="Description"></textarea>
      </div>
    </div>

    <div class="actions">
      <ion-button
        size="small"
        class="save"
        :disabled="saving"
        @click="onSave(product)"
      >
        {{ saving ? "Saving…" : "Save" }}
      </ion-button>

      <ion-button
        size="small"
        color="danger"
        fill="outline"
        v-if="onDelete"
        @click="onDelete(product)"
      >
        Delete
      </ion-button>

      <ion-button
        size="small"
        fill="clear"
        v-if="onReset"
        @click="onReset(product)"
      >
        Reset
      </ion-button>
    </div>

    <span v-if="product._saved" class="saved">Saved</span>
  </div>
</template>

<style scoped>
.admin-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: flex;
  flex-direction: column;
}

.title strong {
  font-size: 18px;
}

.sub {
  font-size: 12px;
  color: #6b7280;
}

.thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 12px;
}


.fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  display: flex;
  flex-direction: column;
}

.row.two {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 12px;
}

.row.three {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
}

.input,
.desc {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 14px;
}

.input:focus,
.desc:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px rgba(37,99,235,0.25);
}


.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.save {
  --background: #2563eb;
  --border-radius: 8px;
}

.saved {
  color: #15803d;
  background: #dcfce7;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 8px;
  align-self: flex-start;
}
</style>
