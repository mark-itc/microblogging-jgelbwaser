// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEOhCZn9WTdSYg1WchM5UynRt3hj7WvRc",
  authDomain: "microblogging-caa27.firebaseapp.com",
  projectId: "microblogging-caa27",
  storageBucket: "microblogging-caa27.appspot.com",
  messagingSenderId: "816415676622",
  appId: "1:816415676622:web:a9190bec809204ecd7d89f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore

export const db = getFirestore(app);
