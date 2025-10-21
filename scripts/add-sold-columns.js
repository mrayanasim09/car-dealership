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

async function addSoldColumns() {
  try {
    console.log('Adding sold and sold_at columns to cars table...')
    
    // Add sold column (boolean, default false)
    const { error: soldError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE cars 
        ADD COLUMN IF NOT EXISTS sold BOOLEAN DEFAULT FALSE
      `
    })
    
    if (soldError) {
      console.error('Error adding sold column:', soldError)
      // Try alternative approach using direct SQL
      console.log('Trying alternative approach...')
      
      const { error: altSoldError } = await supabase
        .from('cars')
        .update({ sold: false })
        .eq('sold', null)
        .limit(1)
      
      if (altSoldError) {
        console.log('Note: sold column may already exist or need manual creation')
      }
    } else {
      console.log('✅ Successfully added sold column')
    }
    
    // Add sold_at column (timestamp)
    const { error: soldAtError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE cars 
        ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP WITH TIME ZONE
      `
    })
    
    if (soldAtError) {
      console.error('Error adding sold_at column:', soldAtError)
      console.log('Note: sold_at column may already exist or need manual creation')
    } else {
      console.log('✅ Successfully added sold_at column')
    }
    
    // Update existing cars to have sold = false if not set
    const { error: updateError } = await supabase
      .from('cars')
      .update({ sold: false })
      .is('sold', null)
    
    if (updateError) {
      console.log('Note: Could not update existing cars (column may not exist yet)')
    } else {
      console.log('✅ Updated existing cars with sold = false')
    }
    
    // Verify the columns exist by trying to select them
    const { data: testData, error: testError } = await supabase
      .from('cars')
      .select('id, sold, sold_at')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error testing columns:', testError)
      console.log('\n📋 Manual Database Setup Required:')
      console.log('Please run these SQL commands in your Supabase SQL editor:')
      console.log(`
        -- Add sold column
        ALTER TABLE cars ADD COLUMN IF NOT EXISTS sold BOOLEAN DEFAULT FALSE;
        
        -- Add sold_at column  
        ALTER TABLE cars ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP WITH TIME ZONE;
        
        -- Update existing cars
        UPDATE cars SET sold = FALSE WHERE sold IS NULL;
      `)
    } else {
      console.log('✅ Columns verified successfully!')
      console.log('Sample data:', testData)
    }
    
  } catch (error) {
    console.error('Script error:', error)
    console.log('\n📋 Manual Database Setup Required:')
    console.log('Please run these SQL commands in your Supabase SQL editor:')
    console.log(`
      -- Add sold column
      ALTER TABLE cars ADD COLUMN IF NOT EXISTS sold BOOLEAN DEFAULT FALSE;
      
      -- Add sold_at column  
      ALTER TABLE cars ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP WITH TIME ZONE;
      
      -- Update existing cars
      UPDATE cars SET sold = FALSE WHERE sold IS NULL;
    `)
  }
}

addSoldColumns()
