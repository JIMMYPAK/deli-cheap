'use client';

import { useState, useEffect } from 'react';
import { DiscountInfo } from '@/types/discount';
import { supabase } from '@/utils/supabase';

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

    async function fetchDiscounts() {
      try {
        if (!supabase) {
          await loadLocalDiscounts();
          return;
        }

        const { data, error } = await supabase
          .from('brands_discount')
          .select('*');

        if (error) {
          throw error;
        }
        
        if (!data || data.length === 0) {
          await loadLocalDiscounts();
        } else {
          setDiscounts(data);
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
