<template>
  <div class="filter-container glass">

    <!-- Mobile Category Dropdown - ONLY ON MOBILE -->
    <div class="mobile-cat-wrap" v-if="!isDesktop">
      <div class="mobile-cat-header" @click="mobileCatOpen = !mobileCatOpen">
        <ion-icon name="list"></ion-icon>
        <span>{{ selectedCategoryLabel }}</span>
        <ion-icon :name="mobileCatOpen ? 'chevron-up' : 'chevron-down'" class="chevron"></ion-icon>
      </div>

      <div class="mobile-cat-dropdown" v-if="mobileCatOpen">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="dropdown-item"
          :class="{ active: filters.category === cat.value }"
          @click="setCategory(cat.value); mobileCatOpen=false;"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Desktop Category Chips - ONLY ON DESKTOP -->
    <div class="h-scroll desktop-only" v-if="isDesktop">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="chip icon-chip"
        :class="{ active: filters.category === cat.value }"
        @click="setCategory(cat.value)"
      >
        <ion-icon :name="cat.icon"></ion-icon>
        {{ cat.label }}
      </button>
    </div>

    <!-- Stock Options -->
    <div class="options-row">
      <button
        v-for="opt in stockOptions"
        :key="opt.value"
        class="chip small icon-chip"
        :class="{ active: filters.stock === opt.value }"
        @click="setStock(opt.value)"
      >
        <ion-icon :name="opt.icon"></ion-icon>
        {{ opt.label }}
      </button>
    </div>

    <!-- Sort Dropdown -->
    <div class="dropdown-wrap">
      <ion-icon name="funnel" class="dropdown-icon"></ion-icon>
      <select class="dropdown" v-model="filters.sort" @change="emitUpdate">
        <option value="default">Recommended</option>
        <option value="cheap">Price: Low → High</option>
        <option value="expensive">Price: High → Low</option>
        <option value="rating">Top Rated</option>
        <option value="newest">Newest First</option>
      </select>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from "vue"
import { IonIcon } from "@ionic/vue"

const emit = defineEmits(["update"])

const filters = reactive({
  category: "all",
  stock: "all",
  sort: "default"
})

const mobileCatOpen = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const isDesktop = computed(() => windowWidth.value >= 768)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWidth)
    updateWidth() // Initial check
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWidth)
  }
})

const categories = [
  { value: "all", label: "All", icon: "apps" },
  { value: "pistols", label: "Pistols", icon: "body" },
  { value: "rifles", label: "Rifles", icon: "shield" },
  { value: "smg", label: "SMG", icon: "flash" },
  { value: "protection", label: "Protection", icon: "alert" }
]

const stockOptions = [
  { value: "all", label: "All", icon: "layers" },
  { value: "inStock", label: "In Stock", icon: "checkmark-circle" },
  { value: "lowStock", label: "Low", icon: "alert-circle" },
  { value: "outOfStock", label: "Out", icon: "close-circle" }
]

const selectedCategoryLabel = computed(() => {
  return categories.find(c => c.value === filters.category)?.label || "Category"
})

const setCategory = (val) => {
  filters.category = val
  emitUpdate()
}

const setStock = (val) => {
  filters.stock = val
  emitUpdate()
}

const emitUpdate = () => emit("update", { ...filters })
</script>

<style scoped>
.filter-container {
  padding: 16px;
  border-radius: 22px;
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(22px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.28);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Mobile Category Dropdown */
.mobile-cat-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.12);
  font-weight: 700;
  cursor: pointer;
  transition: .15s;
}

.mobile-cat-header:hover {
  background: #f3f4f6;
}

.mobile-cat-header ion-icon:first-child {
  opacity: .7;
}

.mobile-cat-dropdown {
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn .25s ease;
}

.dropdown-item {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  background: #fff;
  cursor: pointer;
  transition: background 0.15s;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item.active {
  background: #2563eb;
  color: white;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.active:hover {
  background: #1d4ed8;
}

/* Desktop Category Chips */
.h-scroll {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding-bottom: 4px;
  scroll-snap-type: x mandatory;
}

.h-scroll::-webkit-scrollbar { 
  display: none;
}

.chip {
  padding: 10px 16px;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.08);
  background: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  cursor: pointer;
  transition: 0.18s;
}

.chip:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.chip.active {
  background: #2563eb;
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(37,99,235,.28);
}

.chip.active:hover {
  background: #1d4ed8;
}

.options-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.dropdown-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.dropdown-icon {
  position: absolute;
  left: 16px;
  opacity: .6;
  pointer-events: none;
  font-size: 18px;
}

.dropdown {
  padding: 12px 16px 12px 44px;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.75);
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  transition: 0.15s;
  appearance: none;
}

.dropdown:hover {
  background: rgba(255,255,255,0.9);
}

.dropdown:focus {
  outline: none;
  border-color: #2563eb;
  background: #fff;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(-6px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

/* Small mobile optimization */
@media (max-width: 400px) {
  .filter-container {
    padding: 12px;
    gap: 12px;
  }
  
  .mobile-cat-header {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .chip {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .dropdown {
    padding: 10px 14px 10px 40px;
    font-size: 14px;
  }
}
</style>