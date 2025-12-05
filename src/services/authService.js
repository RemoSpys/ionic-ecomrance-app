import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db, googleProvider } from "@/firebase/config"

export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user
  
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    wishlist: [],
    createdAt: new Date().toISOString()
  })
  
  return user
}

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  const user = result.user

  const userDoc = await getDoc(doc(db, "users", user.uid))
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      wishlist: [],
      createdAt: new Date().toISOString(),
      provider: "google"
    })
  }

  return user
}

export const logoutUser = async () => {
  await signOut(auth)
}
