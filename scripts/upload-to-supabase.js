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

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function uploadToSupabase() {
  try {
    const dataPath = path.join(process.cwd(), 'public/data/discounts.json');
    const discountsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    if (!Array.isArray(discountsData) || discountsData.length === 0) {
      throw new Error('Refusing to sync an empty discounts dataset.');
    }

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
      // DB enum은 '픽업'을 사용하므로 '포장'→'픽업'으로 매핑 (UI에서는 항상 '포장' 표시)
      method: item.method === '포장' ? '픽업' : item.method,
      delivery_types: item.deliveryTypes,
      special_condition: item.specialCondition,
      valid_until: item.validUntil || null,
      updated_at: new Date().toISOString()
    }));

    // 새 데이터부터 upsert한다. 실패해도 기존 운영 데이터는 유지된다.
    console.log('Upserting current data...');
    const { error: upsertError } = await supabase
      .from('discounts')
      .upsert(mappedData, { onConflict: 'sync_id' });

    if (upsertError) {
      throw new Error(`Failed to upsert data: ${upsertError.message}`);
    }

    // upsert 성공 뒤에만 더 이상 존재하지 않는 이전 행을 정리한다.
    const { data: existingRows, error: selectError } = await supabase
      .from('discounts')
      .select('sync_id');

    if (selectError) {
      throw new Error(`Failed to read existing ids: ${selectError.message}`);
    }

    const currentIds = new Set(mappedData.map((item) => item.sync_id));
    const staleIds = (existingRows || [])
      .map((item) => item.sync_id)
      .filter((id) => id && !currentIds.has(id));

    for (let index = 0; index < staleIds.length; index += 100) {
      const chunk = staleIds.slice(index, index + 100);
      const { error: deleteError } = await supabase
        .from('discounts')
        .delete()
        .in('sync_id', chunk);

      if (deleteError) {
        throw new Error(`Failed to delete stale data: ${deleteError.message}`);
      }
    }

    console.log(`Successfully synced ${mappedData.length} rows and removed ${staleIds.length} stale rows.`);
  } catch (err) {
    console.error('Error during upload to Supabase:', err.message);
    process.exit(1);
  }
}

uploadToSupabase();
