const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function uploadToSupabase() {
  try {
    const dataPath = path.join(process.cwd(), 'public/data/discounts.json');
    const discountsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log(`Starting upload of ${discountsData.length} items to Supabase...`);

    // Map JSON fields to database columns
    const mappedData = discountsData.map(item => ({
      sync_id: item.id,
      brand_name: item.brandName,
      platform: item.platform,
      discount_amount: item.discountAmount,
      min_order_amount: item.minOrderAmount,
      description: item.description,
      category: item.category,
      method: item.method,
      delivery_types: item.deliveryTypes,
      special_condition: item.specialCondition,
      updated_at: new Date().toISOString()
    }));

    // Perform UPSERT using the 'sync_id' as the conflict target
    const { data, error } = await supabase
      .from('discounts')
      .upsert(mappedData, { onConflict: 'sync_id' });

    if (error) {
      throw error;
    }

    console.log('Successfully uploaded and synchronized data with Supabase!');
  } catch (err) {
    console.error('Error during upload to Supabase:', err.message);
    process.exit(1);
  }
}

uploadToSupabase();
