import PropTypes from 'prop-types';

/**
 * SVG search/magnifying glass icon component.
 *
 * @param {Object} props
 * @param {number} [props.size=20] - Width and height of the icon in pixels
 * @param {string} [props.color='currentColor'] - Stroke/fill color of the icon
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} Inline SVG search icon
 */
export function SearchIcon({ size = 20, color = 'currentColor', className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

SearchIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default SearchIcon;