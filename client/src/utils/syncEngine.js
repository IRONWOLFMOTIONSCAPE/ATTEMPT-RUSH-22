import { openDB } from 'idb';
import { db as firebaseDB } from '../firebase';
import { collection, onSnapshot, doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

class SyncEngine {
  constructor() {
    this.dbName = 'ironwolfDB';
    this.version = 1;
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    this.initializeDB();
    this.setupEventListeners();
  }

  async initializeDB() {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        // Create stores
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('lastModified', 'lastModified');
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
      }
    });

    // Start sync process
    this.startSync();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async startSync() {
    // Set up real-time listener for Firebase changes
    onSnapshot(collection(firebaseDB, 'users'), async (snapshot) => {
      if (!this.isOnline) return;

      const changes = snapshot.docChanges();
      for (const change of changes) {
        const data = { ...change.doc.data(), id: change.doc.id };
        await this.updateLocalDB(data);
      }
    });
  }

  async updateLocalDB(data) {
    const tx = this.db.transaction('users', 'readwrite');
    await tx.store.put({
      ...data,
      lastModified: Date.now()
    });
  }

  async addToSyncQueue(operation) {
    const tx = this.db.transaction('syncQueue', 'readwrite');
    await tx.store.add({
      ...operation,
      timestamp: Date.now()
    });

    if (this.isOnline) {
      await this.processSyncQueue();
    }
  }

  async processSyncQueue() {
    if (!this.isOnline) return;

    const tx = this.db.transaction('syncQueue', 'readwrite');
    const queue = await tx.store.getAll();

    for (const operation of queue) {
      try {
        const docRef = doc(firebaseDB, 'users', operation.data.id);
        
        if (operation.type === 'DELETE') {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, {
            ...operation.data,
            lastModified: serverTimestamp()
          });
        }
        
        await tx.store.delete(operation.id);
      } catch (error) {
        console.error('Sync error:', error);
        // Keep the operation in queue if it fails
        continue;
      }
    }
  }

  async getData(storeName, query = null) {
    try {
      const tx = this.db.transaction(storeName, 'readonly');
      if (query) {
        return await tx.store.index(query.index).getAll(query.range);
      }
      return await tx.store.getAll();
    } catch (error) {
      console.error(`Error getting data from ${storeName}:`, error);
      throw error;
    }
  }

  async updateData(storeName, data) {
    try {
      await this.addToSyncQueue({
        type: 'UPDATE',
        store: storeName,
        data
      });

      // Update local DB immediately
      await this.updateLocalDB(data);
    } catch (error) {
      console.error(`Error updating data in ${storeName}:`, error);
      throw error;
    }
  }

  async deleteData(storeName, id) {
    try {
      await this.addToSyncQueue({
        type: 'DELETE',
        store: storeName,
        data: { id }
      });

      // Delete from local DB immediately
      const tx = this.db.transaction(storeName, 'readwrite');
      await tx.store.delete(id);
    } catch (error) {
      console.error(`Error deleting data from ${storeName}:`, error);
      throw error;
    }
  }

  getOnlineStatus() {
    return this.isOnline;
  }
}

export const syncEngine = new SyncEngine();
