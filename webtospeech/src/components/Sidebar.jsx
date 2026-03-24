import { User, FolderPlus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import './Sidebar.css';
import UploadModal from '../components/Upload';

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  
  // Mock collections data
  const collections = [
    { id: 1, name: 'Collection 1' },
    { id: 2, name: 'Collection 2' },
    { id: 3, name: 'Collection 3' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <>
    <aside className="sidebar">
      {/* User Profile */}
      <button 
        className="sidebar-user-profile"
        onClick={() => handleNavigation('/profile')}
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
        <ul className="sidebar-collections-list">
          {collections.map((collection) => (
            <li key={collection.id}>
              <button
                className={`sidebar-collection-item ${selectedCollection === collection.id ? 'active' : ''}`}
                onClick={() => setSelectedCollection(collection.id)}
              >
                {collection.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Search Input */}
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      {/* Upload Button */}
      <button className="sidebar-upload" onClick={() => setShowUpload(true)}>
        <Upload />
        Upload 
      </button>
    </aside>

    {showUpload && (
      <UploadModal onClose={() => setShowUpload(false)}/>
    )}
    </>
  );
}