import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDWtqVOPCcgCdvM9fBQmWEn83hXuptRcA",
  authDomain: "nexus-hackathon.firebaseapp.com",
  projectId: "nexus-hackathon",
  storageBucket: "nexus-hackathon.firebasestorage.app",
  messagingSenderId: "559727020217",
  appId: "1:559727020217:web:b8ce17bb424a1d8c3a7368",
  measurementId: "G-B9JBCEFH35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
