import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  disableNetwork,
  enableNetwork,
  waitForPendingWrites
} from 'firebase/firestore';
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

// Initialize Firestore with enhanced sync capabilities
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// Function to handle network state changes
const handleNetworkState = async (online) => {
  try {
    if (online) {
      await enableNetwork(db);
      // Wait for any pending writes to complete
      await waitForPendingWrites(db);
      console.log('Network enabled, pending writes synced');
    } else {
      await disableNetwork(db);
      console.log('Network disabled, operating in offline mode');
    }
  } catch (error) {
    console.error('Network state change error:', error);
  }
};

// Set up network state listeners
window.addEventListener('online', () => handleNetworkState(true));
window.addEventListener('offline', () => handleNetworkState(false));

// Enable advanced synchronization features
const initializeSync = async () => {
  try {
    // Enable multi-tab support
    await enableMultiTabIndexedDbPersistence(db);
    console.log('Multi-tab persistence enabled successfully');
  } catch (err) {
    if (err.code === 'failed-precondition') {
      // Multiple tabs might be open
      console.warn('Multiple tabs detected, falling back to single-tab persistence');
      try {
        await enableIndexedDbPersistence(db);
        console.log('Single-tab persistence enabled as fallback');
      } catch (singleTabError) {
        console.error('Failed to enable persistence:', singleTabError);
      }
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    }
  }
};

// Initialize sync
initializeSync().catch(console.error);

// Initialize authentication
const auth = getAuth(app);
signInAnonymously(auth).catch((error) => {
  console.error('Anonymous auth error:', error);
});

export { db, auth };