import { User, FolderPlus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import './Sidebar.css';
import UploadModal from '../components/Upload';
import { supabase } from "../supabaseClient";
import CreateCollection from './CreateCollection';

export default function Sidebar({ onNavigate, selectedCollection, setSelectedCollection }) {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);

  const [collections, setCollections] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchCollections() {
      const { data, error } = await supabase
        .from('collections')
        .select('id, name')
        .order('id');

      if (!error && data) {
        setCollections(data);
        sessionStorage.setItem('collections', JSON.stringify(data));
      }
    }

    fetchCollections();
  }, []);

  function handleNewCollection(newCol) {
    setCollections(prev => {
      const updated = [...prev, newCol];
      sessionStorage.setItem('collections', JSON.stringify(updated));
      return updated;
    });
  }

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <aside className="sidebar">
        <button
          className="sidebar-user-profile"
          onClick={() => handleNavigation('/profile')}
          aria-label="Go to profile"
        >
          <div className="sidebar-user-avatar">
            <User />
          </div>
        </button>

        <button className="sidebar-button" onClick={() => setShowCreate(true)}>
          <FolderPlus />
        </button>

        <div className="sidebar-collections">
          <h3>Collections</h3>
          <ul className="sidebar-collections-list">
            {filteredCollections.map((collection) => (
              <li key={collection.id}>
                <button
                  className={`sidebar-collection-item ${selectedCollection === collection.id ? 'active' : ''}`}
                  onClick={() => {
                    if (selectedCollection === collection.id) {
                      setSelectedCollection(null);
                    } else {
                      setSelectedCollection(collection.id);
                    }
                  }}
                >
                  {collection.name}
                </button>
              </li>
            ))}
            {filteredCollections.length === 0 && (
              <li className="sidebar-no-collections">No collections found</li>
            )}
          </ul>
        </div>

        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button className="sidebar-upload" onClick={() => setShowUpload(true)}>
          <Upload />
        </button>
      </aside>

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} />
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