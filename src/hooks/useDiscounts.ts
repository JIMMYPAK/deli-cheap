'use client';

import { useState, useEffect } from 'react';
import { DiscountInfo } from '@/types/discount';
import { supabase } from '@/utils/supabase';

function toFiniteNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** DB에 min_order_amount가 비어 있을 때, 배포된 public JSON으로 보강 */
function resolveMinOrderAmount(
  fromDb: unknown,
  localRow: DiscountInfo | undefined
): number {
  const fromDbNum = toFiniteNumber(fromDb, NaN);
  if (Number.isFinite(fromDbNum) && fromDb !== null && fromDb !== '') {
    return fromDbNum;
  }
  return toFiniteNumber(localRow?.minOrderAmount, 0);
}

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<DiscountInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLocalDiscounts() {
      const response = await fetch('/data/discounts.json');
      if (!response.ok) {
        throw new Error(`Failed to load local discounts: ${response.status}`);
      }
      const localData = await response.json();
      setDiscounts(localData);
    }

    async function loadLocalDiscountMap(): Promise<Map<string, DiscountInfo>> {
      const response = await fetch('/data/discounts.json');
      if (!response.ok) {
        throw new Error(`Failed to load local discounts: ${response.status}`);
      }
      const localData: DiscountInfo[] = await response.json();
      return new Map(localData.map((row) => [row.id, row]));
    }

    async function fetchDiscounts() {
      try {
        if (!supabase) {
          await loadLocalDiscounts();
          return;
        }

        const [{ data, error }, localById] = await Promise.all([
          supabase
            .from('discounts')
            .select(
              'sync_id, brand_name, platform, discount_amount, min_order_amount, description, category, method, delivery_types, special_condition, valid_until'
            ),
          loadLocalDiscountMap().catch(() => new Map<string, DiscountInfo>()),
        ]);

        if (error) {
          throw error;
        }
        
        if (!data || data.length === 0) {
          await loadLocalDiscounts();
        } else {
          const mappedData: DiscountInfo[] = data.map(item => ({
            id: item.sync_id,
            brandName: item.brand_name,
            platform: item.platform,
            discountAmount: toFiniteNumber(item.discount_amount, 0),
            minOrderAmount: resolveMinOrderAmount(item.min_order_amount, localById.get(item.sync_id)),
            description: item.description ?? '',
            category: item.category,
            // Supabase DB는 '픽업' enum 사용 → UI/필터는 '포장'으로 통일
            method: item.method === '픽업' ? '포장' : item.method,
            deliveryTypes: item.delivery_types ?? [],
            specialCondition: item.special_condition ?? null,
            validUntil: item.valid_until ?? undefined
          }));
          setDiscounts(mappedData);
        }
      } catch (supabaseErr) {
        // Supabase 실패 시에도 앱은 로컬 데이터로 동작한다.
        console.warn('Supabase fetch failed. Falling back to local data.');
        try {
          await loadLocalDiscounts();
        } catch (jsonErr) {
          setError(
            jsonErr instanceof Error
              ? jsonErr.message
              : supabaseErr instanceof Error
                ? supabaseErr.message
                : 'Unknown error'
          );
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDiscounts();
  }, []);

  return { discounts, loading, error };
}
