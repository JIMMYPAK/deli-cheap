'use client';

import { useState, useEffect } from 'react';
import { FilterState, DEFAULT_FILTER, ALL_PLATFORMS, ALL_FILTER_METHODS } from '@/types/discount';
import { isFilterMethod, isPlatform } from '@/utils/discounts';

function normalizeSavedFilter(value: Partial<FilterState>): FilterState {
  const platforms = Array.isArray(value.platforms)
    ? value.platforms.filter(isPlatform)
    : [];
  const methods = Array.isArray(value.methods)
    ? value.methods.filter(isFilterMethod)
    : [];
  const maxMinOrder =
    typeof value.maxMinOrder === 'number' && value.maxMinOrder > 0
      ? value.maxMinOrder
      : null;

  return {
    platforms: platforms.length > 0 ? platforms : [...DEFAULT_FILTER.platforms],
    methods: methods.length > 0 ? methods : [...DEFAULT_FILTER.methods],
    maxMinOrder,
  };
}

export function useFilter() {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem('filterState');
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<FilterState>;
          setFilter(normalizeSavedFilter(parsed));
        }
      } catch {
        // ignore parse errors
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('filterState', JSON.stringify(filter));
  }, [filter, loaded]);

  const isFilterActive =
    filter.platforms.length < ALL_PLATFORMS.length ||
    filter.methods.length < ALL_FILTER_METHODS.length ||
    filter.maxMinOrder !== null;

  const activeFilterCount =
    (filter.platforms.length < ALL_PLATFORMS.length ? 1 : 0) +
    (filter.methods.length < ALL_FILTER_METHODS.length ? 1 : 0) +
    (filter.maxMinOrder !== null ? 1 : 0);

  return { filter, setFilter, isFilterActive, activeFilterCount };
}
