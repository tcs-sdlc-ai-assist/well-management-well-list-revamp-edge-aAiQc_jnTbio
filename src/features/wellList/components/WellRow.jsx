import PropTypes from 'prop-types';
import { ActiveBadge } from './ActiveBadge.jsx';
import { ActionCell } from './ActionCell.jsx';

/**
 * Table row component for an individual well.
 * Renders a single <tr> with visual highlighting for active wells.
 * Displays all columns: status, rig, wellName, wellId, spudDate, operator, contractor, and actions.
 *
 * @param {Object} props
 * @param {Object} props.well - Well object to render
 * @param {Function} props.onActivate - Handler called with well id when Activate is clicked
 * @returns {JSX.Element} Table row element
 */
export function WellRow({ well, onActivate }) {
  const isActive = well.status === 'active';

  const rowClassName = isActive
    ? 'border-b border-border-primary bg-bg-hover'
    : 'border-b border-border-primary bg-bg-secondary hover:bg-bg-hover transition-colors';

  const formatDate = (isoDate) => {
    if (!isoDate) return '—';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const cellClassName = 'px-4 py-3 text-sm text-text-secondary whitespace-nowrap';

  return (
    <tr className={rowClassName}>
      <td className={cellClassName}>
        {isActive ? <ActiveBadge /> : <span className="text-text-muted">Inactive</span>}
      </td>
      <td className={cellClassName}>{well.rig}</td>
      <td className={`${cellClassName} font-medium text-text-primary`}>{well.wellName}</td>
      <td className={cellClassName}>{well.wellId}</td>
      <td className={cellClassName}>{formatDate(well.spudDate)}</td>
      <td className={cellClassName}>{well.operator}</td>
      <td className={cellClassName}>{well.contractor}</td>
      <td className={`${cellClassName}`}>
        <ActionCell well={well} onActivate={onActivate} />
      </td>
    </tr>
  );
}

WellRow.propTypes = {
  well: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    rig: PropTypes.string.isRequired,
    wellName: PropTypes.string.isRequired,
    wellId: PropTypes.string.isRequired,
    spudDate: PropTypes.string,
    operator: PropTypes.string.isRequired,
    contractor: PropTypes.string.isRequired,
  }).isRequired,
  onActivate: PropTypes.func.isRequired,
};

export default WellRow;