# Changelog

All notable changes to the Well List Revamp project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-01

### Added

#### Well List Grid
- Tabular display of all wells with eight columns: Status, Rig, Well Name, Well ID, Spud Date, Operator, Contractor, and Actions.
- Responsive table layout with horizontal scroll on smaller viewports using Tailwind responsive utilities.
- Empty state message displayed when no wells match the current filters.

#### Filtering
- Real-time, case-insensitive, partial-match filtering on five columns: Rig, Well Name, Well ID, Operator, and Contractor.
- AND logic across multiple active filters — all conditions must match for a well to appear.
- Search icon indicator inside each filter input for visual clarity.
- Clear button (×) on each filter input to reset individual filters.
- Page resets to 1 automatically when any filter value changes.

#### Sorting
- Sortable Spud Date column with toggle between ascending and descending order.
- Visual sort direction indicator (arrow icon) on the Spud Date column header.
- Active sort state highlighted with accent color (`#e94560`).
- Page resets to 1 automatically when sort configuration changes.

#### Pagination
- Configurable page sizes: 10, 25, and 50 rows per page via dropdown selector.
- Navigation controls: First, Prev, Next, and Last buttons with proper disabled states.
- Numbered page buttons with up to 5 visible page indicators.
- Entry count display showing "Showing X to Y of Z entries".
- Page resets to 1 automatically when page size changes.

#### Single-Active Well Invariant
- Only one well can be active at any given time.
- Activating a new well automatically deactivates the previously active well.
- Active well is always pinned to the top of the list regardless of sort or filter state.
- Green pulsing "Active" badge displayed on the active well row.
- Inactive wells display "Inactive" text in the status column.

#### Activation Confirmation Modal
- Confirmation dialog opens when clicking the "Activate" button on any inactive well.
- Modal displays well details: Well Name, Well ID, and Rig.
- Streaming indicator with pulsing green dot and informational message.
- Warning block displayed in red when another well is currently active, naming both the target and currently active well.
- Confirm and Cancel action buttons within the modal.
- Close icon button (×) in the top-right corner of the modal.
- Overlay click and Escape key dismiss the modal without changes.
- Activate button is disabled on the currently active well row.

#### LocalStorage Persistence
- Well data persists across browser sessions under the `wellsData` localStorage key.
- Graceful fallback to seed data on invalid JSON, empty arrays, non-array values, or null.
- Graceful error handling when localStorage is unavailable or quota is exceeded.
- Error state tracked and surfaced via the `useWells` hook.

#### Dark Theme
- Custom dark color palette defined in `tailwind.config.js` with exact hex values:
  - Backgrounds: `#1a1a2e` (primary), `#16213e` (secondary), `#0f3460` (tertiary), `#1f2b47` (card), `#253553` (hover)
  - Borders: `#2a3a5c` (primary), `#3a4a6c` (secondary), `#e94560` (accent)
  - Text: `#eaeaea` (primary), `#a8b2d1` (secondary), `#6b7ba3` (muted), `#1a1a2e` (inverse)
  - Accents: `#e94560` (primary/danger), `#d63851` (primary hover), `#0f3460` (secondary), `#4ecca3` (success), `#f0a500` (warning), `#3282b8` (info)
- Custom pulsing animation (`animate-pulse-custom`) for active status indicators.
- Anti-aliased text rendering applied globally.

#### Seed Data
- 11 pre-configured wells with realistic oil & gas industry data.
- One well (`Thunder Horse #1`, `well-001`) set as active by default.
- All wells assigned to rig `CYC36` with varied operators, contractors, and countries.
- Spud dates spanning January 2024 through November 2024.

#### Simulated Navigation
- "Create New Well" button triggers a browser alert placeholder.
- "Create Sidetrack Well" button triggers a browser alert placeholder.
- "Edit" button on each well row triggers a browser alert with the well name.
- "Details" button on each well row triggers a browser alert with the well name.

#### Accessibility
- Semantic HTML table structure with `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` elements.
- ARIA attributes on the activation modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- ARIA labels on filter clear buttons and modal close button.
- `aria-hidden="true"` on decorative SVG icons.
- Focus ring styles on all interactive elements using Tailwind `focus:ring-*` utilities.
- Keyboard support: Escape key closes the activation modal.
- Proper `<label>` element associated with the page size `<select>` via `htmlFor`/`id`.

#### Testing
- Unit tests for pure utility functions: `filterWells`, `sortWells`, and `pinActive`.
- Unit tests for the `useWells` custom hook covering initialization, activation, persistence, reset, filtering, sorting, and pagination.
- Integration tests for `WellListPage` covering grid rendering, filtering, activation modal flow, pagination navigation, page size changes, and button interactions.
- Test setup with Vitest, jsdom environment, and `@testing-library/jest-dom` matchers.

#### Deployment
- Vercel deployment configuration with SPA rewrite rule in `vercel.json`.
- Vite 6 build configuration with React plugin and optimized production output to `dist/`.
- PostCSS configuration with Tailwind CSS and Autoprefixer plugins.