import PropTypes from 'prop-types';

/**
 * SVG close/dismiss (X) icon component.
 *
 * @param {Object} props
 * @param {number} [props.size=20] - Width and height of the icon in pixels
 * @param {string} [props.color='currentColor'] - Stroke color of the icon
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} Inline SVG close icon
 */
export function CloseIcon({ size = 20, color = 'currentColor', className = '' }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

CloseIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default CloseIcon;