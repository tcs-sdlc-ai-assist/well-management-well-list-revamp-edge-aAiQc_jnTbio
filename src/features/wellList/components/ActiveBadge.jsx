import PropTypes from 'prop-types';

/**
 * Visual status badge component that renders a green pill badge with a pulsing dot
 * indicating the active well status. Uses exact hex colors from the palette.
 *
 * @param {Object} props
 * @param {string} [props.className=''] - Additional CSS classes to apply to the badge container
 * @returns {JSX.Element} Green pill badge with pulsing dot
 */
export function ActiveBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-accent-success/15 px-2.5 py-0.5 text-xs font-medium text-accent-success ${className}`}
    >
      <span
        className="inline-block h-2 w-2 rounded-full bg-accent-success animate-pulse-custom"
        aria-hidden="true"
      />
      Active
    </span>
  );
}

ActiveBadge.propTypes = {
  className: PropTypes.string,
};

export default ActiveBadge;