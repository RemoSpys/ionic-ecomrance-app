import { defineStore } from "pinia"
import { ref } from "vue"
import { auth, db } from "@/firebase/config"
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore"

export const useWishlistStore = defineStore("wishlist", () => {
  const wishlist = ref([])
  let unsubscribe = null

  const startListener = () => {
    if (!auth.currentUser) {
      wishlist.value = []
      return
    }

    const userRef = doc(db, "users", auth.currentUser.uid)

    if (unsubscribe) unsubscribe()

    unsubscribe = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        wishlist.value = []
      } else {
        wishlist.value = snap.data().wishlist || []
      }
    })
  }

  const load = async () => {
    startListener()
  }

  const add = async (id) => {
    if (!auth.currentUser) return

    const refDoc = doc(db, "users", auth.currentUser.uid)
    await updateDoc(refDoc, { wishlist: arrayUnion(id) })
  }

  const remove = async (id) => {
    if (!auth.currentUser) return

    const refDoc = doc(db, "users", auth.currentUser.uid)
    await updateDoc(refDoc, { wishlist: arrayRemove(id) })
  }

  return { wishlist, load, add, remove, startListener }
})
