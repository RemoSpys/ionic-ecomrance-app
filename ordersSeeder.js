import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  deleteDoc,
  getDocs
} from "firebase/firestore";

import { ordersSeed } from "./src/seed/ordersSeed.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6AtG5DThqJaeAvTxZDskkRtbLnkBLiiw",
  authDomain: "airsoft-e-commerce-app.firebaseapp.com",
  projectId: "airsoft-e-commerce-app",
  storageBucket: "airsoft-e-commerce-app.appspot.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearOrders() {
  console.log("Removing existing orders...");
  const snap = await getDocs(collection(db, "orders"));
  for (const order of snap.docs) {
    await deleteDoc(doc(db, "orders", order.id));
    console.log("Deleted:", order.id);
  }
}

async function seedOrders() {
  console.log("Seeding orders...");
  for (const order of ordersSeed) {
    await setDoc(doc(db, "orders", order.id), order);
    console.log("Added:", order.id);
  }
}

(async () => {
  console.log("Starting Orders Seeder…");
  await clearOrders();
  await seedOrders();
  console.log("Orders seeding complete!");
  process.exit(0);
})();
