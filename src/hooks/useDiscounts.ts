'use client';

import { useState, useEffect } from 'react';
import { DiscountInfo } from '@/types/discount';
import { supabase } from '@/utils/supabase';
import { DiscountDataStats, filterCurrentDiscounts } from '@/utils/discounts';

const EMPTY_STATS: DiscountDataStats = {
  activeCount: 0,
  expiredExcludedCount: 0,
  unknownExpiryCount: 0,
  source: 'local',
};

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
  const [stats, setStats] = useState<DiscountDataStats>(EMPTY_STATS);

  useEffect(() => {
    let cancelled = false;

    async function loadLocalDiscounts(): Promise<DiscountInfo[]> {
      const response = await fetch('/data/discounts.json');
      if (!response.ok) {
        throw new Error(`Failed to load local discounts: ${response.status}`);
      }
      return response.json();
    }

    async function fetchDiscounts() {
      let localData: DiscountInfo[] = [];

      try {
        localData = await loadLocalDiscounts();
        if (!cancelled) {
          const currentLocal = filterCurrentDiscounts(localData, 'local');
          setDiscounts(currentLocal.discounts);
          setStats(currentLocal.stats);
          setLoading(false);
        }
      } catch (localErr) {
        if (!supabase) {
          if (!cancelled) {
            setError(localErr instanceof Error ? localErr.message : 'Unknown error');
            setLoading(false);
          }
          return;
        }
      }

      if (!supabase) return;

      try {
        const localById = new Map(localData.map((row) => [row.id, row]));
        const { data, error } = await supabase
          .from('discounts')
          .select(
            'sync_id, brand_name, platform, discount_amount, min_order_amount, description, category, method, delivery_types, special_condition, valid_until'
          );

        if (cancelled) return;
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const mappedData: DiscountInfo[] = data.map((item) => ({
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
            validUntil: item.valid_until ?? undefined,
          }));
          const currentRemote = filterCurrentDiscounts(mappedData, 'supabase');
          if (currentRemote.discounts.length > 0 || localData.length === 0) {
            setDiscounts(currentRemote.discounts);
            setStats(currentRemote.stats);
          }
          setError(null);
        }
      } catch (supabaseErr) {
        // Supabase 실패 시에도 앱은 이미 로컬 데이터로 동작한다.
        console.warn('Supabase fetch failed. Falling back to local data.', supabaseErr);
        if (localData.length === 0 && !cancelled) {
          setError(
            supabaseErr instanceof Error
              ? supabaseErr.message
              : 'Unknown error'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDiscounts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { discounts, loading, error, stats };
}
