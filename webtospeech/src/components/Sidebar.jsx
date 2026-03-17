import { User, FolderPlus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {/* User Profile */}
      <button 
        className="sidebar-user-profile"
        onClick={() => navigate('/profile')}
        aria-label="Go to profile"
      >
        <div className="sidebar-user-avatar">
          <User />
        </div>
      </button>

      {/* Add Folder Button */}
      <button className="sidebar-button">
        <FolderPlus />
      </button>

      {/* Collections */}
      <div className="sidebar-collections">
        <h3>Collections</h3>
      </div>

      {/* Search Input */}
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      {/* Upload Button */}
      <button className="sidebar-upload">
        <Upload />
      </button>
    </aside>
  );
}