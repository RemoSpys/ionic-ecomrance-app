import { defineStore } from 'pinia'
import { useProductStore } from './productStore'
import { db } from '@/firebase/config'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: []
  }),

  getters: {
    cartItemCount(state) {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0)
    },

    cartTotalAmount(state) {
      return state.cartItems.reduce((total, item) => total + item.quantity * item.price, 0)
    },

    getCartItem: (state) => (id) => {
      return state.cartItems.find(item => item.id === id)
    }
  },

  actions: {
    validateStock(product, desiredQuantity) {
      if (desiredQuantity > product.stock) {
        throw new Error(`Only ${product.stock} available`)
      }
    },

    formatProduct(product) {
      return {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
        maxStock: product.stock
      }
    },

    add(product, addQty = 1) {
      const existing = this.getCartItem(product.id)
      const newQty = (existing ? existing.quantity : 0) + addQty

      this.validateStock(product, newQty)

      if (existing) {
        existing.quantity = newQty
      } else {
        this.cartItems.push({
          ...this.formatProduct(product),
          quantity: addQty
        })
      }
    },

    update(id, quantity) {
      const existing = this.getCartItem(id)
      if (!existing) return

      const productStore = useProductStore()
      const product = productStore.getProductById(id)

      if (quantity <= 0) {
        this.remove(id)
        return
      }

      this.validateStock(product, quantity)

      existing.quantity = quantity
    },

    remove(id) {
      this.cartItems = this.cartItems.filter(item => item.id !== id)
    },

    clear() {
      this.cartItems = []
    },

    async saveOrder() {
      if (this.cartItems.length === 0) throw new Error('Cart empty')

      const order = {
        items: this.cartItems.map(i => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          category: i.category
        })),
        total: this.cartTotalAmount,
        createdAt: serverTimestamp(),
        status: 'completed'
      }

      await addDoc(collection(db, 'orders'), order)
    },

    async checkout() {
      const productStore = useProductStore()

      try {
        await this.saveOrder()

        for (const item of this.cartItems) {
          await productStore.updateProductStock(item.id, item.quantity)
        }

        this.clear()
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    }
  },

  persist: {
    key: 'cart-airsoft',
    storage: localStorage
  }
})
