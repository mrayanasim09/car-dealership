import { initializeApp, type FirebaseApp } from "firebase/app"
import {
  getFirestore,
  type Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { 
  getStorage, 
  type FirebaseStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from "firebase/storage"
import { getAuth, type Auth } from "firebase/auth"
import type { Car, Review } from "./types"

// Firebase configuration - Only use environment variables for security
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
let app: FirebaseApp | null = null
export let db: Firestore | null = null
export let storage: FirebaseStorage | null = null
export let auth: Auth | null = null
let isInitialized = false

const initializationStatus = {
  app: false,
  firestore: false,
  storage: false,
  auth: false,
  error: null as string | null,
}

export const initializeFirebase = async () => {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    console.log("🔥 Firebase initialization skipped on server side")
    return
  }

  if (isInitialized) return

  try {
    console.log("🔥 Starting Firebase initialization...")

    // Check if required environment variables are set
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      throw new Error("Firebase API key not configured. Please set NEXT_PUBLIC_FIREBASE_API_KEY environment variable.")
    }

    // Initialize Firebase App
    app = initializeApp(firebaseConfig)
    initializationStatus.app = true
    console.log("✅ Firebase App initialized")

    // Initialize Auth first (usually most reliable)
    try {
      auth = getAuth(app)
      initializationStatus.auth = true
      console.log("✅ Firebase Auth initialized")
    } catch (authError) {
      console.warn("⚠️ Firebase Auth initialization failed:", authError)
    }

    // Initialize Storage
    try {
      storage = getStorage(app)
      initializationStatus.storage = true
      console.log("✅ Firebase Storage initialized")
    } catch (storageError) {
      console.warn("⚠️ Firebase Storage initialization failed:", storageError)
    }

    // Initialize Firestore with retry logic
    try {
      db = getFirestore(app)

      // Test Firestore connection with a simple operation
      await testFirestoreConnection()
      initializationStatus.firestore = true
      console.log("✅ Firebase Firestore initialized and tested")
    } catch (firestoreError: any) {
      console.warn("⚠️ Firebase Firestore initialization failed:", firestoreError)
      db = null
      initializationStatus.error = `Firestore: ${firestoreError.message}`
    }
  } catch (error: any) {
    console.error("❌ Firebase app initialization failed:", error)
    initializationStatus.error = `App initialization: ${error.message}`
    app = null
  }

  isInitialized = true
}

// Test Firestore connection
const testFirestoreConnection = async () => {
  if (!db) throw new Error("Firestore not initialized")

  try {
    // Try to read from a collection (this will fail gracefully if Firestore isn't enabled)
    const testCollection = collection(db, "test")
    // This doesn't actually fetch data, just creates a reference
    console.log("Firestore connection test passed")
  } catch (error: any) {
    throw new Error(`Firestore connection test failed: ${error.message}`)
  }
}

// Initialize Firebase immediately only on client side
if (typeof window !== 'undefined') {
  initializeFirebase()
}

// Mock data with Cloudinary images for development
const mockCars: Car[] = []

const mockReviews: Review[] = [
  {
    id: "1",
    carId: "1",
    name: "John D.",
    comment: "Smooth process, great car! Very satisfied with the purchase.",
    stars: 5,
    createdAt: { seconds: Date.now() / 1000 },
  },
  {
    id: "2",
    carId: "2",
    name: "Sarah M.",
    comment: "Reliable and fuel efficient. Great value for money!",
    stars: 5,
    createdAt: { seconds: Date.now() / 1000 },
  },
  {
    id: "3",
    carId: "4",
    name: "Mike R.",
    comment: "Amazing driving experience. The car is in excellent condition!",
    stars: 5,
    createdAt: { seconds: Date.now() / 1000 },
  },
  {
    id: "4",
    carId: "6",
    name: "Lisa K.",
    comment: "Fantastic car with all the latest features. Highly recommend!",
    stars: 5,
    createdAt: { seconds: Date.now() / 1000 },
  },
]

