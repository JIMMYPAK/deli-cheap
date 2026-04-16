'use client';

import { useState, useEffect } from 'react';
import { FilterState, DEFAULT_FILTER, ALL_PLATFORMS, ALL_FILTER_METHODS } from '@/types/discount';

export function useFilter() {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('filterState');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FilterState>;
        setFilter({
          platforms: Array.isArray(parsed.platforms) ? parsed.platforms : DEFAULT_FILTER.platforms,
          methods: Array.isArray(parsed.methods) ? parsed.methods : DEFAULT_FILTER.methods,
          maxMinOrder: parsed.maxMinOrder ?? null,
        });
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
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

  const resetFilter = () => setFilter(DEFAULT_FILTER);

  return { filter, setFilter, isFilterActive, activeFilterCount, resetFilter };
}
