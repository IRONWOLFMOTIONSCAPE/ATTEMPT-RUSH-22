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
  where,
  orderBy,
  writeBatch,
  getDocs
} from 'firebase/firestore';

class SyncEngine {
  constructor() {
    this.dbName = 'ironwolfDB';
    this.version = 1;
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.lastSyncTimestamp = null;
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
          userStore.createIndex('syncStatus', 'syncStatus');
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          syncStore.createIndex('timestamp', 'timestamp');
          syncStore.createIndex('retryCount', 'retryCount');
        }
      }
    });

    // Start sync process
    this.startSync();
  }

  setupEventListeners() {
    window.addEventListener('online', async () => {
      this.isOnline = true;
      await this.processSyncQueue();
      await this.fullSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async startSync() {
    // Set up real-time listener for Firebase changes
    const usersCollection = collection(firebaseDB, 'users');
    const q = query(usersCollection, orderBy('lastModified', 'desc'));

    onSnapshot(q, async (snapshot) => {
      if (!this.isOnline) return;

      const batch = [];
      const changes = snapshot.docChanges();
      
      for (const change of changes) {
        const data = { 
          ...change.doc.data(), 
          id: change.doc.id,
          syncStatus: 'synced',
          lastSyncTimestamp: Date.now()
        };

        if (change.type === 'modified' || change.type === 'added') {
          batch.push({ type: 'put', data });
        } else if (change.type === 'removed') {
          batch.push({ type: 'delete', id: change.doc.id });
        }
      }

      if (batch.length > 0) {
        await this.processBatch(batch);
      }
    });
  }

  async processBatch(batch) {
    const tx = this.db.transaction('users', 'readwrite');
    try {
      for (const operation of batch) {
        if (operation.type === 'put') {
          await tx.store.put(operation.data);
        } else if (operation.type === 'delete') {
          await tx.store.delete(operation.id);
        }
      }
      await tx.done;
    } catch (error) {
      console.error('Error processing batch:', error);
      await tx.abort();
    }
  }

  async fullSync() {
    if (!this.isOnline || this.syncInProgress) return;

    try {
      this.syncInProgress = true;
      const localData = await this.getData('users');
      const serverData = await this.getServerData();

      const batch = [];
      const serverMap = new Map(serverData.map(item => [item.id, item]));
      const localMap = new Map(localData.map(item => [item.id, item]));

      // Find items to update or add
      for (const [id, serverItem] of serverMap) {
        const localItem = localMap.get(id);
        if (!localItem || serverItem.lastModified > localItem.lastModified) {
          batch.push({ type: 'put', data: serverItem });
        }
      }

      // Find items to delete
      for (const [id, localItem] of localMap) {
        if (!serverMap.has(id)) {
          batch.push({ type: 'delete', id });
        }
      }

      if (batch.length > 0) {
        await this.processBatch(batch);
      }

      this.lastSyncTimestamp = Date.now();
    } catch (error) {
      console.error('Full sync error:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async getServerData() {
    const usersCollection = collection(firebaseDB, 'users');
    const q = query(usersCollection, orderBy('lastModified', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      syncStatus: 'synced',
      lastSyncTimestamp: Date.now()
    }));
  }

  async addToSyncQueue(operation) {
    const tx = this.db.transaction('syncQueue', 'readwrite');
    await tx.store.add({
      ...operation,
      timestamp: Date.now(),
      retryCount: 0
    });

    if (this.isOnline) {
      await this.processSyncQueue();
    }
  }

  async processSyncQueue() {
    if (!this.isOnline) return;

    const tx = this.db.transaction('syncQueue', 'readwrite');
    const queue = await tx.store.getAll();

    // Sort by timestamp and retry count
    queue.sort((a, b) => {
      if (a.retryCount === b.retryCount) {
        return a.timestamp - b.timestamp;
      }
      return a.retryCount - b.retryCount;
    });

    const batch = writeBatch(firebaseDB);
    const processedIds = [];

    for (const operation of queue) {
      try {
        const docRef = doc(firebaseDB, 'users', operation.data.id);
        
        if (operation.type === 'DELETE') {
          batch.delete(docRef);
        } else {
          batch.set(docRef, {
            ...operation.data,
            lastModified: serverTimestamp()
          });
        }
        
        processedIds.push(operation.id);
      } catch (error) {
        console.error('Sync error:', error);
        // Update retry count
        await tx.store.put({
          ...operation,
          retryCount: (operation.retryCount || 0) + 1
        });
      }
    }

    try {
      if (processedIds.length > 0) {
        await batch.commit();
        // Remove processed operations
        for (const id of processedIds) {
          await tx.store.delete(id);
        }
      }
    } catch (error) {
      console.error('Batch commit error:', error);
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
        data: {
          ...data,
          lastModified: Date.now(),
          syncStatus: 'pending'
        }
      });

      // Update local DB immediately
      const tx = this.db.transaction(storeName, 'readwrite');
      await tx.store.put({
        ...data,
        lastModified: Date.now(),
        syncStatus: 'pending'
      });
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
    return {
      isOnline: this.isOnline,
      lastSync: this.lastSyncTimestamp,
      syncInProgress: this.syncInProgress
    };
  }
}

export const syncEngine = new SyncEngine();
