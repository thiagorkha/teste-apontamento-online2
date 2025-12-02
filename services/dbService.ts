import { AppState } from '../types';

const DB_NAME = "producao-db";
const STORE_QUEUE = "queue";
const STORE_STATE = "state";
const DB_VERSION = 2;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE_STATE)) {
        db.createObjectStore(STORE_STATE, { keyPath: "key" });
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const saveCurrentState = async (state: AppState): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_STATE, "readwrite");
    // We don't save the 'isRestored' flag logic, just the raw data and step
    await tx.objectStore(STORE_STATE).put({ key: "current", value: state, timestamp: Date.now() });
  } catch (error) {
    console.error("Failed to save state to DB", error);
  }
};

export const getCurrentState = async (): Promise<AppState | null> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_STATE, "readonly");
    const result = await new Promise<any>((resolve, reject) => {
      const req = tx.objectStore(STORE_STATE).get("current");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return result ? result.value : null;
  } catch (error) {
    console.error("Failed to load state from DB", error);
    return null;
  }
};

export const clearCurrentState = async (): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_STATE, "readwrite");
    await tx.objectStore(STORE_STATE).delete("current");
  } catch (error) {
    console.error("Failed to clear state", error);
  }
};

export const saveToQueue = async (data: any): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_QUEUE, "readwrite");
  tx.objectStore(STORE_QUEUE).add({ ...data, createdAt: Date.now() });
};

export const getQueueCount = async (): Promise<number> => {
  const db = await openDB();
  const tx = db.transaction(STORE_QUEUE, "readonly");
  const countRequest = tx.objectStore(STORE_QUEUE).count();
  return new Promise((resolve) => {
    countRequest.onsuccess = () => resolve(countRequest.result);
    countRequest.onerror = () => resolve(0);
  });
};
