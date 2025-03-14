// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtU4dKmp8PzVmm_Yjcin4cmDtCaRF1RfI",
  authDomain: "testfirebase-f8e33.firebaseapp.com",
  projectId: "testfirebase-f8e33",
  storageBucket: "testfirebase-f8e33.firebasestorage.app",
  messagingSenderId: "996023463332",
  appId: "1:996023463332:web:a53c297ae8c93702f76531",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
