import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACujLLkwCPZKMNW0GzpE9lHXi_Megck80",
  authDomain: "rush-test-10550.firebaseapp.com",
  projectId: "rush-test-10550",
  storageBucket: "rush-test-10550.firebasestorage.app",
  messagingSenderId: "310407037082",
  appId: "1:310407037082:web:ce6a27d2b23cad8f4e5f23",
  measurementId: "G-55K73PTD7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline persistence with unlimited cache size
enableIndexedDbPersistence(db, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
}).catch((err) => {
  console.error('Firebase persistence error:', err);
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support persistence.');
  }
});

const auth = getAuth(app);

// Sign in anonymously
signInAnonymously(auth)
  .then(() => {
    console.log('Signed in anonymously');
  })
  .catch((error) => {
    console.error('Anonymous auth error:', error);
  });

export { db, auth };