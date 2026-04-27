import PropTypes from 'prop-types';

/**
 * SVG sort arrow icon component with configurable direction and active state.
 *
 * @param {Object} props
 * @param {string} [props.direction='asc'] - Sort direction: 'asc' or 'desc'
 * @param {boolean} [props.active=false] - Whether the sort indicator is currently active
 * @param {number} [props.size=20] - Width and height of the icon in pixels
 * @param {string} [props.color='currentColor'] - Stroke color of the icon
 * @param {string} [props.activeColor='#e94560'] - Stroke color when active
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} Inline SVG sort icon
 */
export function SortIcon({
  direction = 'asc',
  active = false,
  size = 20,
  color = 'currentColor',
  activeColor = '#e94560',
  className = '',
}) {
  const strokeColor = active ? activeColor : color;
  const isDesc = direction === 'desc';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      style={isDesc ? { transform: 'rotate(180deg)' } : undefined}
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

SortIcon.propTypes = {
  direction: PropTypes.oneOf(['asc', 'desc']),
  active: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
  activeColor: PropTypes.string,
  className: PropTypes.string,
};

export default SortIcon;