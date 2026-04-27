/**
 * Pure utility for pinning the active well to the top of the array.
 * Returns a new array with the active well (status === 'active') moved to index 0.
 * If no active well exists, returns a shallow copy of the array unchanged.
 * Does not mutate the input.
 *
 * @param {Array<Object>} wells - Array of well objects
 * @returns {Array<Object>} New array with active well pinned to top
 */
export function pinActive(wells) {
  if (!Array.isArray(wells)) {
    return [];
  }

  const activeIndex = wells.findIndex((well) => well.status === 'active');

  if (activeIndex < 1) {
    return [...wells];
  }

  const activeWell = wells[activeIndex];
  const remaining = [...wells.slice(0, activeIndex), ...wells.slice(activeIndex + 1)];

  return [activeWell, ...remaining];
}

export default pinActive;