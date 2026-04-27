import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { WellListPage } from './WellListPage.jsx';
import initialWells from './data/initialWells.js';

const STORAGE_KEY = 'wellsData';

describe('WellListPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('renders grid with seed data', () => {
    it('renders the page header with title and well count', () => {
      render(<WellListPage />);
      expect(screen.getByText('Well List')).toBeInTheDocument();
      expect(screen.getByText(/Manage and monitor all wells/)).toBeInTheDocument();
    });

    it('renders the well table with column headers', () => {
      render(<WellListPage />);
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Rig')).toBeInTheDocument();
      expect(screen.getByText('Well Name')).toBeInTheDocument();
      expect(screen.getByText('Well ID')).toBeInTheDocument();
      expect(screen.getByText('Spud Date')).toBeInTheDocument();
      expect(screen.getByText('Operator')).toBeInTheDocument();
      expect(screen.getByText('Contractor')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('renders well rows from seed data on the first page', () => {
      render(<WellListPage />);
      expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      expect(screen.getByText('Falcon Ridge #3')).toBeInTheDocument();
    });

    it('renders the active well with Active badge', () => {
      render(<WellListPage />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders pagination showing correct entry count', () => {
      render(<WellListPage />);
      expect(screen.getByText(/Showing 1 to 10 of 11 entries/)).toBeInTheDocument();
    });

    it('renders Create New Well and Create Sidetrack Well buttons', () => {
      render(<WellListPage />);
      expect(screen.getByRole('button', { name: 'Create New Well' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Sidetrack Well' })).toBeInTheDocument();
    });
  });

  describe('filter inputs update displayed wells', () => {
    it('filters wells by well name', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const wellNameFilter = screen.getByPlaceholderText('Filter well name...');
      await user.type(wellNameFilter, 'Thunder');

      expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      expect(screen.queryByText('Falcon Ridge #3')).not.toBeInTheDocument();
      expect(screen.getByText(/Showing 1 to 1 of 1 entries/)).toBeInTheDocument();
    });

    it('filters wells by operator', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const operatorFilter = screen.getByPlaceholderText('Filter operator...');
      await user.type(operatorFilter, 'DeepSea');

      expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      expect(screen.getByText('Silver Basin #4')).toBeInTheDocument();
      expect(screen.getByText('Obsidian Peak #6')).toBeInTheDocument();
      expect(screen.queryByText('Falcon Ridge #3')).not.toBeInTheDocument();
    });

    it('shows no wells message when filter matches nothing', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const wellNameFilter = screen.getByPlaceholderText('Filter well name...');
      await user.type(wellNameFilter, 'ZZZZNONEXISTENT');

      expect(screen.getByText('No wells found matching the current filters.')).toBeInTheDocument();
    });

    it('clears filter when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const wellNameFilter = screen.getByPlaceholderText('Filter well name...');
      await user.type(wellNameFilter, 'Thunder');

      expect(screen.queryByText('Falcon Ridge #3')).not.toBeInTheDocument();

      const clearButton = screen.getByLabelText('Clear wellName filter');
      await user.click(clearButton);

      expect(screen.getByText('Falcon Ridge #3')).toBeInTheDocument();
    });

    it('combines multiple filters with AND logic', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const operatorFilter = screen.getByPlaceholderText('Filter operator...');
      await user.type(operatorFilter, 'DeepSea');

      const contractorFilter = screen.getByPlaceholderText('Filter contractor...');
      await user.type(contractorFilter, 'Oceanic');

      expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      expect(screen.queryByText('Silver Basin #4')).not.toBeInTheDocument();
      expect(screen.queryByText('Obsidian Peak #6')).not.toBeInTheDocument();
    });
  });

  describe('activation modal opens on Activate click', () => {
    it('opens the activation modal when Activate button is clicked on an inactive well', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const activateButtons = screen.getAllByRole('button', { name: 'Activate' });
      const enabledActivateButton = activateButtons.find((btn) => !btn.disabled);
      await user.click(enabledActivateButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Confirm Well Activation')).toBeInTheDocument();
    });

    it('shows warning message when another well is currently active', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const activateButtons = screen.getAllByRole('button', { name: 'Activate' });
      const enabledActivateButton = activateButtons.find((btn) => !btn.disabled);
      await user.click(enabledActivateButton);

      expect(screen.getByText(/will deactivate the currently active well/)).toBeInTheDocument();
    });

    it('closes the modal when Cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const activateButtons = screen.getAllByRole('button', { name: 'Activate' });
      const enabledActivateButton = activateButtons.find((btn) => !btn.disabled);
      await user.click(enabledActivateButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const cancelButton = within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes the modal when close icon button is clicked', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const activateButtons = screen.getAllByRole('button', { name: 'Activate' });
      const enabledActivateButton = activateButtons.find((btn) => !btn.disabled);
      await user.click(enabledActivateButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('confirming activation updates active well and pins to top', () => {
    it('activates the selected well and pins it to the top after confirmation', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const activateButtons = screen.getAllByRole('button', { name: 'Activate' });
      const enabledActivateButton = activateButtons.find((btn) => !btn.disabled);
      await user.click(enabledActivateButton);

      const dialog = screen.getByRole('dialog');
      const confirmButton = within(dialog).getByRole('button', { name: 'Activate' });
      await user.click(confirmButton);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      // rows[0] is header, rows[1] is filter row, rows[2] is first data row
      const firstDataRow = rows[2];
      expect(within(firstDataRow).getByText('Active')).toBeInTheDocument();
    });

    it('deactivates the previously active well after confirming new activation', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();

      const wellNameFilter = screen.getByPlaceholderText('Filter well name...');
      await user.type(wellNameFilter, 'Falcon');

      const activateButtons = screen.getAllByRole('button', { name: 'Activate' });
      const enabledActivateButton = activateButtons.find((btn) => !btn.disabled);
      await user.click(enabledActivateButton);

      const dialog = screen.getByRole('dialog');
      const confirmButton = within(dialog).getByRole('button', { name: 'Activate' });
      await user.click(confirmButton);

      const clearButton = screen.getByLabelText('Clear wellName filter');
      await user.click(clearButton);

      const activeBadges = screen.getAllByText('Active');
      expect(activeBadges).toHaveLength(1);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const activeWells = stored.filter((w) => w.status === 'active');
      expect(activeWells).toHaveLength(1);
      expect(activeWells[0].id).toBe('well-002');
    });
  });

  describe('pagination controls navigate pages', () => {
    it('navigates to the next page when Next is clicked', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      expect(screen.getByText(/Showing 1 to 10 of 11 entries/)).toBeInTheDocument();

      const nextButton = screen.getByRole('button', { name: 'Next' });
      await user.click(nextButton);

      expect(screen.getByText(/Showing 11 to 11 of 11 entries/)).toBeInTheDocument();
    });

    it('navigates to the previous page when Prev is clicked', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const nextButton = screen.getByRole('button', { name: 'Next' });
      await user.click(nextButton);

      expect(screen.getByText(/Showing 11 to 11 of 11 entries/)).toBeInTheDocument();

      const prevButton = screen.getByRole('button', { name: 'Prev' });
      await user.click(prevButton);

      expect(screen.getByText(/Showing 1 to 10 of 11 entries/)).toBeInTheDocument();
    });

    it('navigates to the last page when Last is clicked', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const lastButton = screen.getByRole('button', { name: 'Last' });
      await user.click(lastButton);

      expect(screen.getByText(/Showing 11 to 11 of 11 entries/)).toBeInTheDocument();
    });

    it('navigates to the first page when First is clicked', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const lastButton = screen.getByRole('button', { name: 'Last' });
      await user.click(lastButton);

      const firstButton = screen.getByRole('button', { name: 'First' });
      await user.click(firstButton);

      expect(screen.getByText(/Showing 1 to 10 of 11 entries/)).toBeInTheDocument();
    });

    it('disables First and Prev buttons on the first page', () => {
      render(<WellListPage />);

      const firstButton = screen.getByRole('button', { name: 'First' });
      const prevButton = screen.getByRole('button', { name: 'Prev' });

      expect(firstButton).toBeDisabled();
      expect(prevButton).toBeDisabled();
    });

    it('disables Next and Last buttons on the last page', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const lastButton = screen.getByRole('button', { name: 'Last' });
      await user.click(lastButton);

      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeDisabled();
      expect(lastButton).toBeDisabled();
    });
  });

  describe('page size dropdown changes entries per page', () => {
    it('changes page size to 25 and shows all wells on one page', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const pageSizeSelect = screen.getByLabelText('Rows per page:');
      await user.selectOptions(pageSizeSelect, '25');

      expect(screen.getByText(/Showing 1 to 11 of 11 entries/)).toBeInTheDocument();
    });

    it('changes page size to 50 and shows all wells on one page', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const pageSizeSelect = screen.getByLabelText('Rows per page:');
      await user.selectOptions(pageSizeSelect, '50');

      expect(screen.getByText(/Showing 1 to 11 of 11 entries/)).toBeInTheDocument();
    });

    it('resets to page 1 when page size changes', async () => {
      const user = userEvent.setup();
      render(<WellListPage />);

      const nextButton = screen.getByRole('button', { name: 'Next' });
      await user.click(nextButton);

      expect(screen.getByText(/Showing 11 to 11 of 11 entries/)).toBeInTheDocument();

      const pageSizeSelect = screen.getByLabelText('Rows per page:');
      await user.selectOptions(pageSizeSelect, '25');

      expect(screen.getByText(/Showing 1 to 11 of 11 entries/)).toBeInTheDocument();
    });
  });

  describe('Create New Well button triggers alert', () => {
    it('triggers an alert when Create New Well button is clicked', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<WellListPage />);

      const createButton = screen.getByRole('button', { name: 'Create New Well' });
      await user.click(createButton);

      expect(alertSpy).toHaveBeenCalledWith('Create New Well');
      alertSpy.mockRestore();
    });

    it('triggers an alert when Create Sidetrack Well button is clicked', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<WellListPage />);

      const sidetrackButton = screen.getByRole('button', { name: 'Create Sidetrack Well' });
      await user.click(sidetrackButton);

      expect(alertSpy).toHaveBeenCalledWith('Create Sidetrack Well');
      alertSpy.mockRestore();
    });
  });
});