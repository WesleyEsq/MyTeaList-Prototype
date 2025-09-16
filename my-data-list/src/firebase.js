// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

/*
FB_API_KEY="AIzaSyCffgOPOfgDPH6Eas16K7MXj4yFpdQWivU"
FB_AUTH_DOMAIN="mytealist.firebaseapp.com"
FB_PROJECT_ID="mytealist"
FB_STORAGE_BUCKET="mytealist.firebasestorage.app"
FB_MESSAGING_SENDER_ID="1000289748496"
FB_APP_ID="1:1000289748496:web:69ec4f2d095bc8694d2c95"
FB_MEASUREMENT_ID="G-L1J7JZLTZP"
*/


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the services you'll use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);