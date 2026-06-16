import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsJstKFe6pLIzU0BNVKbsSH2uEUDGZQRI",
  authDomain: "pawwlstore.firebaseapp.com",
  projectId: "pawwlstore",
  storageBucket: "pawwlstore.firebasestorage.app",
  messagingSenderId: "506824916037",
  appId: "1:506824916037:web:44f19971956463b7b7772c",
  measurementId: "G-6W2GLHHGXT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
