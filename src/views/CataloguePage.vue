  <template>
    <ion-page class="catalogue-page">

      <ion-content fullscreen>

        <div class="filter-wrapper">
          <ProductFilter @update="applyFilter" />
        </div>

        <transition name="fade">
          <LoadingState v-if="loading" />

          <ErrorState
            v-else-if="error"
            :message="error"
            @retry="reload"
          />

          <ProductGrid
            v-else
            :products="filteredProducts"
          />
        </transition>

      </ion-content>

    </ion-page>
  </template>

  <script setup>
  import { IonPage, IonContent } from "@ionic/vue"
  import ProductFilter from "@/components/ProductFilter.vue"
  import ProductGrid from "@/components/ProductGrid.vue"
  import LoadingState from "@/components/LoadingState.vue"
  import ErrorState from "@/components/ErrorState.vue"

  import { computed, ref, onMounted } from "vue"
  import { useProductStore } from "@/stores/productStore"

  const store = useProductStore()

  const filters = ref({
    category: "all",
    stock: "all",
    sort: "default",
  })

  const loading = computed(() => store.loading)
  const error = computed(() => store.error)

  const applyFilter = (f) => {
    filters.value = f
  }

  const filteredProducts = computed(() => {
    let arr = [...store.products]

    if (store.globalCategory && store.globalCategory !== "all") {
      arr = arr.filter(p => p.category === store.globalCategory)
    }

    if (filters.value.category !== "all")
      arr = arr.filter(p => p.category === filters.value.category)

    if (filters.value.stock === "inStock")
      arr = arr.filter(p => p.stock > 0)
    else if (filters.value.stock === "lowStock")
      arr = arr.filter(p => p.stock > 0 && p.stock <= 10)
    else if (filters.value.stock === "outOfStock")
      arr = arr.filter(p => p.stock === 0)

    switch (filters.value.sort) {
      case "cheap":
        arr.sort((a, b) => a.price - b.price)
        break
      case "expensive":
        arr.sort((a, b) => b.price - a.price)
        break
      case "rating":
        arr.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        break
    }

    return arr
  })

  const reload = () => store.fetchProducts()

  onMounted(() => store.fetchProducts())
  </script>

  <style scoped>
  .catalogue-page {
    padding: 0;
  }

  .filter-wrapper {
    margin-top: 80px;
    padding: 12px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
