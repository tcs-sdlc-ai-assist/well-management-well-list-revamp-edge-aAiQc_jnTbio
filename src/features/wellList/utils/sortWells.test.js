import { describe, it, expect } from 'vitest';
import { sortWells } from './sortWells.js';

const mockWells = [
  {
    id: 'well-003',
    status: 'inactive',
    rig: 'CYC36',
    wellName: 'Blue Horizon #7',
    wellId: 'BH-007',
    spudDate: '2024-03-10T00:00:00.000Z',
    operator: 'Atlantic Resources',
    contractor: 'Oceanic Drilling Co.',
  },
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
    id: 'well-004',
    status: 'inactive',
    rig: 'CYC36',
    wellName: 'Iron Creek #2',
    wellId: 'IC-002',
    spudDate: '2024-04-05T00:00:00.000Z',
    operator: 'Pinnacle Oil & Gas',
    contractor: 'TerraForce Drilling',
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
];

describe('sortWells', () => {
  describe('sorts by spudDate ascending', () => {
    it('returns wells sorted from earliest to latest spudDate', () => {
      const result = sortWells(mockWells, { field: 'spudDate', direction: 'asc' });
      expect(result).toHaveLength(4);
      expect(result[0].id).toBe('well-001');
      expect(result[1].id).toBe('well-002');
      expect(result[2].id).toBe('well-003');
      expect(result[3].id).toBe('well-004');
    });

    it('defaults to ascending when direction is not desc', () => {
      const result = sortWells(mockWells, { field: 'spudDate', direction: 'asc' });
      const resultDefault = sortWells(mockWells, { field: 'spudDate', direction: 'invalid' });
      expect(result.map((w) => w.id)).toEqual(resultDefault.map((w) => w.id));
    });
  });

  describe('sorts by spudDate descending', () => {
    it('returns wells sorted from latest to earliest spudDate', () => {
      const result = sortWells(mockWells, { field: 'spudDate', direction: 'desc' });
      expect(result).toHaveLength(4);
      expect(result[0].id).toBe('well-004');
      expect(result[1].id).toBe('well-003');
      expect(result[2].id).toBe('well-002');
      expect(result[3].id).toBe('well-001');
    });
  });

  describe('handles empty array', () => {
    it('returns empty array when given empty wells array', () => {
      const result = sortWells([], { field: 'spudDate', direction: 'asc' });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('does not mutate input array', () => {
    it('returns a new array without modifying the original', () => {
      const original = [...mockWells];
      const originalOrder = mockWells.map((w) => w.id);
      const result = sortWells(mockWells, { field: 'spudDate', direction: 'asc' });
      expect(mockWells.map((w) => w.id)).toEqual(originalOrder);
      expect(mockWells).toEqual(original);
      expect(result).not.toBe(mockWells);
    });
  });

  describe('edge cases', () => {
    it('returns empty array when wells is null', () => {
      const result = sortWells(null, { field: 'spudDate', direction: 'asc' });
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is undefined', () => {
      const result = sortWells(undefined, { field: 'spudDate', direction: 'asc' });
      expect(result).toEqual([]);
    });

    it('returns shallow copy when sortConfig is null', () => {
      const result = sortWells(mockWells, null);
      expect(result).toEqual(mockWells);
      expect(result).not.toBe(mockWells);
    });

    it('returns shallow copy when sortConfig is undefined', () => {
      const result = sortWells(mockWells, undefined);
      expect(result).toEqual(mockWells);
      expect(result).not.toBe(mockWells);
    });

    it('handles wells with null spudDate by pushing them to the end in asc order', () => {
      const wellsWithNull = [
        {
          id: 'well-null',
          status: 'inactive',
          rig: 'CYC36',
          wellName: 'Null Date Well',
          wellId: 'ND-001',
          spudDate: null,
          operator: 'Test Operator',
          contractor: 'Test Contractor',
        },
        {
          id: 'well-early',
          status: 'inactive',
          rig: 'CYC36',
          wellName: 'Early Well',
          wellId: 'EW-001',
          spudDate: '2024-01-01T00:00:00.000Z',
          operator: 'Test Operator',
          contractor: 'Test Contractor',
        },
      ];
      const resultAsc = sortWells(wellsWithNull, { field: 'spudDate', direction: 'asc' });
      expect(resultAsc[0].id).toBe('well-early');
      expect(resultAsc[1].id).toBe('well-null');
    });

    it('handles wells with null spudDate by pushing them to the end in desc order', () => {
      const wellsWithNull = [
        {
          id: 'well-null',
          status: 'inactive',
          rig: 'CYC36',
          wellName: 'Null Date Well',
          wellId: 'ND-001',
          spudDate: null,
          operator: 'Test Operator',
          contractor: 'Test Contractor',
        },
        {
          id: 'well-early',
          status: 'inactive',
          rig: 'CYC36',
          wellName: 'Early Well',
          wellId: 'EW-001',
          spudDate: '2024-01-01T00:00:00.000Z',
          operator: 'Test Operator',
          contractor: 'Test Contractor',
        },
      ];
      const resultDesc = sortWells(wellsWithNull, { field: 'spudDate', direction: 'desc' });
      expect(resultDesc[0].id).toBe('well-early');
      expect(resultDesc[1].id).toBe('well-null');
    });

    it('handles single element array', () => {
      const singleWell = [mockWells[0]];
      const result = sortWells(singleWell, { field: 'spudDate', direction: 'asc' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockWells[0].id);
    });

    it('handles wells with identical spudDate values', () => {
      const sameDate = [
        {
          id: 'well-a',
          status: 'inactive',
          rig: 'CYC36',
          wellName: 'Well A',
          wellId: 'WA-001',
          spudDate: '2024-01-15T00:00:00.000Z',
          operator: 'Test',
          contractor: 'Test',
        },
        {
          id: 'well-b',
          status: 'inactive',
          rig: 'CYC36',
          wellName: 'Well B',
          wellId: 'WB-001',
          spudDate: '2024-01-15T00:00:00.000Z',
          operator: 'Test',
          contractor: 'Test',
        },
      ];
      const result = sortWells(sameDate, { field: 'spudDate', direction: 'asc' });
      expect(result).toHaveLength(2);
    });
  });
});