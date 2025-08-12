require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function addDescriptionToCar() {
  try {
    const carId = '9c99bc24-606b-4c1d-b503-42b02d5a8cb5'
    
    const description = `This well-maintained 2010 Toyota Corolla S sedan offers excellent reliability and fuel efficiency. With only 108,864 miles, this vehicle has plenty of life left and is perfect for daily commuting or as a dependable family car.

Key Features:
• Automatic transmission for easy driving
• Front-wheel drive for excellent handling
• Gasoline engine for reliable performance
• Grey exterior with silver interior
• Clean title and well-documented service history

This Corolla is located in Lomita, CA and is ready for immediate purchase. Contact us today to schedule a test drive or for more information about this vehicle.`

    const { data, error } = await supabase
      .from('cars')
      .update({ 
        description: description,
        updated_at: new Date().toISOString()
      })
      .eq('id', carId)
      .select()

    if (error) {
      console.error('Error updating car:', error)
      return
    }

    console.log('Successfully updated car with description')
    console.log('Updated car:', data)
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

addDescriptionToCar()
