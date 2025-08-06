import { NextResponse } from 'next/server';
import { getAllCars } from '@/lib/firebase';

// Disable caching for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Add timestamp to ensure fresh data
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] Debug API: Fetching cars from Firebase...`);
    
    const cars = await getAllCars();
    
    console.log(`[${timestamp}] Debug API: Found ${cars.length} total cars`);
    
    // Detailed analysis of each car
    const carDetails = cars.map(car => ({
      id: car.id,
      title: car.title,
      approved: car.approved,
      isInventory: car.isInventory,
      isFeatured: car.isFeatured,
      listedAt: car.listedAt,
      hasImages: car.images && car.images.length > 0,
      imageCount: car.images ? car.images.length : 0,
    }));
    
    // Calculate statistics
    const approvedCars = cars.filter(car => car.approved === true);
    const inventoryCars = cars.filter(car => car.approved === true && car.isInventory !== false);
    const featuredCars = cars.filter(car => car.approved === true && car.isFeatured === true);
    const pendingCars = cars.filter(car => car.approved !== true);
    
    const response = {
      success: true,
      timestamp,
      totalCars: cars.length,
      approvedCars: approvedCars.length,
      inventoryCars: inventoryCars.length,
      featuredCars: featuredCars.length,
      pendingCars: pendingCars.length,
      cars: carDetails,
      // Additional debugging info
      debug: {
        approvedCarIds: approvedCars.map(car => car.id),
        inventoryCarIds: inventoryCars.map(car => car.id),
        featuredCarIds: featuredCars.map(car => car.id),
        pendingCarIds: pendingCars.map(car => car.id),
      }
    };
    
    console.log(`[${timestamp}] Debug API: Returning response:`, {
      totalCars: response.totalCars,
      approvedCars: response.approvedCars,
      inventoryCars: response.inventoryCars,
      featuredCars: response.featuredCars,
      pendingCars: response.pendingCars,
    });
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Debug API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}

// Add a POST endpoint to force refresh
export async function POST() {
  try {
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] Debug API POST: Force refresh requested`);
    
    // This endpoint can be used to trigger a manual refresh
    // You could add cache invalidation logic here if needed
    
    return NextResponse.json({
      success: true,
      message: 'Refresh triggered',
      timestamp,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Debug API POST Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}

