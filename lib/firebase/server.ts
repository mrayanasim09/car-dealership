import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";
import type { Car } from "@/lib/types";

// Server-safe Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

// Enhanced debugging function
function logCarData(cars: Car[], context: string) {
  console.log(`📊 ${context} - Car Data Analysis:`);
  console.log(`Total cars: ${cars.length}`);
  
  if (cars.length > 0) {
    console.log("Sample car structure:", {
      id: cars[0].id,
      title: cars[0].title,
      approved: cars[0].approved,
      isInventory: cars[0].isInventory,
      isFeatured: cars[0].isFeatured,
      listedAt: cars[0].listedAt,
      createdAt: cars[0].createdAt,
      hasAllRequiredFields: {
        approved: typeof cars[0].approved === 'boolean',
        isInventory: typeof cars[0].isInventory === 'boolean',
        listedAt: !!cars[0].listedAt,
        createdAt: !!cars[0].createdAt
      }
    });
  }
  
  const breakdown = {
    total: cars.length,
    approved: cars.filter(car => car.approved === true).length,
    notApproved: cars.filter(car => car.approved === false).length,
    approvedUndefined: cars.filter(car => car.approved === undefined).length,
    inInventory: cars.filter(car => car.isInventory === true).length,
    notInInventory: cars.filter(car => car.isInventory === false).length,
    inventoryUndefined: cars.filter(car => car.isInventory === undefined).length,
    featured: cars.filter(car => car.isFeatured === true).length,
    hasListedAt: cars.filter(car => !!car.listedAt).length,
    hasCreatedAt: cars.filter(car => !!car.createdAt).length
  };
  
  console.log("Data breakdown:", breakdown);
  return breakdown;
}

// Server-side function to get all approved cars that are marked as inventory
export async function getAllCars(): Promise<Car[]> {
    try {
        console.log("🔄 Server: Fetching public cars from Firestore...");
        
        if (!db) {
            console.error("❌ Server: Firestore not initialized");
            return [];
        }

        const carsRef = collection(db, "cars");
        
        // First, try to get all cars to see what we have
        console.log("🔍 Server: Attempting to fetch all cars first...");
        const allCarsQuery = query(carsRef, limit(50));
        const allCarsSnapshot = await getDocs(allCarsQuery);
        const allCars = allCarsSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        } as Car));
        
        console.log(`📊 Server: Found ${allCars.length} total cars in database`);
        logCarData(allCars, "All Cars in Database");
        
        // Now try the filtered query
        console.log("🔍 Server: Attempting filtered query for public cars...");
        const q = query(
            carsRef, 
            where("approved", "==", true), 
            where("isInventory", "==", true),
            orderBy("listedAt", "desc")
        );
        
        const snapshot = await getDocs(q);
        const cars = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        } as Car));
        
        console.log(`✅ Server: Successfully fetched ${cars.length} public cars from Firestore`);
        logCarData(cars, "Public Cars (Filtered)");
        
        return cars;
    } catch (e) {
        console.error("❌ Server: Failed to fetch public cars from Firestore:", e);
        
        // Log detailed error information
        if (e instanceof Error) {
            console.error("❌ Server: Error details:", {
                message: e.message,
                stack: e.stack,
                name: e.name
            });
            
            // If it's a query error, try without ordering
            if (e.message.includes('orderBy') || e.message.includes('index')) {
                console.log("🔄 Server: Trying query without orderBy...");
                try {
                    const carsRef = collection(db, "cars");
                    const q = query(
                        carsRef, 
                        where("approved", "==", true), 
                        where("isInventory", "==", true)
                    );
                    
                    const snapshot = await getDocs(q);
                    const cars = snapshot.docs.map(doc => ({ 
                        id: doc.id, 
                        ...doc.data() 
                    } as Car));
                    
                    console.log(`✅ Server: Successfully fetched ${cars.length} cars without ordering`);
                    return cars;
                } catch (fallbackError) {
                    console.error("❌ Server: Fallback query also failed:", fallbackError);
                }
            }
        }
        
        return [];
    }
}

