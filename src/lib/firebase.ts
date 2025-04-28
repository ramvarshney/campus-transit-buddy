
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCCF5kMPCYl-5S9wF4jt3CgtJK1tckang0",
  authDomain: "lbustracking.firebaseapp.com",
  projectId: "lbustracking",
  storageBucket: "lbustracking.firebasestorage.app",
  messagingSenderId: "818586857314",
  appId: "1:818586857314:web:24253ac40c7932eee5463b",
  databaseURL: "https://lbustracking-default-rtdb.firebaseio.com" // Adding this for Realtime Database
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
