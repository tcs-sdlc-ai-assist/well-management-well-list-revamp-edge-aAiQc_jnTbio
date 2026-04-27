import { describe, it, expect } from 'vitest';
import { pinActive } from './pinActive.js';

const mockWells = [
  {
    id: 'well-001',
    status: 'inactive',
    rig: 'CYC36',
    wellName: 'Thunder Horse #1',
    wellId: 'TH-001',
    spudDate: '2024-01-15T00:00:00.000Z',
    operator: 'DeepSea Energy',
    contractor: 'Oceanic Drilling Co.',
  },
  {
    id: 'well-002',
    status: 'inactive',
    rig: 'CYC36',
    wellName: 'Falcon Ridge #3',
    wellId: 'FR-003',
    spudDate: '2024-02-20T00:00:00.000Z',
    operator: 'Summit Petroleum',
    contractor: 'Highland Drill Services',
  },
  {
    id: 'well-003',
    status: 'active',
    rig: 'CYC36',
    wellName: 'Blue Horizon #7',
    wellId: 'BH-007',
    spudDate: '2024-03-10T00:00:00.000Z',
    operator: 'Atlantic Resources',
    contractor: 'Oceanic Drilling Co.',
  },
  {
    id: 'well-004',
    status: 'inactive',
    rig: 'CYC36',
    wellName: 'Iron Creek #2',
    wellId: 'IC-002',
    spudDate: '2024-04-05T00:00:00.000Z',
    operator: 'Pinnacle Oil & Gas',
    contractor: 'TerraForce Drilling',
  },
];

describe('pinActive', () => {
  describe('moves active well to index 0', () => {
    it('pins the active well to the top of the array', () => {
      const result = pinActive(mockWells);
      expect(result[0].id).toBe('well-003');
      expect(result[0].status).toBe('active');
    });

    it('preserves the relative order of remaining inactive wells', () => {
      const result = pinActive(mockWells);
      expect(result).toHaveLength(4);
      expect(result[0].id).toBe('well-003');
      expect(result[1].id).toBe('well-001');
      expect(result[2].id).toBe('well-002');
      expect(result[3].id).toBe('well-004');
    });

    it('returns same order if active well is already at index 0', () => {
      const wellsWithActiveFirst = [
        { ...mockWells[2] },
        { ...mockWells[0] },
        { ...mockWells[1] },
        { ...mockWells[3] },
      ];
      const result = pinActive(wellsWithActiveFirst);
      expect(result[0].id).toBe('well-003');
      expect(result[1].id).toBe('well-001');
      expect(result[2].id).toBe('well-002');
      expect(result[3].id).toBe('well-004');
    });

    it('pins active well when it is the last element', () => {
      const wellsWithActiveLast = [
        { ...mockWells[0] },
        { ...mockWells[1] },
        { ...mockWells[3] },
        { ...mockWells[2] },
      ];
      const result = pinActive(wellsWithActiveLast);
      expect(result[0].id).toBe('well-003');
      expect(result[0].status).toBe('active');
      expect(result).toHaveLength(4);
    });
  });

  describe('returns unchanged array if no active well', () => {
    it('returns a shallow copy with same order when no well is active', () => {
      const allInactive = mockWells.map((w) => ({ ...w, status: 'inactive' }));
      const result = pinActive(allInactive);
      expect(result).toHaveLength(4);
      expect(result[0].id).toBe('well-001');
      expect(result[1].id).toBe('well-002');
      expect(result[2].id).toBe('well-003');
      expect(result[3].id).toBe('well-004');
    });

    it('returns a new array reference even when no active well exists', () => {
      const allInactive = mockWells.map((w) => ({ ...w, status: 'inactive' }));
      const result = pinActive(allInactive);
      expect(result).not.toBe(allInactive);
      expect(result).toEqual(allInactive);
    });
  });

  describe('does not mutate input', () => {
    it('returns a new array without modifying the original', () => {
      const original = [...mockWells];
      const originalOrder = mockWells.map((w) => w.id);
      const result = pinActive(mockWells);
      expect(mockWells.map((w) => w.id)).toEqual(originalOrder);
      expect(mockWells).toEqual(original);
      expect(result).not.toBe(mockWells);
    });

    it('does not modify any well objects in the original array', () => {
      const originalStatuses = mockWells.map((w) => w.status);
      pinActive(mockWells);
      expect(mockWells.map((w) => w.status)).toEqual(originalStatuses);
    });
  });

  describe('handles single-element array', () => {
    it('returns a copy of single active well array', () => {
      const singleActive = [{ ...mockWells[2] }];
      const result = pinActive(singleActive);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('well-003');
      expect(result[0].status).toBe('active');
      expect(result).not.toBe(singleActive);
    });

    it('returns a copy of single inactive well array', () => {
      const singleInactive = [{ ...mockWells[0] }];
      const result = pinActive(singleInactive);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('well-001');
      expect(result[0].status).toBe('inactive');
      expect(result).not.toBe(singleInactive);
    });
  });

  describe('edge cases', () => {
    it('returns empty array when wells is empty', () => {
      const result = pinActive([]);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('returns empty array when wells is null', () => {
      const result = pinActive(null);
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is undefined', () => {
      const result = pinActive(undefined);
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is not an array', () => {
      const result = pinActive('not an array');
      expect(result).toEqual([]);
    });

    it('handles multiple wells with active status by pinning the first one found', () => {
      const multipleActive = [
        { ...mockWells[0], status: 'inactive' },
        { ...mockWells[1], status: 'active' },
        { ...mockWells[2], status: 'active' },
        { ...mockWells[3], status: 'inactive' },
      ];
      const result = pinActive(multipleActive);
      expect(result[0].id).toBe('well-002');
      expect(result[0].status).toBe('active');
      expect(result).toHaveLength(4);
    });

    it('returns all wells with correct length after pinning', () => {
      const result = pinActive(mockWells);
      expect(result).toHaveLength(mockWells.length);
      const resultIds = result.map((w) => w.id).sort();
      const originalIds = mockWells.map((w) => w.id).sort();
      expect(resultIds).toEqual(originalIds);
    });
  });
});