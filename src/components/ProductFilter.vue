<template>
  <div class="filter-container">

    <div class="filter-section">
      <label class="filter-label">Category</label>
      <select class="filter-select" v-model="filters.category" @change="emitUpdate">
        <option value="all">All Categories</option>
        <option value="pistols">Pistols</option>
        <option value="rifles">Rifles</option>
        <option value="smg">SMG</option>
        <option value="protection">Protection</option>
      </select>
    </div>

    <div class="filter-section">
      <label class="filter-label">Stock</label>
      <div class="button-group">
        <button
          v-for="opt in stockOptions"
          :key="opt.value"
          class="filter-btn"
          :class="{ active: filters.stock === opt.value }"
          @click="setStock(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="filter-section">
      <label class="filter-label">Sort By</label>
      <select class="filter-select" v-model="filters.sort" @change="emitUpdate">
        <option value="default">Recommended</option>
        <option value="cheap">Price: Low to High</option>
        <option value="expensive">Price: High to Low</option>
        <option value="rating">Top Rated</option>
        <option value="newest">Newest First</option>
      </select>
    </div>

  </div>
</template>

<script setup>
import { reactive } from "vue"

const emit = defineEmits(["update"])

const filters = reactive({
  category: "all",
  stock: "all",
  sort: "default"
})

const stockOptions = [
  { value: "all", label: "All" },
  { value: "inStock", label: "In Stock" },
  { value: "lowStock", label: "Low" },
  { value: "outOfStock", label: "Out" }
]

const setStock = (val) => {
  filters.stock = val
  emitUpdate()
}

const emitUpdate = () => {
  emit("update", { ...filters })
}
</script>

<style scoped>
.filter-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: white;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:hover {
  border-color: #d1d5db;
}

.filter-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.button-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.filter-btn {
  padding: 10px 16px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.filter-btn.active {
  border-color: #2563eb;
  background: #2563eb;
  color: white;
}

@media (min-width: 640px) {
  .filter-container {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }

  .filter-section {
    flex: 1;
    min-width: 0;
  }

  .filter-section:nth-child(2) {
    flex: 1.5;
  }

  .button-group {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .filter-container {
    padding: 24px;
    gap: 24px;
  }

  .button-group {
    gap: 10px;
  }

  .filter-btn {
    padding: 12px 20px;
    font-size: 15px;
  }
}
</style>