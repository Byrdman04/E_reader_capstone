import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();

    const loadDashboardPage = () => {
    navigate('/Dashboard');
    };

    const loadLoginPage = () => {
    navigate('/');
    };

    const collections = [
    { id: 1, name: 'Collection Name' },
    { id: 2, name: 'Collection Name' },
    { id: 3, name: 'Collection Name' },
  ];

    return (
        <div className="profile-container">
      {/* Return to Dashboard */}
      <Link to="/" className="return-link">
        <ArrowLeft />
        <span onClick={loadDashboardPage}>Return to Dashboard</span>
      </Link>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-left">
          <div className="profile-avatar">
            <User />
          </div>
          <div className="profile-name">Username's Profile</div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-label">Files Uploaded</div>
            <div className="stat-value">24</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Documents Completed</div>
            <div className="stat-value">4</div>
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <div className="collections-section">
        <h2 className="collections-title">Collections</h2>
        <div className="collections-border"></div>
        
        <div className="collections-content">
          <div className="collections-list">
            {collections.map((collection) => (
              <div key={collection.id} className="collection-row">
                <span className="collection-name">{collection.name}</span>
                <button className="collection-view-button">View</button>
              </div>
            ))}
          </div>

          <div className="collections-placeholder">
            <div className="placeholder-question">?</div>
          </div>
        </div>
      </div>
      <button onClick={loadLoginPage}>Go to Login</button>
    </div>
  );
}

export default Profile;