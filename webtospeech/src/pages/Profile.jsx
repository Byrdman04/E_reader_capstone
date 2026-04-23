import { ArrowLeft, User, LogOut, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    function displayUserData(pfpUrl, userName) {
      const displayName = document.getElementsByClassName('profile-name')[0];
      const profilePicture = document.getElementsByClassName('profile-avatar')[0];
      const booksUploadedStat = document.getElementsByClassName('profile-stats-number')[0];

      displayName.innerText = userName;
      profilePicture.innerHTML = ''; // Remove placeholder SVG
      profilePicture.innerHTML = `<img src="${pfpUrl}" class="avatar-img" />`;

      booksUploadedStat.innerText = sessionStorage.getItem("numBooksUploaded") || 0;
    }

    const storedCollections = sessionStorage.getItem('collections');
    if (storedCollections) {
      setCollections(JSON.parse(storedCollections));
    }

    //If user data already cached, use existing info
    if (sessionStorage.getItem("pfpUrl") && sessionStorage.getItem("username")) {
      displayUserData(
        sessionStorage.getItem("pfpUrl"),
        sessionStorage.getItem("username")
      );
      return;
    }
  }, [navigate]);

    const handleDelete = async (collectionId) => {
      const confirmDelete = window.confirm("Delete this collection?");
      if (!confirmDelete) return;

      // 1. delete child rows
      await supabase
        .from('memberOfCollection')
        .delete()
        .eq('collection_id', collectionId);

      // 2. delete collection
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);

        

      if (!error) {
        setCollections(prev =>
          prev.filter(c => c.id !== collectionId)
        );
      }
    };

    const handleEdit = async (collectionId, currentName) => {
      const newName = prompt("Rename collection:", currentName);

      if (!newName || newName.trim() === "") return;

      const { error } = await supabase
        .from('collections')
        .update({ name: newName.trim() })
        .eq('id', collectionId);

      if (error) {
        console.error("Failed to update collection:", error.message);
        return;
      }

      // update UI
      setCollections(prev =>
        prev.map(c =>
          c.id === collectionId
            ? { ...c, name: newName }
            : c
        )
      );
    };

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
            <h2 className="profile-name">&#8203;</h2>
          </div>

          {/* Right Column - Files Uploaded Stats */}
          <div className="profile-stats">
            <h3 className="profile-stats-label">Files Uploaded</h3>
            <p className="profile-stats-number">&#8203;</p>
          </div>
        </div>
      </header>

      {/* Collections Section */}
      <section className="profile-collections">
        <h3 className="profile-collections-title">Collections</h3>

        <ul className="profile-collections-list">
          {collections.length === 0 ? (
            <li className="profile-collection-item">No collections yet</li>
          ) : (
            collections.map((collection) => (
              <li
                key={collection.id}
                className="profile-collection-item"
              >
                <span>{collection.name}</span>

                <div className="collection-actions">
                  <Pencil
                    size={18}
                    className="collection-icon edit-icon"
                    onClick={() => handleEdit(collection.id, collection.name)}
                  />
                  <Trash2
                    size={18}
                    className="collection-icon delete-icon"
                    onClick={() => handleDelete(collection.id)}
                  />
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Logout Button */}
        <button
          className="profile-logout-button"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/");
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </section>
    </div>
  );
}