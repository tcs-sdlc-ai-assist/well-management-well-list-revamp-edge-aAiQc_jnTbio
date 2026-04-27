import { describe, it, expect } from 'vitest';
import { filterWells } from './filterWells.js';

const mockWells = [
  {
    id: 'well-001',
    status: 'active',
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
    status: 'inactive',
    rig: 'RIG-99',
    wellName: 'Blue Horizon #7',
    wellId: 'BH-007',
    spudDate: '2024-03-10T00:00:00.000Z',
    operator: 'Atlantic Resources',
    contractor: 'Oceanic Drilling Co.',
  },
  {
    id: 'well-004',
    status: 'inactive',
    rig: 'RIG-99',
    wellName: 'Iron Creek #2',
    wellId: 'IC-002',
    spudDate: '2024-04-05T00:00:00.000Z',
    operator: 'Pinnacle Oil & Gas',
    contractor: 'TerraForce Drilling',
  },
];

describe('filterWells', () => {
  describe('returns all wells when filters are empty', () => {
    it('returns all wells when filters is an empty object', () => {
      const result = filterWells(mockWells, {});
      expect(result).toEqual(mockWells);
    });

    it('returns all wells when filters is null', () => {
      const result = filterWells(mockWells, null);
      expect(result).toEqual(mockWells);
    });

    it('returns all wells when filters is undefined', () => {
      const result = filterWells(mockWells, undefined);
      expect(result).toEqual(mockWells);
    });

    it('returns all wells when all filter values are empty strings', () => {
      const result = filterWells(mockWells, { rig: '', wellName: '', wellId: '' });
      expect(result).toEqual(mockWells);
    });

    it('returns all wells when filter values are whitespace only', () => {
      const result = filterWells(mockWells, { rig: '   ', wellName: '  ' });
      expect(result).toEqual(mockWells);
    });
  });

  describe('filters by single field with case-insensitive partial match', () => {
    it('filters by rig with partial match', () => {
      const result = filterWells(mockWells, { rig: 'cyc' });
      expect(result).toHaveLength(2);
      expect(result.every((w) => w.rig === 'CYC36')).toBe(true);
    });

    it('filters by rig with case-insensitive match', () => {
      const result = filterWells(mockWells, { rig: 'RIG' });
      expect(result).toHaveLength(2);
      expect(result.every((w) => w.rig === 'RIG-99')).toBe(true);
    });

    it('filters by wellName with partial match', () => {
      const result = filterWells(mockWells, { wellName: 'thunder' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('well-001');
    });

    it('filters by wellName with uppercase input', () => {
      const result = filterWells(mockWells, { wellName: 'FALCON' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('well-002');
    });

    it('filters by wellId with partial match', () => {
      const result = filterWells(mockWells, { wellId: 'bh' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('well-003');
    });

    it('filters by operator with partial match', () => {
      const result = filterWells(mockWells, { operator: 'deep' });
      expect(result).toHaveLength(1);
      expect(result[0].operator).toBe('DeepSea Energy');
    });

    it('filters by contractor with partial match', () => {
      const result = filterWells(mockWells, { contractor: 'oceanic' });
      expect(result).toHaveLength(2);
      expect(result.every((w) => w.contractor === 'Oceanic Drilling Co.')).toBe(true);
    });
  });

  describe('combines multiple filters with AND logic', () => {
    it('filters by rig AND contractor', () => {
      const result = filterWells(mockWells, { rig: 'RIG-99', contractor: 'oceanic' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('well-003');
    });

    it('filters by rig AND operator', () => {
      const result = filterWells(mockWells, { rig: 'CYC', operator: 'summit' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('well-002');
    });

    it('filters by wellName AND wellId AND operator', () => {
      const result = filterWells(mockWells, {
        wellName: 'thunder',
        wellId: 'TH',
        operator: 'DeepSea',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('well-001');
    });

    it('ignores empty filter fields when combining with active filters', () => {
      const result = filterWells(mockWells, { rig: 'RIG-99', wellName: '' });
      expect(result).toHaveLength(2);
      expect(result.every((w) => w.rig === 'RIG-99')).toBe(true);
    });
  });

  describe('returns empty array when no matches', () => {
    it('returns empty array when single filter matches nothing', () => {
      const result = filterWells(mockWells, { wellName: 'nonexistent' });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('returns empty array when combined filters match nothing', () => {
      const result = filterWells(mockWells, { rig: 'CYC', operator: 'Atlantic' });
      expect(result).toEqual([]);
    });

    it('returns empty array when wells array is empty', () => {
      const result = filterWells([], { rig: 'CYC' });
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is not an array', () => {
      const result = filterWells(null, { rig: 'CYC' });
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is undefined', () => {
      const result = filterWells(undefined, {});
      expect(result).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('does not mutate the original wells array', () => {
      const original = [...mockWells];
      filterWells(mockWells, { rig: 'CYC' });
      expect(mockWells).toEqual(original);
    });

    it('handles well with null field value gracefully', () => {
      const wellsWithNull = [
        ...mockWells,
        {
          id: 'well-005',
          status: 'inactive',
          rig: null,
          wellName: 'Null Rig Well',
          wellId: 'NR-001',
          spudDate: '2024-05-01T00:00:00.000Z',
          operator: 'Test Operator',
          contractor: 'Test Contractor',
        },
      ];
      const result = filterWells(wellsWithNull, { rig: 'CYC' });
      expect(result).toHaveLength(2);
      expect(result.every((w) => w.rig === 'CYC36')).toBe(true);
    });

    it('ignores unknown filter fields', () => {
      const result = filterWells(mockWells, { unknownField: 'test' });
      expect(result).toEqual(mockWells);
    });
  });
});