import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace this with your actual Firebase config
// You can get this from your Firebase Console under Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyDtEMm4WsZTGJQvqOAyER6UjJIiNqz4Y9o",
  authDomain: "bhuvaneshwaran--portfolio.firebaseapp.com",
  projectId: "bhuvaneshwaran--portfolio",
  storageBucket: "bhuvaneshwaran--portfolio.firebasestorage.app",
  messagingSenderId: "142531113288",
  appId: "1:142531113288:web:ae82c4c167a446351a837d",
  measurementId: "G-7MH8ESMXVX"
};

// Initialize Firebase only if config is provided to avoid crashing
let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase not properly configured. Please update firebaseConfig in src/firebase.js");
}

export { auth, db, storage };
