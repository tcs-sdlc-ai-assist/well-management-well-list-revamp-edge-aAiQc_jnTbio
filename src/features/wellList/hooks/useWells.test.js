import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWells } from './useWells.js';
import initialWells from '../data/initialWells.js';

const STORAGE_KEY = 'wellsData';

describe('useWells', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('initialization from seed data', () => {
    it('initializes with seed data when localStorage is empty', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(initialWells);
      expect(result.current.wells).toHaveLength(initialWells.length);
    });

    it('initializes with default filter, sort, pagination state', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.filters).toEqual({});
      expect(result.current.sortConfig).toEqual({ field: 'spudDate', direction: 'asc' });
      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
    });

    it('has no error on successful initialization', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.error).toBeNull();
    });

    it('computes paginatedWells from seed data', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.paginatedWells.length).toBeGreaterThan(0);
      expect(result.current.paginatedWells.length).toBeLessThanOrEqual(result.current.pageSize);
    });

    it('pins the active well to the top of pinnedWells', () => {
      const { result } = renderHook(() => useWells());
      const activeWell = result.current.pinnedWells.find((w) => w.status === 'active');
      expect(activeWell).toBeDefined();
      expect(result.current.pinnedWells[0].status).toBe('active');
    });
  });

  describe('restores from localStorage when data exists', () => {
    it('loads wells from localStorage when valid data exists', () => {
      const storedWells = initialWells.map((w) => ({
        ...w,
        status: w.id === 'well-005' ? 'active' : 'inactive',
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedWells));

      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(storedWells);
      const activeWell = result.current.wells.find((w) => w.status === 'active');
      expect(activeWell.id).toBe('well-005');
    });

    it('preserves all well properties from localStorage', () => {
      const storedWells = [
        {
          id: 'custom-001',
          status: 'active',
          rig: 'CUSTOM-RIG',
          wellName: 'Custom Well',
          wellId: 'CW-001',
          spudDate: '2024-06-01T00:00:00.000Z',
          operator: 'Custom Operator',
          contractor: 'Custom Contractor',
          country: 'Custom Country',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedWells));

      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(storedWells);
      expect(result.current.wells[0].rig).toBe('CUSTOM-RIG');
    });
  });

  describe('handles malformed localStorage data gracefully', () => {
    it('falls back to seed data when localStorage contains invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json {{{');

      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(initialWells);
      expect(result.current.error).not.toBeNull();
      expect(result.current.error.code).toBe('LOCALSTORAGE_UNAVAILABLE');
    });

    it('falls back to seed data when localStorage contains an empty array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(initialWells);
    });

    it('falls back to seed data when localStorage contains a non-array value', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));

      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(initialWells);
    });

    it('falls back to seed data when localStorage contains null', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(null));

      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(initialWells);
    });

    it('handles localStorage.getItem throwing an error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(initialWells);
      expect(result.current.error).not.toBeNull();
      expect(result.current.error.code).toBe('LOCALSTORAGE_UNAVAILABLE');
      expect(result.current.error.message).toBe('Storage access denied');
    });
  });

  describe('activateWell enforces single-active invariant', () => {
    it('activates the specified well and deactivates all others', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.activateWell('well-003');
      });

      const activeWells = result.current.wells.filter((w) => w.status === 'active');
      expect(activeWells).toHaveLength(1);
      expect(activeWells[0].id).toBe('well-003');
    });

    it('deactivates the previously active well when activating a new one', () => {
      const { result } = renderHook(() => useWells());

      const initialActive = result.current.wells.find((w) => w.status === 'active');
      expect(initialActive.id).toBe('well-001');

      act(() => {
        result.current.activateWell('well-005');
      });

      const previouslyActive = result.current.wells.find((w) => w.id === 'well-001');
      expect(previouslyActive.status).toBe('inactive');

      const newActive = result.current.wells.find((w) => w.id === 'well-005');
      expect(newActive.status).toBe('active');
    });

    it('returns success true when activating an existing well', () => {
      const { result } = renderHook(() => useWells());

      let activationResult;
      act(() => {
        activationResult = result.current.activateWell('well-002');
      });

      expect(activationResult.success).toBe(true);
      expect(activationResult.updatedWells).toBeDefined();
      expect(Array.isArray(activationResult.updatedWells)).toBe(true);
    });

    it('returns success false when activating a non-existent well', () => {
      const { result } = renderHook(() => useWells());

      let activationResult;
      act(() => {
        activationResult = result.current.activateWell('non-existent-id');
      });

      expect(activationResult.success).toBe(false);
      expect(activationResult.error).toBe('Well not found');
    });

    it('ensures only one well is active after multiple activations', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.activateWell('well-002');
      });

      act(() => {
        result.current.activateWell('well-004');
      });

      act(() => {
        result.current.activateWell('well-007');
      });

      const activeWells = result.current.wells.filter((w) => w.status === 'active');
      expect(activeWells).toHaveLength(1);
      expect(activeWells[0].id).toBe('well-007');
    });

    it('does not change wells state when activating a non-existent well', () => {
      const { result } = renderHook(() => useWells());

      const wellsBefore = result.current.wells;

      act(() => {
        result.current.activateWell('non-existent-id');
      });

      expect(result.current.wells).toBe(wellsBefore);
    });
  });

  describe('persists to localStorage on activation', () => {
    it('saves updated wells to localStorage after activation', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.activateWell('well-003');
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toBeDefined();
      expect(Array.isArray(stored)).toBe(true);

      const storedActive = stored.filter((w) => w.status === 'active');
      expect(storedActive).toHaveLength(1);
      expect(storedActive[0].id).toBe('well-003');
    });

    it('persists the single-active invariant to localStorage', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.activateWell('well-005');
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const storedPreviouslyActive = stored.find((w) => w.id === 'well-001');
      expect(storedPreviouslyActive.status).toBe('inactive');

      const storedNewActive = stored.find((w) => w.id === 'well-005');
      expect(storedNewActive.status).toBe('active');
    });

    it('handles localStorage.setItem throwing an error gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.activateWell('well-003');
      });

      expect(result.current.error).not.toBeNull();
      expect(result.current.error.code).toBe('LOCALSTORAGE_UNAVAILABLE');
      expect(result.current.error.message).toBe('QuotaExceededError');

      const activeWells = result.current.wells.filter((w) => w.status === 'active');
      expect(activeWells).toHaveLength(1);
      expect(activeWells[0].id).toBe('well-003');
    });
  });

  describe('resetWells', () => {
    it('resets wells to initial seed data', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.activateWell('well-005');
      });

      expect(result.current.wells.find((w) => w.status === 'active').id).toBe('well-005');

      act(() => {
        result.current.resetWells();
      });

      expect(result.current.wells).toEqual(initialWells);
      expect(result.current.filters).toEqual({});
      expect(result.current.sortConfig).toEqual({ field: 'spudDate', direction: 'asc' });
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('filtering integration', () => {
    it('resets currentPage to 1 when filters change', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.setFilters({ wellName: 'Thunder' });
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.filters).toEqual({ wellName: 'Thunder' });
    });
  });

  describe('sorting integration', () => {
    it('resets currentPage to 1 when sort config changes', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      act(() => {
        result.current.setSortConfig({ field: 'spudDate', direction: 'desc' });
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.sortConfig).toEqual({ field: 'spudDate', direction: 'desc' });
    });
  });

  describe('pagination integration', () => {
    it('resets currentPage to 1 when page size changes', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(25);
    });

    it('computes totalPages correctly based on wells and pageSize', () => {
      const { result } = renderHook(() => useWells());

      expect(result.current.totalPages).toBe(Math.max(1, Math.ceil(initialWells.length / 10)));

      act(() => {
        result.current.setPageSize(50);
      });

      expect(result.current.totalPages).toBe(1);
    });

    it('paginatedWells does not exceed pageSize', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.paginatedWells.length).toBeLessThanOrEqual(result.current.pageSize);
    });
  });
});