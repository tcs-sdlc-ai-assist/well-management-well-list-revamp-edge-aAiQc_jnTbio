/**
 * Pure sorting utility for wells data.
 * Sorts wells by spudDate in ascending or descending order.
 * Returns a new array — does not mutate the input.
 *
 * @param {Array<Object>} wells - Array of well objects to sort
 * @param {Object} sortConfig - Sort configuration object
 * @param {string} [sortConfig.field='spudDate'] - Field to sort by
 * @param {string} [sortConfig.direction='asc'] - Sort direction: 'asc' or 'desc'
 * @returns {Array<Object>} New sorted array of well objects
 */
export function sortWells(wells, sortConfig) {
  if (!Array.isArray(wells)) {
    return [];
  }

  if (!sortConfig || typeof sortConfig !== 'object') {
    return [...wells];
  }

  const direction = sortConfig.direction === 'desc' ? 'desc' : 'asc';

  return [...wells].sort((a, b) => {
    const dateA = a.spudDate ? new Date(a.spudDate).getTime() : 0;
    const dateB = b.spudDate ? new Date(b.spudDate).getTime() : 0;

    if (Number.isNaN(dateA) && Number.isNaN(dateB)) {
      return 0;
    }
    if (Number.isNaN(dateA)) {
      return direction === 'asc' ? 1 : -1;
    }
    if (Number.isNaN(dateB)) {
      return direction === 'asc' ? -1 : 1;
    }

    if (direction === 'asc') {
      return dateA - dateB;
    }
    return dateB - dateA;
  });
}

export default sortWells;