import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC6AtG5DThqJaeAvTxZDskkRtbLnkBLiiw",
  authDomain: "airsoft-e-commerce-app.firebaseapp.com",
  databaseURL: "https://airsoft-e-commerce-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "airsoft-e-commerce-app",
  storageBucket: "airsoft-e-commerce-app.firebasestorage.app", 
  messagingSenderId: "276285818200",
  appId: "1:276285818200:web:cd389df25770badf09512d",
  measurementId: "G-WQT1QJ6XYN"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()

export default app