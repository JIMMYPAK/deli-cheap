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
      // salad 카테고리가 DB enum에 아직 없을 수 있으므로 burger로 매핑하여 업로드
      category: item.category === 'salad' ? 'burger' : item.category,
      // DB enum은 '픽업'을 사용하므로 '포장'→'픽업'으로 매핑 (UI에서는 항상 '포장' 표시)
      method: item.method === '포장' ? '픽업' : item.method,
      delivery_types: item.deliveryTypes,
      special_condition: item.specialCondition,
      valid_until: item.validUntil || null,
      updated_at: new Date().toISOString()
    }));

    // 1. Delete all existing data
    console.log('Clearing old data from Supabase...');
    const { error: deleteError } = await supabase
      .from('discounts')
      .delete()
      .not('sync_id', 'is', null); // Delete all rows

    if (deleteError) {
      throw new Error(`Failed to delete old data: ${deleteError.message}`);
    }

    // 2. Insert new data
    console.log('Inserting new data...');
    const { error: insertError } = await supabase
      .from('discounts')
      .insert(mappedData);

    if (insertError) {
      throw new Error(`Failed to insert new data: ${insertError.message}`);
    }

    console.log('Successfully cleared old data and uploaded new data to Supabase!');
  } catch (err) {
    console.error('Error during upload to Supabase:', err.message);
    process.exit(1);
  }
}

uploadToSupabase();
