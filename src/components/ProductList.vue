<script setup>
import { ref, onMounted } from "vue"
import AdminProductCard from "./AdminProductCard.vue"
import { db } from "@/firebase/config"
import { collection, getDocs } from "firebase/firestore"
import { updateProduct } from "@/stores/updateProducts"

const products = ref([])
const loading = ref(true)
const error = ref(null)
const saving = ref(null)

const load = async () => {
  loading.value = true
  try {
    const snap = await getDocs(collection(db, "products"))
    products.value = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      _saved: false
    }))
  } catch {
    error.value = "Failed to load products"
  }
  loading.value = false
}

const save = async (p) => {
  saving.value = p.id

  const payload = {
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: Number(p.price),
    originalPrice: Number(p.originalPrice),
    stock: Number(p.stock),
    description: p.description,
    image: p.image
  }

  const result = await updateProduct(p.id, payload)

  if (!result.success) {
    alert("Failed to save product.")
  } else {
    p._saved = true
    setTimeout(() => (p._saved = false), 1500)
  }

  saving.value = null
}

onMounted(load)

defineExpose({ load })
</script>

<template>
  <div>
    <div v-if="loading" class="state">Loading products…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <div v-else class="grid">
      <AdminProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        :saving="saving === p.id"
        :onSave="save"
      />
    </div>
  </div>
</template>
