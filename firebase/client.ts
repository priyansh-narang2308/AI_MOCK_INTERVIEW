import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBg0pXfeRr0--6KzLJ91xVOy44Y4MasR44",
  authDomain: "tactiq-d0bce.firebaseapp.com",
  projectId: "tactiq-d0bce",
  storageBucket: "tactiq-d0bce.appspot.com", 
  messagingSenderId: "535944514987",
  appId: "1:535944514987:web:0a7f24d700bb93656216ee",
  measurementId: "G-Q1N3KKHZHY"
}

// Initialize Firebase for Client (Ensure Single Instance)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Correct Client-Side Auth
export const auth = getAuth(app)

// Firestore for Client
export const db = getFirestore(app)
