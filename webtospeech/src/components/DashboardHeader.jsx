import { Search, Filter } from 'lucide-react';
import './DashboardHeader.css';

export default function DashboardHeader() {
  return (
    <header className="dashboard-header">
      {/* Logo/Title */}
      <h1 className="dashboard-header-title">WebToSpeech</h1>

      {/* Search Bar */}
      <div className="dashboard-header-search-container">
        <div className="dashboard-header-search-wrapper">
          <input
            type="text"
            placeholder="Search documents..."
            className="dashboard-header-search-input"
          />
          <Search className="dashboard-header-search-icon" />
        </div>

        {/* Filter Button */}
        <button className="dashboard-header-filter-button">
          <Filter />
        </button>
      </div>
    </header>
  );
}
