import PropTypes from 'prop-types';

/**
 * Action buttons component for a single well row.
 * Renders Activate, Edit, and Details buttons with visible text labels.
 *
 * @param {Object} props
 * @param {Object} props.well - Well object containing at minimum id, status, and wellName
 * @param {Function} props.onActivate - Handler called with well id when Activate is clicked
 * @returns {JSX.Element} Action buttons group
 */
export function ActionCell({ well, onActivate }) {
  const isActive = well.status === 'active';

  const handleActivate = () => {
    if (!isActive) {
      onActivate(well.id);
    }
  };

  const handleEdit = () => {
    window.alert(`Edit: ${well.wellName}`);
  };

  const handleDetails = () => {
    window.alert(`Details: ${well.wellName}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleActivate}
        disabled={isActive}
        className={`rounded px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary ${
          isActive
            ? 'cursor-not-allowed bg-bg-tertiary text-text-muted opacity-50'
            : 'bg-accent-primary text-text-primary hover:bg-accent-primary-hover'
        }`}
      >
        Activate
      </button>
      <button
        type="button"
        onClick={handleEdit}
        className="rounded bg-bg-tertiary px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={handleDetails}
        className="rounded bg-bg-tertiary px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary"
      >
        Details
      </button>
    </div>
  );
}

ActionCell.propTypes = {
  well: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    wellName: PropTypes.string.isRequired,
  }).isRequired,
  onActivate: PropTypes.func.isRequired,
};

export default ActionCell;