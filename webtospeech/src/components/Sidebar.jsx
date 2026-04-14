import { User, FolderPlus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import './Sidebar.css';
import UploadModal from '../components/Upload';
import { useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import CreateCollection from './CreateCollection';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function Sidebar({ onNavigate }) {
  console.log('CreateCollection import:', CreateCollection);
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  
  //Collections Bar
  const [collections, setCollections] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
  async function fetchCollections() {
    const { data, error } = await supabase
      .from('collections')
      .select('id, name')
      .order('id');

    if (!error && data) {
      setCollections(data);
    }
  }

  fetchCollections();
}, []);

  function handleNewCollection(newCol) {
    setCollections(prev => [...prev, newCol]);
  }



  
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
      <button className="sidebar-button" onClick={() => setShowCreate(true)}>
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
      </button>
    </aside>

    {showUpload && (
      <UploadModal onClose={() => setShowUpload(false)}/>
    )}

    {showCreate && (
      <CreateCollection
        onClose={() => setShowCreate(false)}
        onCreate={handleNewCollection}
  />
)}
    </>
  );
}