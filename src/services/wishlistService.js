import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { auth, db } from "@/firebase/config"

export const addToWishlist = async (productId) => {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error("Please login to add to wishlist")

  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    wishlist: arrayUnion(productId)
  })
}

export const removeFromWishlist = async (productId) => {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error("Not authenticated")

  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    wishlist: arrayRemove(productId)
  })
}

export const getWishlist = async () => {
  const uid = auth.currentUser?.uid
  if (!uid) return []

  const userDoc = await getDoc(doc(db, "users", uid))
  return userDoc.data()?.wishlist || []
}

export const isInWishlist = async (productId) => {
  const wishlist = await getWishlist()
  return wishlist.includes(productId)
}