import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  query
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),

  getters: {
    getProductById: (state) => (id) => {
      return state.products.find((p) => p.id === id)
    }
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const q = query(collection(db, 'products'), orderBy('name'))
        const snap = await getDocs(q)

        this.products = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      } catch (err) {
        console.error(err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async updateProductStock(id, delta) {
      try {
        const ref = doc(db, 'products', id)
        const snap = await getDoc(ref)
        if (!snap.exists()) return false

        const newStock = Math.max((snap.data().stock || 0) - delta, 0)

        await updateDoc(ref, { stock: newStock })

        const i = this.products.findIndex((p) => p.id === id)
        if (i !== -1) this.products[i].stock = newStock
      } catch (e) {
        console.error(e)
      }
    }
  }
})
