import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDeP_uV3Y5NEBy6bT1DfE_uwyKb1JAHG3g",
  authDomain: "tambran-smart-urban-village.firebaseapp.com",
  projectId: "tambran-smart-urban-village",
  storageBucket: "tambran-smart-urban-village.appspot.com",
  messagingSenderId: "402932538759",
  appId: "1:402932538759:web:307bf70d2c0633d8fd0722",
  measurementId: "G-JSGRG3H7W5",
}

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app, "https://tambran-smart-urban-village-default-rtdb.asia-southeast1.firebasedatabase.app/");