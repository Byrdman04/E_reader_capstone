import { ArrowLeft, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { supabase } from '../supabaseClient'
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();

  async function loadUserInfo() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  useEffect(() => {
    function displayUserData(pfpUrl, userName) {
      const displayName = document.getElementsByClassName('profile-name')[0];
      const profilePicture = document.getElementsByClassName('profile-avatar')[0];
      const booksUploadedStat = document.getElementsByClassName('profile-stats-number')[0];

      displayName.innerText = userName;
      profilePicture.innerHTML = ''; // Remove placeholder SVG
      profilePicture.style.backgroundImage = `url(${pfpUrl})`;
      profilePicture.style.backgroundPosition = 'center';
      profilePicture.style.backgroundRepeat = 'no-repeat';
      profilePicture.style.backgroundSize = 'cover';

      if (sessionStorage.getItem("numBooksUploaded")) {
        booksUploadedStat.innerText = sessionStorage.getItem("numBooksUploaded");
      } else {
        booksUploadedStat.innerText = 0;
      }
    }

    //If user data already cached, use existing info
    if (sessionStorage.getItem("pfpUrl") && sessionStorage.getItem("username")) {
      displayUserData(sessionStorage.getItem("pfpUrl"), sessionStorage.getItem("username"));
      return;
    }

    //Otherwise, fetch the user data
    loadUserInfo().then((data) => {
      console.log(data);
      displayUserData(data.user_metadata.avatar_url, data.user_metadata.name);

      sessionStorage.setItem("pfpUrl", data.user_metadata.avatar_url);
      sessionStorage.setItem("username", data.user_metadata.name);
    });
  }, []);

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

        {/* Logout Button */}
        <button
          className="profile-logout-button"
          onClick={async () => {
            supabase.auth.signOut();
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