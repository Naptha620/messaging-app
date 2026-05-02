import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmQvoHlgK10lEa5uV8qDhvse1bjMNkQ3g",
  authDomain: "messaging-app-620.firebaseapp.com",
  projectId: "messaging-app-620",
  storageBucket: "messaging-app-620.firebasestorage.app",
  messagingSenderId: "609079052849",
  appId: "1:609079052849:web:91f3724229c8cd130aa310"
};

const app = initializeApp(firebaseConfig);

//firestore database utilities
export const db = getFirestore(app);

//google authentication utilities
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();