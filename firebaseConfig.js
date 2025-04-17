// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePersistence, initializeAuth}from 'firebase/auth';
// Your web app's Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import{getFirestore,collection}from'firebase/firestore'
import { getMessaging } from "firebase/messaging";




const firebaseConfig = {
  apiKey: "AIzaSyD2Ntbq5yIXZ9g4casAKczq-4p7pOzsWi8",
  authDomain: "fir-fp-edebd.firebaseapp.com",
  projectId: "fir-fp-edebd",
  storageBucket: "fir-fp-edebd.firebasestorage.app",
  messagingSenderId: "842006154804",
  appId: "1:842006154804:web:10c931e6bcd9be133d8461"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth= initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
});

// Firestore Database
export const db =getFirestore(app);
export const useRef=collection(db,'users');
export const roomRef=collection(db,'rooms')


