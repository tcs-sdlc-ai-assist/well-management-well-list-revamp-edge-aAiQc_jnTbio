import { useState, useCallback, useMemo } from 'react';
import initialWells from '../data/initialWells.js';
import { filterWells } from '../utils/filterWells.js';
import { sortWells } from '../utils/sortWells.js';
import { pinActive } from '../utils/pinActive.js';

const STORAGE_KEY = 'wellsData';

/**
 * Attempts to read wells data from localStorage.
 * Falls back to initialWells seed data if unavailable or invalid.
 *
 * @returns {{ wells: Array<Object>, error: null | { code: string, message: string } }}
 */
function loadWellsFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { wells: parsed, error: null };
      }
    }
    return { wells: initialWells, error: null };
  } catch (e) {
    return {
      wells: initialWells,
      error: { code: 'LOCALSTORAGE_UNAVAILABLE', message: e.message },
    };
  }
}

/**
 * Attempts to persist wells data to localStorage.
 *
 * @param {Array<Object>} wells - Array of well objects to persist
 * @returns {null | { code: string, message: string }} Error object or null on success
 */
function persistWells(wells) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wells));
    return null;
  } catch (e) {
    return { code: 'LOCALSTORAGE_UNAVAILABLE', message: e.message };
  }
}

/**
 * Custom React hook that encapsulates all well state management.
 * Initializes wells from localStorage (key 'wellsData') or falls back to initialWells seed data.
 * Exposes wells array, activation logic, filtering, sorting, pinning, and pagination.
 * Persists wells[] to localStorage on every mutation.
 * Does NOT persist filters, sortConfig, currentPage, or pageSize.
 *
 * @returns {{
 *   wells: Array<Object>,
 *   filters: Object,
 *   sortConfig: { field: string, direction: string },
 *   currentPage: number,
 *   pageSize: number,
 *   setFilters: Function,
 *   setSortConfig: Function,
 *   setCurrentPage: Function,
 *   setPageSize: Function,
 *   activateWell: (wellId: string) => { success: boolean, error?: string, updatedWells?: Array<Object> },
 *   resetWells: () => void,
 *   error: null | { code: string, message: string },
 *   filteredWells: Array<Object>,
 *   sortedWells: Array<Object>,
 *   pinnedWells: Array<Object>,
 *   paginatedWells: Array<Object>,
 *   totalPages: number
 * }}
 */
export function useWells() {
  const [error, setError] = useState(() => {
    const { error: loadError } = loadWellsFromStorage();
    return loadError;
  });

  const [wells, setWells] = useState(() => {
    const { wells: loadedWells } = loadWellsFromStorage();
    return loadedWells;
  });

  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: 'spudDate', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activateWell = useCallback(
    (wellId) => {
      const wellExists = wells.find((w) => w.id === wellId);
      if (!wellExists) {
        return { success: false, error: 'Well not found' };
      }

      const updatedWells = wells.map((w) => ({
        ...w,
        status: w.id === wellId ? 'active' : 'inactive',
      }));

      const persistError = persistWells(updatedWells);
      if (persistError) {
        setError(persistError);
      } else {
        setError(null);
      }

      setWells(updatedWells);
      return { success: true, updatedWells };
    },
    [wells],
  );

  const resetWells = useCallback(() => {
    const persistError = persistWells(initialWells);
    if (persistError) {
      setError(persistError);
    } else {
      setError(null);
    }
    setWells(initialWells);
    setFilters({});
    setSortConfig({ field: 'spudDate', direction: 'asc' });
    setCurrentPage(1);
  }, []);

  const filteredWells = useMemo(() => filterWells(wells, filters), [wells, filters]);

  const sortedWells = useMemo(() => sortWells(filteredWells, sortConfig), [filteredWells, sortConfig]);

  const pinnedWells = useMemo(() => pinActive(sortedWells), [sortedWells]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(pinnedWells.length / pageSize)),
    [pinnedWells, pageSize],
  );

  const paginatedWells = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    return pinnedWells.slice(startIndex, startIndex + pageSize);
  }, [pinnedWells, currentPage, pageSize, totalPages]);

  const handleSetFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSetSortConfig = useCallback((newSortConfig) => {
    setSortConfig(newSortConfig);
    setCurrentPage(1);
  }, []);

  const handleSetPageSize = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  return {
    wells,
    filters,
    sortConfig,
    currentPage,
    pageSize,
    setFilters: handleSetFilters,
    setSortConfig: handleSetSortConfig,
    setCurrentPage,
    setPageSize: handleSetPageSize,
    activateWell,
    resetWells,
    error,
    filteredWells,
    sortedWells,
    pinnedWells,
    paginatedWells,
    totalPages,
  };
}

export default useWells;