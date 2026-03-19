import { ArrowLeft, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      {/* Header Section */}
      <header className="profile-header">
        {/* Back Arrow */}
        <button 
          className="profile-back-button"
          onClick={() => navigate('/dashboard')}
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={32} />
        </button>

        {/* Two Column Layout */}
        <div className="profile-header-content">
          {/* Left Column - Profile Info */}
          <div className="profile-info">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <h2 className="profile-name">John Doe</h2>
          </div>

          {/* Right Column - Files Uploaded Stats */}
          <div className="profile-stats">
            <h3 className="profile-stats-label">Files Uploaded</h3>
            <p className="profile-stats-number">42</p>
          </div>
        </div>

        {/* Settings Icon */}
        <button 
          className="profile-settings-button"
          aria-label="Settings"
        >
          <Settings size={32} />
        </button>
      </header>

      {/* Collections Section */}
      <section className="profile-collections">
        <h3 className="profile-collections-title">Collections</h3>
        <ul className="profile-collections-list">
          <li className="profile-collection-item">Collection 1</li>
          <li className="profile-collection-item">Collection 2</li>
          <li className="profile-collection-item">Collection 3</li>
        </ul>
      </section>
    </div>
  );
}