// Mock contact messages for demo
const mockContactMessages = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    subject: "Interested in 2021 Honda Civic",
    message: "Hi, I'm interested in the 2021 Honda Civic LX. Is it still available? Can I schedule a test drive?",
    createdAt: { seconds: Date.now() / 1000 - 3600 },
    read: false,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    subject: "Financing Options",
    message:
      "Could you please provide information about financing options for the Toyota Camry? What are the current rates?",
    createdAt: { seconds: Date.now() / 1000 - 7200 },
    read: true,
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    email: "mike.r@email.com",
    phone: "+1-555-0456",
    subject: "Trade-in Value",
    message: "I have a 2015 Ford Focus that I'd like to trade in. Can you give me an estimate of its value?",
    createdAt: { seconds: Date.now() / 1000 - 86400 },
    read: false,
  },
]

// Utility functions
export const isFirebaseAvailable = () => {
  return initializationStatus.app && initializationStatus.auth
}

export const isFirestoreAvailable = () => {
  return initializationStatus.firestore && db !== null
}

export const isStorageAvailable = () => {
  return initializationStatus.storage && storage !== null
}

export const getFirebaseStatus = () => {
  return { ...initializationStatus }
}

export const ensureFirebaseInitialized = async () => {
  if (!isInitialized) {
    await initializeFirebase()
  }
  return { app, db, storage, auth }
}

