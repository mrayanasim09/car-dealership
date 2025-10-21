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

async function addDisplayOrderColumn() {
  try {
    console.log('Adding display_order column to cars table...')
    
    // Add display_order column (integer, default 0)
    const { error: displayOrderError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE cars 
        ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0
      `
    })
    
    if (displayOrderError) {
      console.error('Error adding display_order column:', displayOrderError)
      console.log('Trying alternative approach...')
      
      // Try to update a single record to test if column exists
      const { error: testError } = await supabase
        .from('cars')
        .update({ display_order: 0 })
        .limit(1)
      
      if (testError) {
        console.log('Note: display_order column may need manual creation')
      }
    } else {
      console.log('✅ Successfully added display_order column')
    }
    
    // Get all cars ordered by listed_at to assign sequential display_order
    console.log('Initializing display_order for existing cars...')
    const { data: cars, error: fetchError } = await supabase
      .from('cars')
      .select('id, listed_at')
      .order('listed_at', { ascending: false })
    
    if (fetchError) {
      console.error('Error fetching cars:', fetchError)
      return
    }
    
    if (cars && cars.length > 0) {
      // Update each car with sequential display_order
      for (let i = 0; i < cars.length; i++) {
        const { error: updateError } = await supabase
          .from('cars')
          .update({ display_order: i + 1 })
          .eq('id', cars[i].id)
        
        if (updateError) {
          console.error(`Error updating car ${cars[i].id}:`, updateError)
        }
      }
      console.log(`✅ Updated ${cars.length} cars with display_order`)
    } else {
      console.log('No cars found to update')
    }
    
    // Verify the column exists by trying to select it
    const { data: testData, error: testError } = await supabase
      .from('cars')
      .select('id, display_order')
      .limit(3)
    
    if (testError) {
      console.error('❌ Error testing display_order column:', testError)
      console.log('\n📋 Manual Database Setup Required:')
      console.log('Please run these SQL commands in your Supabase SQL editor:')
      console.log(`
        -- Add display_order column
        ALTER TABLE cars ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
        
        -- Initialize display_order for existing cars
        UPDATE cars 
        SET display_order = subquery.row_number
        FROM (
          SELECT id, ROW_NUMBER() OVER (ORDER BY listed_at DESC) as row_number
          FROM cars
        ) subquery
        WHERE cars.id = subquery.id;
      `)
    } else {
      console.log('✅ display_order column verified successfully!')
      console.log('Sample data:', testData)
    }
    
  } catch (error) {
    console.error('Script error:', error)
    console.log('\n📋 Manual Database Setup Required:')
    console.log('Please run these SQL commands in your Supabase SQL editor:')
    console.log(`
      -- Add display_order column
      ALTER TABLE cars ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
      
      -- Initialize display_order for existing cars
      UPDATE cars 
      SET display_order = subquery.row_number
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY listed_at DESC) as row_number
        FROM cars
      ) subquery
      WHERE cars.id = subquery.id;
    `)
  }
}

addDisplayOrderColumn()
