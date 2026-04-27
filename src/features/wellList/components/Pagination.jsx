import PropTypes from 'prop-types';

/**
 * Pagination footer component for the well list table.
 * Renders entry count display, navigation controls, and page size dropdown.
 *
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.pageSize - Number of entries per page
 * @param {number} props.totalEntries - Total number of filtered entries
 * @param {Function} props.onPageChange - Called with new page number
 * @param {Function} props.onPageSizeChange - Called with new page size number
 * @returns {JSX.Element} Pagination footer element
 */
export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalEntries,
  onPageChange,
  onPageSizeChange,
}) {
  const pageSizeOptions = [10, 25, 50];

  const safePage = Math.min(currentPage, totalPages);
  const startEntry = totalEntries === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endEntry = Math.min(safePage * pageSize, totalEntries);

  const isFirstPage = safePage <= 1;
  const isLastPage = safePage >= totalPages;

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    onPageSizeChange(newSize);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, safePage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const navButtonClassName = (disabled) =>
    `rounded px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary ${
      disabled
        ? 'cursor-not-allowed bg-bg-tertiary text-text-muted opacity-50'
        : 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover'
    }`;

  const pageButtonClassName = (isActive) =>
    `rounded px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary ${
      isActive
        ? 'bg-accent-primary text-text-primary'
        : 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover'
    }`;

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row">
      <div className="text-xs text-text-muted">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          className={navButtonClassName(isFirstPage)}
        >
          First
        </button>
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={isFirstPage}
          className={navButtonClassName(isFirstPage)}
        >
          Prev
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={pageButtonClassName(page === safePage)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={isLastPage}
          className={navButtonClassName(isLastPage)}
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          className={navButtonClassName(isLastPage)}
        >
          Last
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="page-size-select" className="text-xs text-text-muted">
          Rows per page:
        </label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="rounded border border-border-primary bg-bg-primary px-2 py-1 text-xs text-text-primary focus:border-accent-info focus:outline-none focus:ring-1 focus:ring-accent-info"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalEntries: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default Pagination;