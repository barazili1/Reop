import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, update, remove, set } from "firebase/database";
import { ApiKey } from "../types";

// ------------------------------------------------------------------
// FIREBASE CONFIGURATION
// ------------------------------------------------------------------
const firebaseConfig = {
  databaseURL: "https://korsan27-b72ac-default-rtdb.firebaseio.com/",
};

// Singleton initialization
let db: any;

try {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log("Firebase initialized successfully");
} catch (e) {
    console.warn("Firebase initialization failed.", e);
}

export const subscribeToKeys = (callback: (keys: ApiKey[]) => void) => {
    if (!db) return () => {};
    
    const keysRef = ref(db, 'keys');
    return onValue(keysRef, (snapshot) => {
        const data = snapshot.val();
        const keysList: ApiKey[] = [];
        if (data) {
            Object.entries(data).forEach(([key, value]: [string, any]) => {
                // Ensure we don't crash if malformed data exists
                if (value && typeof value === 'object') {
                    keysList.push({ 
                        ...value, 
                        id: key 
                    });
                }
            });
        }
        // Sort by created at desc
        keysList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        callback(keysList);
    }, (error) => {
        console.error("Firebase read failed:", error);
    });
};

export const addKeyToFirebase = async (keyData: Omit<ApiKey, 'id'>) => {
    if (!db) return null;
    try {
        const keysRef = ref(db, 'keys');
        const newKeyRef = push(keysRef);
        await set(newKeyRef, keyData);
        return newKeyRef.key;
    } catch (error) {
        console.error("Error adding key:", error);
        throw error;
    }
};

export const updateKeyStatusInFirebase = async (id: string, isActive: boolean) => {
    if (!db) return;
    try {
        const keyRef = ref(db, `keys/${id}`);
        await update(keyRef, { isActive });
    } catch (error) {
        console.error("Error updating key status:", error);
    }
};

export const updateKeyLastUsed = async (id: string) => {
    if (!db) return;
    try {
        const keyRef = ref(db, `keys/${id}`);
        await update(keyRef, { lastUsed: Date.now() });
    } catch (error) {
        console.error("Error updating last used:", error);
    }
};

export const deleteKeyFromFirebase = async (id: string) => {
    if (!db) return;
    try {
        const keyRef = ref(db, `keys/${id}`);
        await remove(keyRef);
    } catch (error) {
        console.error("Error deleting key:", error);
    }
};

export const isFirebaseInitialized = () => !!db;