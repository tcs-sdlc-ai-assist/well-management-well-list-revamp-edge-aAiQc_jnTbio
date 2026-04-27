/**
 * Pure filtering utility for wells data.
 * Performs real-time, case-insensitive, partial-match filtering.
 * Multiple filters combine with AND logic.
 *
 * @param {Array<Object>} wells - Array of well objects to filter
 * @param {Object} filters - Filter criteria object
 * @param {string} [filters.rig] - Filter by rig name
 * @param {string} [filters.wellName] - Filter by well name
 * @param {string} [filters.wellId] - Filter by well ID
 * @param {string} [filters.operator] - Filter by operator
 * @param {string} [filters.contractor] - Filter by contractor
 * @returns {Array<Object>} Filtered array of well objects
 */
export function filterWells(wells, filters) {
  if (!Array.isArray(wells)) {
    return [];
  }

  if (!filters || typeof filters !== 'object') {
    return wells;
  }

  const filterableFields = ['rig', 'wellName', 'wellId', 'operator', 'contractor'];

  const activeFilters = filterableFields
    .filter((field) => {
      const value = filters[field];
      return typeof value === 'string' && value.trim().length > 0;
    })
    .map((field) => ({
      field,
      term: filters[field].trim().toLowerCase(),
    }));

  if (activeFilters.length === 0) {
    return wells;
  }

  return wells.filter((well) =>
    activeFilters.every(({ field, term }) => {
      const fieldValue = well[field];
      if (fieldValue == null) {
        return false;
      }
      return String(fieldValue).toLowerCase().includes(term);
    }),
  );
}

export default filterWells;