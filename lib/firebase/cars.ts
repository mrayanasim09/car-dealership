import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../cloudinary';
import type { Car, CarImage } from '../types';
import { generateSlug } from '../utils';

export class CarService {
  private static instance: CarService;
  private readonly CARS_COLLECTION = 'cars';

  static getInstance(): CarService {
    if (!CarService.instance) {
      CarService.instance = new CarService();
    }
    return CarService.instance;
  }

  // Create a new car listing
  async createCar(carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'slug'>, images: File[]): Promise<Car> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }

      // Upload images to Cloudinary first
      const uploadedImages: string[] = await Promise.all(
        images.map(async (image) => {
          return await uploadImageToCloudinary(image);
        })
      );

      // Generate slug
      const slug = generateSlug(`${carData.make} ${carData.model} ${carData.year}`);

      // Create car document in Firestore
      const carRef = await addDoc(collection(db, this.CARS_COLLECTION), {
        ...carData,
        images: uploadedImages,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        slug
      });

      // Get the created document
      const carDoc = await getDoc(carRef);
      return {
        id: carDoc.id,
        ...carDoc.data()
      } as Car;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  }

  // Get all cars with pagination
  async getCars(options: {
    featured?: boolean;
    limit?: number;
    lastDoc?: any;
  } = {}): Promise<{ cars: Car[]; lastDoc: any }> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }

      // Build query based on options
      const conditions = [];
      if (options.featured) conditions.push(where('isFeatured', '==', true));
      
      conditions.push(orderBy('createdAt', 'desc'));
      
      if (options.limit) conditions.push(limit(options.limit));
      if (options.lastDoc) conditions.push(startAfter(options.lastDoc));

      const q = query(collection(db, this.CARS_COLLECTION), ...conditions);

      const snapshot = await getDocs(q);
      const cars = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Car[];

      return {
        cars,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('Error getting cars:', error);
      throw error;
    }
  }

  // Get a single car by ID
  async getCarById(id: string): Promise<Car | null> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }
      const carDoc = await getDoc(doc(db, this.CARS_COLLECTION, id));
      if (!carDoc.exists()) return null;

      // Increment views
      await updateDoc(doc(db, this.CARS_COLLECTION, id), {
        views: increment(1)
      });

      return {
        id: carDoc.id,
        ...carDoc.data()
      } as Car;
    } catch (error) {
      console.error('Error getting car:', error);
      throw error;
    }
  }

  // Get a car by slug
  async getCarBySlug(slug: string): Promise<Car | null> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }
      const q = query(collection(db, this.CARS_COLLECTION), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      const carDoc = snapshot.docs[0];

      // Increment views
      await updateDoc(doc(db, this.CARS_COLLECTION, carDoc.id), {
        views: increment(1)
      });

      return {
        id: carDoc.id,
        ...carDoc.data()
      } as Car;
    } catch (error) {
      console.error('Error getting car by slug:', error);
      throw error;
    }
  }

  // Update a car
  async updateCar(id: string, updates: Partial<Car>, newImages?: File[]): Promise<Car> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }
      const carRef = doc(db, this.CARS_COLLECTION, id);
      const carDoc = await getDoc(carRef);
      
      if (!carDoc.exists()) {
        throw new Error('Car not found');
      }

      const currentCar = carDoc.data() as Car;
      let updatedImages = [...currentCar.images];

      // Handle new images if provided
      if (newImages && newImages.length > 0) {
        const newUploadedImages: string[] = await Promise.all(
          newImages.map(async (image, index) => {
            return await uploadImageToCloudinary(image);
          })
        );
        updatedImages = [...updatedImages, ...newUploadedImages];
      }

      // Update the document
      const updateData = {
        ...updates,
        images: updatedImages,
        updatedAt: serverTimestamp()
      };

      await updateDoc(carRef, updateData);

      // Get the updated document
      const updatedDoc = await getDoc(carRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Car;
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  }

  // Delete a car
  async deleteCar(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }
      const carRef = doc(db, this.CARS_COLLECTION, id);
      const carDoc = await getDoc(carRef);
      
      if (!carDoc.exists()) {
        throw new Error('Car not found');
      }

      // Delete images from Cloudinary
      const car = carDoc.data() as Car;
      await Promise.all(
        car.images.map(async (imageUrl) => {
          // Extract public ID from URL if possible
          const publicId = imageUrl.split('/').pop()?.split('.')[0];
          if (publicId) {
            await deleteImageFromCloudinary(publicId);
          }
        })
      );

      // Delete the document
      await deleteDoc(carRef);
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  }

  // Toggle car like status
  async toggleLike(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }
      const carRef = doc(db, this.CARS_COLLECTION, id);
      await updateDoc(carRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }



  // Search cars
  async searchCars(searchQuery: string, options: {
    limit?: number;
    lastDoc?: any;
  } = {}): Promise<{ cars: Car[]; lastDoc: any }> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }
      const searchTerms = searchQuery.toLowerCase().split(' ');
      
      // Build base query
      let q = query(
        collection(db, this.CARS_COLLECTION),
        where('searchTerms', 'array-contains-any', searchTerms),
        orderBy('createdAt', 'desc'),
        limit(options.limit || 10)
      );

      // Add startAfter if provided
      if (options.lastDoc) {
        q = query(q, startAfter(options.lastDoc));
      }

      const snapshot = await getDocs(q);
      const cars = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Car[];

      return {
        cars,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('Error searching cars:', error);
      throw error;
    }
  }
}

export const carService = CarService.getInstance();