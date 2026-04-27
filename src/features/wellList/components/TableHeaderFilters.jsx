import PropTypes from 'prop-types';
import { SearchIcon } from '../../../shared/icons/SearchIcon.jsx';
import { CloseIcon } from '../../../shared/icons/CloseIcon.jsx';

/**
 * Filter row component for the well list table header.
 * Renders a sub-header <tr> with <input> elements for each filterable column
 * (rig, wellName, wellId, operator, contractor).
 * Non-filterable columns (status, spudDate, actions) render empty cells.
 *
 * @param {Object} props
 * @param {Object} props.filters - Current filter values keyed by field name
 * @param {string} [props.filters.rig] - Current rig filter value
 * @param {string} [props.filters.wellName] - Current well name filter value
 * @param {string} [props.filters.wellId] - Current well ID filter value
 * @param {string} [props.filters.operator] - Current operator filter value
 * @param {string} [props.filters.contractor] - Current contractor filter value
 * @param {Function} props.onFilterChange - Called with updated filters object when any input changes
 * @returns {JSX.Element} Table row with filter inputs
 */
export function TableHeaderFilters({ filters, onFilterChange }) {
  const filterableColumns = [
    { field: 'rig', placeholder: 'Filter rig...' },
    { field: 'wellName', placeholder: 'Filter well name...' },
    { field: 'wellId', placeholder: 'Filter well ID...' },
    { field: 'operator', placeholder: 'Filter operator...' },
    { field: 'contractor', placeholder: 'Filter contractor...' },
  ];

  const handleChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    onFilterChange(updatedFilters);
  };

  const handleClear = (field) => {
    const updatedFilters = { ...filters, [field]: '' };
    onFilterChange(updatedFilters);
  };

  const renderFilterInput = (column) => {
    const value = filters[column.field] || '';

    return (
      <td key={column.field} className="px-4 py-2">
        <div className="relative flex items-center">
          <SearchIcon
            size={14}
            className="absolute left-2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(column.field, e.target.value)}
            placeholder={column.placeholder}
            aria-label={column.placeholder}
            className="w-full rounded border border-border-primary bg-bg-primary py-1 pl-7 pr-7 text-xs text-text-primary placeholder-text-muted transition-colors focus:border-accent-info focus:outline-none focus:ring-1 focus:ring-accent-info"
          />
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => handleClear(column.field)}
              className="absolute right-1.5 flex items-center justify-center rounded p-0.5 text-text-muted hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-info"
              aria-label={`Clear ${column.field} filter`}
            >
              <CloseIcon size={12} />
            </button>
          )}
        </div>
      </td>
    );
  };

  return (
    <tr className="bg-bg-secondary border-b border-border-primary">
      {/* Status column - not filterable */}
      <td className="px-4 py-2" />
      {/* Filterable columns: rig, wellName, wellId */}
      {filterableColumns.slice(0, 3).map(renderFilterInput)}
      {/* Spud Date column - not filterable */}
      <td className="px-4 py-2" />
      {/* Filterable columns: operator, contractor */}
      {filterableColumns.slice(3).map(renderFilterInput)}
      {/* Actions column - not filterable */}
      <td className="px-4 py-2" />
    </tr>
  );
}

TableHeaderFilters.propTypes = {
  filters: PropTypes.shape({
    rig: PropTypes.string,
    wellName: PropTypes.string,
    wellId: PropTypes.string,
    operator: PropTypes.string,
    contractor: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TableHeaderFilters;