import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyACujLLkwCPZKMNW0GzpE9lHXi_Megck80",
  authDomain: "rush-test-10550.firebaseapp.com",
  projectId: "rush-test-10550",
  storageBucket: "rush-test-10550.firebasestorage.app",
  messagingSenderId: "310407037082",
  appId: "1:310407037082:web:ce6a27d2b23cad8f4e5f23",
  measurementId: "G-55K73PTD7H"
};

// Initialize Firebase with optimized settings
const app = initializeApp(firebaseConfig);

// Initialize Firestore with optimized settings for real-time sync
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  }),
  experimentalForceLongPolling: true, // Ensures reliable real-time updates
  experimentalAutoDetectLongPolling: true,
  synchronizeTabs: true // Enable cross-tab synchronization
});

// Enable persistence with optimized settings
try {
  await enableMultiTabIndexedDbPersistence(db);
  console.log('Multi-tab persistence enabled');
} catch (err) {
  if (err.code === 'failed-precondition') {
    await enableIndexedDbPersistence(db);
    console.log('Single-tab persistence enabled');
  } else {
    console.error('Persistence error:', err);
  }
}

// Initialize authentication
const auth = getAuth(app);
signInAnonymously(auth).catch((error) => {
  console.error('Anonymous auth error:', error);
});

export { db, auth };