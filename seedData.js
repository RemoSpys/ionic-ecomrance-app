import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  deleteDoc,
  getDocs
} from "firebase/firestore";

import { productsSeed } from "./src/seed/products.seed.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6AtG5DThqJaeAvTxZDskkRtbLnkBLiiw",
  authDomain: "airsoft-e-commerce-app.firebaseapp.com",
  projectId: "airsoft-e-commerce-app",
  storageBucket: "airsoft-e-commerce-app.appspot.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearProducts() {
  const snap = await getDocs(collection(db, "products"));
  for (const item of snap.docs) {
    await deleteDoc(doc(db, "products", item.id));
  }
}

async function seedProducts() {
  for (const p of productsSeed) {
    await setDoc(doc(db, "products", p.id), p);
    console.log("Added:", p.id);
  }
}

(async () => {
  await clearProducts();
  await seedProducts();
  console.log("Done!");
  process.exit(0);
})();
