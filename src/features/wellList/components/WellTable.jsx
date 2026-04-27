import PropTypes from 'prop-types';
import { SortIcon } from '../../../shared/icons/SortIcon.jsx';
import { TableHeaderFilters } from './TableHeaderFilters.jsx';
import { WellRow } from './WellRow.jsx';

/**
 * Main table component for the well list grid.
 * Renders column headers with sort toggle on Spud Date,
 * a TableHeaderFilters row for filtering, and WellRow for each paginated well.
 *
 * @param {Object} props
 * @param {Array<Object>} props.paginatedWells - Array of well objects for the current page
 * @param {Object} props.filters - Current filter values keyed by field name
 * @param {Object} props.sortConfig - Current sort configuration
 * @param {string} props.sortConfig.field - Field to sort by
 * @param {string} props.sortConfig.direction - Sort direction: 'asc' or 'desc'
 * @param {Function} props.onFilterChange - Called with updated filters object
 * @param {Function} props.onSortChange - Called with updated sortConfig object
 * @param {Function} props.onActivate - Called with well id when Activate is clicked
 * @returns {JSX.Element} Table element with headers, filters, and rows
 */
export function WellTable({
  paginatedWells,
  filters,
  sortConfig,
  onFilterChange,
  onSortChange,
  onActivate,
}) {
  const columns = [
    { key: 'status', label: 'Status', sortable: false },
    { key: 'rig', label: 'Rig', sortable: false },
    { key: 'wellName', label: 'Well Name', sortable: false },
    { key: 'wellId', label: 'Well ID', sortable: false },
    { key: 'spudDate', label: 'Spud Date', sortable: true },
    { key: 'operator', label: 'Operator', sortable: false },
    { key: 'contractor', label: 'Contractor', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const handleSortToggle = () => {
    const newDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field: 'spudDate', direction: newDirection });
  };

  const headerCellClassName =
    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted';

  return (
    <div className="overflow-x-auto rounded-lg border border-border-primary">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-bg-tertiary border-b border-border-primary">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${headerCellClassName}${column.sortable ? ' cursor-pointer select-none hover:text-text-primary transition-colors' : ''}`}
                onClick={column.sortable ? handleSortToggle : undefined}
              >
                <div className="flex items-center gap-1">
                  {column.label}
                  {column.sortable && (
                    <SortIcon
                      direction={sortConfig.direction}
                      active={sortConfig.field === column.key}
                      size={14}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
          <TableHeaderFilters filters={filters} onFilterChange={onFilterChange} />
        </thead>
        <tbody>
          {paginatedWells.length > 0 ? (
            paginatedWells.map((well) => (
              <WellRow key={well.id} well={well} onActivate={onActivate} />
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-text-muted"
              >
                No wells found matching the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

WellTable.propTypes = {
  paginatedWells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      rig: PropTypes.string.isRequired,
      wellName: PropTypes.string.isRequired,
      wellId: PropTypes.string.isRequired,
      spudDate: PropTypes.string,
      operator: PropTypes.string.isRequired,
      contractor: PropTypes.string.isRequired,
    }),
  ).isRequired,
  filters: PropTypes.shape({
    rig: PropTypes.string,
    wellName: PropTypes.string,
    wellId: PropTypes.string,
    operator: PropTypes.string,
    contractor: PropTypes.string,
  }).isRequired,
  sortConfig: PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
};

export default WellTable;