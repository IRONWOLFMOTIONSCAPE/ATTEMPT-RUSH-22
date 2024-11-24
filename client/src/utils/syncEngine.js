import { openDB } from 'idb';
import { db as firebaseDB } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';

class SyncEngine {
  constructor() {
    this.dbName = 'ironwolfDB';
    this.version = 1;
    this.listeners = new Map();
    this.initializeDB();
  }

  async initializeDB() {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
      }
    });

    // Start real-time sync
    this.startSync();
  }

  async startSync() {
    const usersCollection = collection(firebaseDB, 'users');
    const q = query(usersCollection, orderBy('lastModified', 'desc'));

    // Set up real-time listener with optimized settings
    onSnapshot(q, {
      next: async (snapshot) => {
        const batch = writeBatch(firebaseDB);
        const changes = snapshot.docChanges();
        
        for (const change of changes) {
          const data = {
            ...change.doc.data(),
            id: change.doc.id,
            _lastSync: Date.now()
          };

          // Update local database immediately
          await this.db.put('users', data);

          // Notify any listeners
          this.notifyListeners('users', { type: change.type, data });
        }
      },
      error: (error) => {
        console.error('Sync error:', error);
      }
    });
  }

  async getData(storeName) {
    return await this.db.getAll(storeName);
  }

  async updateData(storeName, data) {
    try {
      const docRef = doc(firebaseDB, storeName, data.id || Date.now().toString());
      await setDoc(docRef, {
        ...data,
        lastModified: serverTimestamp()
      });
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  async deleteData(storeName, id) {
    try {
      await deleteDoc(doc(firebaseDB, storeName, id));
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  // Add listener for real-time updates
  addListener(storeName, callback) {
    if (!this.listeners.has(storeName)) {
      this.listeners.set(storeName, new Set());
    }
    this.listeners.get(storeName).add(callback);
  }

  // Remove listener
  removeListener(storeName, callback) {
    if (this.listeners.has(storeName)) {
      this.listeners.get(storeName).delete(callback);
    }
  }

  // Notify listeners of changes
  notifyListeners(storeName, change) {
    if (this.listeners.has(storeName)) {
      this.listeners.get(storeName).forEach(callback => callback(change));
    }
  }
}

export const syncEngine = new SyncEngine();