// Image upload functions
export async function uploadCarImage(file: File, carId: string, imageIndex: number): Promise<string> {
  if (!isStorageAvailable()) {
    throw new Error("Firebase Storage is not available. Please check your Firebase configuration.")
  }

  try {
    // Create a reference to the file location
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${carId}_${imageIndex}_${Date.now()}.${fileExtension}`
    const imageRef = ref(storage!, `cars/${carId}/${fileName}`)

    // Upload the file
    console.log(`🔄 Uploading image: ${fileName}`)
    const snapshot = await uploadBytes(imageRef, file)
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log(`✅ Image uploaded successfully: ${downloadURL}`)
    
    return downloadURL
  } catch (error) {
    console.error("❌ Error uploading image:", error)
    throw error
  }
}

export async function uploadMultipleCarImages(files: File[], carId: string): Promise<string[]> {
  if (!isStorageAvailable()) {
    throw new Error("Firebase Storage is not available. Please check your Firebase configuration.")
  }

  try {
    const uploadPromises = files.map((file, index) => uploadCarImage(file, carId, index))
    const imageUrls = await Promise.all(uploadPromises)
    console.log(`✅ Uploaded ${imageUrls.length} images for car ${carId}`)
    return imageUrls
  } catch (error) {
    console.error("❌ Error uploading multiple images:", error)
    throw error
  }
}

export async function deleteCarImage(imageUrl: string): Promise<void> {
  if (!isStorageAvailable()) {
    throw new Error("Firebase Storage is not available. Please check your Firebase configuration.")
  }

  try {
    // Create reference from URL
    const imageRef = ref(storage!, imageUrl)
    await deleteObject(imageRef)
    console.log(`✅ Image deleted successfully: ${imageUrl}`)
  } catch (error) {
    console.error("❌ Error deleting image:", error)
    throw error
  }
}

// Enhanced car functions with image support
export async function getCars(): Promise<Car[]> {
  if (!isFirestoreAvailable()) {
    console.log("📦 Using mock data for getCars (Firestore not available)")
    return mockCars.filter((car) => car.approved)
  }

  try {
    const carsRef = collection(db!, "cars")
    // Simplified query - just get all approved cars
    // The isInventory flag will be checked client-side
    const q = query(
      carsRef, 
      where("approved", "==", true),
      orderBy("listedAt", "desc")
    )
    const snapshot = await getDocs(q)
    console.log("🔥 Fetched cars from Firestore:", snapshot.docs.length)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Car)
  } catch (error) {
    console.error("❌ Error fetching cars from Firestore:", error)
    return mockCars.filter((car) => car.approved)
  }
}

export async function getAllCars(): Promise<Car[]> {
  if (!isFirestoreAvailable()) {
    console.log("📦 Using mock data for getAllCars (Firestore not available)")
    return mockCars
  }

  try {
    const carsRef = collection(db!, "cars")
    const q = query(carsRef, orderBy("listedAt", "desc"))
    const snapshot = await getDocs(q)
    console.log("🔥 Fetched all cars from Firestore:", snapshot.docs.length)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Car)
  } catch (error) {
    console.error("❌ Error fetching all cars from Firestore:", error)
    return mockCars
  }
}

export async function getFeaturedCars(): Promise<Car[]> {
  if (!isFirestoreAvailable()) {
    console.log("📦 Using mock data for getFeaturedCars (Firestore not available)")
    return mockCars.filter((car) => car.approved).slice(0, 6)
  }

  try {
    const carsRef = collection(db!, "cars")
    // Simplified query - just get all approved cars
    // The isFeatured flag will be checked client-side
    const q = query(
      carsRef, 
      where("approved", "==", true),
      orderBy("listedAt", "desc"),
      limit(12)
    )
    const snapshot = await getDocs(q)
    console.log("🔥 Fetched featured cars from Firestore:", snapshot.docs.length)
    // Filter for featured cars client-side
    const cars = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Car)
    return cars.filter(car => car.isFeatured !== false).slice(0, 6)
  } catch (error) {
    console.error("❌ Error fetching featured cars from Firestore:", error)
    return mockCars.filter((car) => car.approved).slice(0, 6)
  }
}

export async function getCarById(id: string): Promise<Car | null> {
  if (!isFirestoreAvailable()) {
    console.log("📦 Using mock data for getCarById (Firestore not available)")
    return mockCars.find((car) => car.id === id) || null
  }

  try {
    const carRef = doc(db!, "cars", id)
    const snapshot = await getDoc(carRef)
    if (snapshot.exists()) {
      console.log("🔥 Fetched car from Firestore:", id)
      return { id: snapshot.id, ...snapshot.data() } as Car
    }
    return null
  } catch (error) {
    console.error("❌ Error fetching car by ID from Firestore:", error)
    return mockCars.find((car) => car.id === id) || null
  }
}

export async function addCar(carData: Omit<Car, "id">): Promise<Car> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    // Set default values for isInventory and isFeatured if not provided
    const dataWithDefaults = {
      ...carData,
      isInventory: carData.isInventory !== false, // Default to true if not explicitly set to false
      isFeatured: carData.isFeatured === true, // Default to false unless explicitly set to true
      images: carData.images || [], // Ensure images array exists
    }
    
    const carsRef = collection(db!, "cars")
    const docRef = await addDoc(carsRef, {
      ...dataWithDefaults,
      listedAt: serverTimestamp(),
    })
    console.log("🔥 Added car to Firestore:", docRef.id)
    return { id: docRef.id, ...dataWithDefaults } as Car
  } catch (error) {
    console.error("❌ Error adding car to Firestore:", error)
    throw error
  }
}

export async function addCarWithImages(carData: Omit<Car, "id">, imageFiles: File[]): Promise<Car> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    // First, add the car without images to get an ID
    const carWithoutImages = { ...carData, images: [] }
    const newCar = await addCar(carWithoutImages)
    
    // Then upload images if provided
    if (imageFiles && imageFiles.length > 0) {
      console.log(`🔄 Uploading ${imageFiles.length} images for car ${newCar.id}`)
      const imageUrls = await uploadMultipleCarImages(imageFiles, newCar.id)
      
      // Update the car with image URLs
      await updateCar(newCar.id, { images: imageUrls })
      newCar.images = imageUrls
    }
    
    return newCar
  } catch (error) {
    console.error("❌ Error adding car with images:", error)
    throw error
  }
}

export async function updateCar(id: string, carData: Partial<Car>): Promise<Car> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    const carRef = doc(db!, "cars", id)
    await updateDoc(carRef, carData)
    console.log("🔥 Updated car in Firestore:", id)
    return { id, ...carData } as Car
  } catch (error) {
    console.error("❌ Error updating car in Firestore:", error)
    throw error
  }
}

export async function updateCarWithImages(id: string, carData: Partial<Car>, newImageFiles?: File[]): Promise<Car> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    let updatedData = { ...carData }
    
    // If new images are provided, upload them
    if (newImageFiles && newImageFiles.length > 0) {
      console.log(`🔄 Uploading ${newImageFiles.length} new images for car ${id}`)
      const newImageUrls = await uploadMultipleCarImages(newImageFiles, id)
      
      // Combine with existing images if any
      const existingImages = carData.images || []
      updatedData.images = [...existingImages, ...newImageUrls]
    }
    
    return await updateCar(id, updatedData)
  } catch (error) {
    console.error("❌ Error updating car with images:", error)
    throw error
  }
}

export async function deleteCar(id: string): Promise<void> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    // First, get the car to access its images
    const car = await getCarById(id)
    
    // Delete associated images from storage
    if (car && car.images && car.images.length > 0) {
      console.log(`🔄 Deleting ${car.images.length} images for car ${id}`)
      const deletePromises = car.images.map(imageUrl => deleteCarImage(imageUrl))
      await Promise.all(deletePromises)
    }
    
    // Then delete the car document
    const carRef = doc(db!, "cars", id)
    await deleteDoc(carRef)
    console.log("🔥 Deleted car from Firestore:", id)
  } catch (error) {
    console.error("❌ Error deleting car from Firestore:", error)
    throw error
  }
}

export async function updateCarApproval(id: string, approved: boolean): Promise<void> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    const carRef = doc(db!, "cars", id)
    await updateDoc(carRef, { approved })
    console.log("🔥 Updated car approval in Firestore:", id, approved)
  } catch (error) {
    console.error("❌ Error updating car approval in Firestore:", error)
    throw error
  }
}

// Review functions
export async function getReviews(): Promise<Review[]> {
  if (!isFirestoreAvailable()) {
    console.log("📦 Using mock data for getReviews (Firestore not available)")
    return mockReviews
  }

  try {
    const reviewsRef = collection(db!, "reviews")
    const q = query(reviewsRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    console.log("🔥 Fetched reviews from Firestore:", snapshot.docs.length)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Review)
  } catch (error) {
    console.error("❌ Error fetching reviews from Firestore:", error)
    return mockReviews
  }
}

export async function addReview(reviewData: Omit<Review, "id">): Promise<Review> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    const reviewsRef = collection(db!, "reviews")
    const docRef = await addDoc(reviewsRef, {
      ...reviewData,
      createdAt: serverTimestamp(),
    })
    console.log("🔥 Added review to Firestore:", docRef.id)
    return { id: docRef.id, ...reviewData } as Review
  } catch (error) {
    console.error("❌ Error adding review to Firestore:", error)
    throw error
  }
}

export async function deleteReview(id: string): Promise<void> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    const reviewRef = doc(db!, "reviews", id)
    await deleteDoc(reviewRef)
    console.log("🔥 Deleted review from Firestore:", id)
  } catch (error) {
    console.error("❌ Error deleting review from Firestore:", error)
    throw error
  }
}

// Contact message functions
export async function getContactMessages(): Promise<any[]> {
  if (!isFirestoreAvailable()) {
    console.log("📦 Using mock data for getContactMessages (Firestore not available)")
    return mockContactMessages
  }

  try {
    const messagesRef = collection(db!, "messages")
    const q = query(messagesRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    console.log("🔥 Fetched contact messages from Firestore:", snapshot.docs.length)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("❌ Error fetching contact messages from Firestore:", error)
    return mockContactMessages
  }
}

export async function addContactMessage(messageData: any): Promise<any> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    const messagesRef = collection(db!, "messages")
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      createdAt: serverTimestamp(),
      read: false,
    })
    console.log("🔥 Added contact message to Firestore:", docRef.id)
    return { id: docRef.id, ...messageData } as any
  } catch (error) {
    console.error("❌ Error adding contact message to Firestore:", error)
    throw error
  }
}

export async function updateContactMessageStatus(id: string, read: boolean): Promise<void> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    const messageRef = doc(db!, "messages", id)
    await updateDoc(messageRef, { read })
    console.log("🔥 Updated contact message status in Firestore:", id, read)
  } catch (error) {
    console.error("❌ Error updating contact message status in Firestore:", error)
    throw error
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  if (!isFirestoreAvailable()) {
    throw new Error(
      "Firestore is not available. Please check your Firebase configuration and ensure Firestore is enabled.",
    )
  }

  try {
    const messageRef = doc(db!, "messages", id)
    await deleteDoc(messageRef)
    console.log("🔥 Deleted contact message from Firestore:", id)
  } catch (error) {
    console.error("❌ Error deleting contact message from Firestore:", error)
    throw error
  }
}

// Export all Firebase related objects and functions
export { app }

// Alias functions for backward compatibility
export const markMessageAsRead = updateContactMessageStatus
export const deleteMessage = deleteContactMessage

// Analytics function (mock implementation)
export async function getAnalytics(): Promise<any> {
  return {
    totalCars: 0,
    totalReviews: 0,
    totalMessages: 0,
    recentActivity: []
  }
}

// Contact form submission function
export async function submitContactForm(formData: any): Promise<any> {
  return addContactMessage(formData)
}