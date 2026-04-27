import PropTypes from 'prop-types';
import { CloseIcon } from '../../../shared/icons/CloseIcon.jsx';

/**
 * Activation confirmation modal component.
 * Rendered at top level of WellListPage (outside table container) to avoid clipping.
 * Shows well info (name, ID, rig), streaming indicator, and a red warning block
 * if another well is currently active.
 * Confirm button triggers activation (single-active invariant),
 * Cancel/X closes without state change.
 *
 * @param {Object} props
 * @param {Object} props.well - Well object to activate
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onConfirm - Called when user confirms activation
 * @param {Function} props.onCancel - Called when user cancels or closes the modal
 * @param {string} [props.warning=''] - Warning message shown if another well is currently active
 * @returns {JSX.Element|null} Modal overlay element or null when closed
 */
export function ActivationModal({ well, isOpen, onConfirm, onCancel, warning = '' }) {
  if (!isOpen || !well) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="activation-modal-title"
    >
      <div className="relative w-full max-w-md rounded-lg border border-border-primary bg-bg-secondary p-6 shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 rounded p-1 text-text-muted transition-colors hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary"
          aria-label="Close modal"
        >
          <CloseIcon size={18} />
        </button>

        {/* Title */}
        <h2
          id="activation-modal-title"
          className="mb-4 text-lg font-semibold text-text-primary"
        >
          Confirm Well Activation
        </h2>

        {/* Well info */}
        <div className="mb-4 rounded border border-border-primary bg-bg-tertiary p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Well Name
              </span>
              <span className="text-sm font-medium text-text-primary">{well.wellName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Well ID
              </span>
              <span className="text-sm text-text-secondary">{well.wellId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Rig
              </span>
              <span className="text-sm text-text-secondary">{well.rig}</span>
            </div>
          </div>
        </div>

        {/* Streaming indicator */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full bg-accent-success animate-pulse-custom"
            aria-hidden="true"
          />
          <span className="text-xs text-text-secondary">
            This well will begin streaming data once activated
          </span>
        </div>

        {/* Warning block */}
        {warning && (
          <div className="mb-4 rounded border border-accent-danger/40 bg-accent-danger/10 p-3">
            <p className="text-xs font-medium text-accent-danger">{warning}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-bg-tertiary px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded bg-accent-primary px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-primary-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary"
          >
            Activate
          </button>
        </div>
      </div>
    </div>
  );
}

ActivationModal.propTypes = {
  well: PropTypes.shape({
    id: PropTypes.string.isRequired,
    wellName: PropTypes.string.isRequired,
    wellId: PropTypes.string.isRequired,
    rig: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  warning: PropTypes.string,
};

export default ActivationModal;