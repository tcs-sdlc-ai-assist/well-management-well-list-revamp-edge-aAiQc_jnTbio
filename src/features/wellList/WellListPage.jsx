import { useState, useCallback } from 'react';
import { useWells } from './hooks/useWells.js';
import { WellTable } from './components/WellTable.jsx';
import { Pagination } from './components/Pagination.jsx';
import { ActivationModal } from './components/ActivationModal.jsx';

/**
 * Page-level container component for the Well List feature.
 * Owns all state via useWells hook: wells, filters, sortConfig, currentPage, pageSize.
 * Manages modal state for well activation confirmation.
 * Orchestrates data flow: filterWells → sortWells → pinActive → pagination slicing.
 * Renders page header, WellTable, Pagination, and ActivationModal.
 *
 * @returns {JSX.Element} Well list page element
 */
export function WellListPage() {
  const {
    wells,
    filters,
    sortConfig,
    currentPage,
    pageSize,
    setFilters,
    setSortConfig,
    setCurrentPage,
    setPageSize,
    activateWell,
    paginatedWells,
    pinnedWells,
    totalPages,
  } = useWells();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWell, setSelectedWell] = useState(null);

  const currentActiveWell = wells.find((w) => w.status === 'active');

  const handleActivateRequest = useCallback(
    (wellId) => {
      const well = wells.find((w) => w.id === wellId);
      if (!well) return;
      setSelectedWell(well);
      setModalOpen(true);
    },
    [wells],
  );

  const handleConfirmActivation = useCallback(() => {
    if (!selectedWell) return;
    activateWell(selectedWell.id);
    setModalOpen(false);
    setSelectedWell(null);
    setCurrentPage(1);
  }, [selectedWell, activateWell, setCurrentPage]);

  const handleCancelActivation = useCallback(() => {
    setModalOpen(false);
    setSelectedWell(null);
  }, []);

  const handleCreateNewWell = () => {
    window.alert('Create New Well');
  };

  const handleCreateSidetrackWell = () => {
    window.alert('Create Sidetrack Well');
  };

  const warningMessage =
    selectedWell && currentActiveWell && currentActiveWell.id !== selectedWell.id
      ? `Activating "${selectedWell.wellName}" will deactivate the currently active well "${currentActiveWell.wellName}".`
      : '';

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Well List</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage and monitor all wells. {pinnedWells.length} well{pinnedWells.length !== 1 ? 's' : ''} total.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCreateNewWell}
            className="rounded bg-accent-primary px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent-primary-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary"
          >
            Create New Well
          </button>
          <button
            type="button"
            onClick={handleCreateSidetrackWell}
            className="rounded bg-bg-tertiary px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 focus:ring-offset-bg-primary"
          >
            Create Sidetrack Well
          </button>
        </div>
      </div>

      {/* Well Table */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary">
        <WellTable
          paginatedWells={paginatedWells}
          filters={filters}
          sortConfig={sortConfig}
          onFilterChange={setFilters}
          onSortChange={setSortConfig}
          onActivate={handleActivateRequest}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalEntries={pinnedWells.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Activation Modal - rendered at root level outside table */}
      <ActivationModal
        well={selectedWell}
        isOpen={modalOpen}
        onConfirm={handleConfirmActivation}
        onCancel={handleCancelActivation}
        warning={warningMessage}
      />
    </div>
  );
}

export default WellListPage;