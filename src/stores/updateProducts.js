import { db } from "@/firebase/config"
import { doc, updateDoc } from "firebase/firestore"

export const updateProduct = async (id, data) => {
  try {
    await updateDoc(doc(db, "products", id), data)
    return { success: true }
  } catch (e) {
    console.error("Update failed:", e)
    return { success: false, error: e }
  }
}
