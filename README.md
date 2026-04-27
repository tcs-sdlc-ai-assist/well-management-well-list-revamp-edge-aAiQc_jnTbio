# Well List Revamp

A single-page application for managing and monitoring oil & gas wells. Built with React 18, Vite, Tailwind CSS, and JavaScript ES2022.

## Tech Stack

- **React 18** — Functional components with hooks
- **Vite 6** — Fast development server and optimized production builds
- **Tailwind CSS 3** — Utility-first styling with a custom dark theme palette
- **JavaScript ES2022** — Modern syntax with JSDoc annotations
- **Vitest** — Unit and integration testing
- **React Testing Library** — Component testing focused on user behavior
- **PropTypes** — Runtime prop validation

## Features

- **Well List Grid** — Tabular display of all wells with status, rig, name, ID, spud date, operator, contractor, and action columns
- **Single-Active Well Invariant** — Only one well can be active at a time; activating a new well automatically deactivates the previous one
- **Active Well Pinning** — The active well is always pinned to the top of the list
- **Real-Time Filtering** — Case-insensitive, partial-match filtering on rig, well name, well ID, operator, and contractor columns with AND logic across multiple filters
- **Sortable Spud Date** — Toggle ascending/descending sort on the Spud Date column
- **Pagination** — Configurable page sizes (10, 25, 50) with First, Prev, Next, Last navigation controls
- **Activation Confirmation Modal** — Confirmation dialog with warning when deactivating another well
- **LocalStorage Persistence** — Well data persists across browser sessions with graceful fallback to seed data on errors
- **Responsive Design** — Mobile-friendly layout with Tailwind responsive utilities

## Folder Structure

```
well-list-revamp/
├── index.html                          # HTML entry point
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite configuration
├── vitest.config.js                    # Vitest configuration
├── tailwind.config.js                  # Tailwind CSS theme and palette
├── postcss.config.js                   # PostCSS plugins
├── vercel.json                         # Vercel deployment rewrites
├── src/
│   ├── main.jsx                        # React DOM root render
│   ├── App.jsx                         # Root application component
│   ├── index.css                       # Tailwind directives and custom utilities
│   ├── setupTests.js                   # Test setup (jest-dom matchers)
│   ├── features/
│   │   └── wellList/
│   │       ├── WellListPage.jsx        # Page-level container component
│   │       ├── WellListPage.test.jsx   # Integration tests for the page
│   │       ├── components/
│   │       │   ├── ActionCell.jsx      # Activate, Edit, Details buttons
│   │       │   ├── ActivationModal.jsx # Confirmation modal dialog
│   │       │   ├── ActiveBadge.jsx     # Green pulsing status badge
│   │       │   ├── Pagination.jsx      # Pagination footer controls
│   │       │   ├── TableHeaderFilters.jsx # Filter input row
│   │       │   ├── WellRow.jsx         # Individual well table row
│   │       │   └── WellTable.jsx       # Main table with headers and rows
│   │       ├── data/
│   │       │   └── initialWells.js     # Seed data (11 wells)
│   │       ├── hooks/
│   │       │   ├── useWells.js         # State management hook
│   │       │   └── useWells.test.js    # Hook unit tests
│   │       └── utils/
│   │           ├── filterWells.js      # Pure filtering utility
│   │           ├── filterWells.test.js # Filter unit tests
│   │           ├── pinActive.js        # Active well pinning utility
│   │           ├── pinActive.test.js   # Pin utility unit tests
│   │           ├── sortWells.js        # Pure sorting utility
│   │           └── sortWells.test.js   # Sort utility unit tests
│   └── shared/
│       └── icons/
│           ├── CloseIcon.jsx           # SVG close (X) icon
│           ├── SearchIcon.jsx          # SVG search/magnifying glass icon
│           └── SortIcon.jsx            # SVG sort arrow icon
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
npm install
```

### Development

Start the local development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build

Create an optimized production build:

```bash
npm run build
```

Output is written to the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run all tests once:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

## Usage Guide

1. **Viewing Wells** — The well list loads with 11 seed wells on first visit. The active well is pinned to the top row with a green "Active" badge.
2. **Filtering** — Type into any column filter input below the header row to narrow results. Filters combine with AND logic. Click the × button to clear a filter.
3. **Sorting** — Click the "Spud Date" column header to toggle between ascending and descending sort order.
4. **Activating a Well** — Click the "Activate" button on any inactive well row. A confirmation modal appears. If another well is currently active, a warning message is displayed. Click "Activate" to confirm or "Cancel" to dismiss.
5. **Pagination** — Use First, Prev, Next, and Last buttons to navigate pages. Change the "Rows per page" dropdown to adjust page size (10, 25, or 50).
6. **Data Persistence** — All well status changes are saved to localStorage under the key `wellsData`. Data persists across page reloads and browser sessions.

## Deployment

This project is configured for deployment on **Vercel**. The `vercel.json` file includes a rewrite rule that directs all routes to `index.html` for client-side rendering.

To deploy:

1. Connect the repository to Vercel
2. Vercel auto-detects the Vite framework preset
3. Build command: `npm run build`
4. Output directory: `dist`

## License

Private