// Additional function to get all cars (including unapproved) for admin debugging
export async function getAllCarsForAdmin(): Promise<Car[]> {
    try {
        console.log("🔄 Server: Fetching all cars for admin...");
        
        if (!db) {
            console.error("❌ Server: Firestore not initialized");
            return [];
        }

        const carsRef = collection(db, "cars");
        
        // Try different ordering approaches
        let q;
        try {
            // First try with listedAt ordering
            q = query(carsRef, orderBy("listedAt", "desc"));
        } catch (orderError) {
            console.log("🔄 Server: listedAt ordering failed, trying createdAt...");
            try {
                q = query(carsRef, orderBy("createdAt", "desc"));
            } catch (createdAtError) {
                console.log("🔄 Server: createdAt ordering failed, using no ordering...");
                q = query(carsRef);
            }
        }
        
        const snapshot = await getDocs(q);
        const cars = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        } as Car));
        
        console.log(`✅ Server: Successfully fetched ${cars.length} total cars for admin`);
        logCarData(cars, "Admin View - All Cars");
        
        return cars;
    } catch (e) {
        console.error("❌ Server: Failed to fetch all cars for admin:", e);
        
        // Try a simple query without ordering
        try {
            console.log("🔄 Server: Trying simple query without ordering...");
            const carsRef = collection(db, "cars");
            const snapshot = await getDocs(carsRef);
            const cars = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            } as Car));
            
            console.log(`✅ Server: Successfully fetched ${cars.length} cars with simple query`);
            return cars;
        } catch (fallbackError) {
            console.error("❌ Server: Simple query also failed:", fallbackError);
            return [];
        }
    }
}

// New function to get detailed car information for debugging
export async function getCarDebugInfo(): Promise<any> {
    try {
        console.log("🔍 Server: Getting detailed car debug information...");
        
        if (!db) {
            return { error: "Firestore not initialized" };
        }

        const carsRef = collection(db, "cars");
        const snapshot = await getDocs(carsRef);
        const cars = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        } as Car));
        
        const debugInfo = {
            totalCars: cars.length,
            cars: cars.map(car => ({
                id: car.id,
                title: car.title,
                approved: car.approved,
                isInventory: car.isInventory,
                isFeatured: car.isFeatured,
                listedAt: car.listedAt,
                createdAt: car.createdAt,
                hasRequiredFields: {
                    approved: typeof car.approved === 'boolean',
                    isInventory: typeof car.isInventory === 'boolean',
                    listedAt: !!car.listedAt,
                    createdAt: !!car.createdAt
                }
            })),
            summary: {
                approved: cars.filter(car => car.approved === true).length,
                notApproved: cars.filter(car => car.approved === false).length,
                approvedUndefined: cars.filter(car => car.approved === undefined).length,
                inInventory: cars.filter(car => car.isInventory === true).length,
                notInInventory: cars.filter(car => car.isInventory === false).length,
                inventoryUndefined: cars.filter(car => car.isInventory === undefined).length,
                featured: cars.filter(car => car.isFeatured === true).length,
                hasListedAt: cars.filter(car => !!car.listedAt).length,
                hasCreatedAt: cars.filter(car => !!car.createdAt).length
            }
        };
        
        console.log("📊 Server: Debug info generated:", debugInfo);
        return debugInfo;
    } catch (e) {
        console.error("❌ Server: Failed to get debug info:", e);
        return { error: e instanceof Error ? e.message : "Unknown error" };
    }
}

// Server-side function to get a single car by ID
export async function getCarById(id: string): Promise<Car | null> {
    try {
        console.log(`🔄 Server: Fetching car with ID: ${id}`);
        
        if (!db) {
            console.error("❌ Server: Firestore not initialized");
            return null;
        }

        const carRef = doc(db, "cars", id);
        const carSnapshot = await getDoc(carRef);
        
        if (!carSnapshot.exists()) {
            console.log(`❌ Server: Car with ID ${id} not found`);
            return null;
        }
        
        const car = { 
            id: carSnapshot.id, 
            ...carSnapshot.data() 
        } as Car;
        
        console.log(`✅ Server: Successfully fetched car: ${car.title}`);
        return car;
    } catch (e) {
        console.error(`❌ Server: Failed to fetch car with ID ${id}:`, e);
        return null;
    }
}