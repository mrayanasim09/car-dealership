import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import type { Car } from "@/lib/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
export function isFirebaseAvailable(): boolean {
  return !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
}

export function getFirebaseStatus() {
  return {
    configured: isFirebaseAvailable(),
    apiKey: !!firebaseConfig.apiKey,
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId,
  };
}

// Singleton pattern to ensure Firebase is initialized only once
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// Car management functions
export async function getAllCars(): Promise<Car[]> {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not configured');
    return [];
  }
  
  try {
    const carsRef = collection(db, "cars");
    const q = query(carsRef, orderBy("listedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
  } catch (e) {
    console.error("Failed to fetch cars", e);
    return [];
  }
}

export async function getCarById(id: string): Promise<Car | null> {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not configured');
    return null;
  }
  
  try {
    const carDoc = doc(db, "cars", id);
    const carSnap = await getDoc(carDoc);
    
    if (carSnap.exists()) {
      return { id: carSnap.id, ...carSnap.data() } as Car;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Failed to fetch car", e);
    return null;
  }
}

export async function addCar(carData: Omit<Car, 'id'>): Promise<string | null> {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not configured');
    return null;
  }
  
  try {
    const carsRef = collection(db, "cars");
    const docRef = await addDoc(carsRef, {
      ...carData,
      listedAt: new Date(),
      approved: false
    });
    return docRef.id;
  } catch (e) {
    console.error("Failed to add car", e);
    return null;
  }
}

export async function updateCar(id: string, carData: Partial<Car>): Promise<boolean> {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not configured');
    return false;
  }
  
  try {
    const carDoc = doc(db, "cars", id);
    await updateDoc(carDoc, carData);
    return true;
  } catch (e) {
    console.error("Failed to update car", e);
    return false;
  }
}

export async function deleteCar(id: string): Promise<boolean> {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not configured');
    return false;
  }
  
  try {
    const carDoc = doc(db, "cars", id);
    await deleteDoc(carDoc);
    return true;
  } catch (e) {
    console.error("Failed to delete car", e);
    return false;
  }
}

export async function updateCarApproval(id: string, approved: boolean): Promise<boolean> {
  return updateCar(id, { approved });
}

// Review functions
export async function addReview(carId: string, reviewData: any): Promise<string | null> {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not configured');
    return null;
  }
  
  try {
    const reviewsRef = collection(db, "reviews");
    const docRef = await addDoc(reviewsRef, {
      ...reviewData,
      carId,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (e) {
    console.error("Failed to add review", e);
    return null;
  }
}

export { db, auth };