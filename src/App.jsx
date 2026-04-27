import { WellListPage } from './features/wellList/WellListPage.jsx';

/**
 * Root application component.
 * Thin shell that renders WellListPage.
 * No routing — single page application.
 *
 * @returns {JSX.Element} Application root element
 */
export default function App() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <WellListPage />
    </div>
  );
}