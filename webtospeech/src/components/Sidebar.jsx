import { User, FolderPlus, Upload } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* User Profile */}
      <div className="sidebar-user-profile">
        <div className="sidebar-user-avatar">
          <User />
        </div>
      </div>

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
