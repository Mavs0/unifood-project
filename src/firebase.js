import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3TBGbRbZQ75bHVQW41kJVGLbXdjsbyxU",
  authDomain: "unifood-aaa0f.firebaseapp.com",
  projectId: "unifood-aaa0f",
  storageBucket: "unifood-aaa0f.firebasestorage.app",
  messagingSenderId: "52534721759",
  appId: "1:52534721759:web:296e50e8ed5ffb32f33d6a",
  measurementId: "G-PR6PMFJ4RF",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
