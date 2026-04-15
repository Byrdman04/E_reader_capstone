import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import DocumentCard from '../components/DocumentCard';
import './Dashboard.css';
import Book from '../components/BookDir/Book';
import Collection from '../components/BookDir/Collection';
import { createClient } from "@supabase/supabase-js"; 

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

export default function Dashboard() {
  const navigate = useNavigate();

  const [books, setBooks] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  async function loadUserInfo() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  useEffect(() => {
    function displayUserData(pfpUrl) {
      const profilePicture = document.getElementsByClassName('sidebar-user-avatar')[0];
      profilePicture.innerHTML = '';
      profilePicture.innerHTML = `<img src="${pfpUrl}" class="avatar-img" />`;
    }

    if (sessionStorage.getItem("pfpUrl") && sessionStorage.getItem("username")) {
      displayUserData(sessionStorage.getItem("pfpUrl"), sessionStorage.getItem("username"));
      return;
    }

    loadUserInfo().then((data) => {
      if (!data) {
        alert("No user information loaded, please log in.");
        navigate('/');
      }

      displayUserData(data.user_metadata.avatar_url, data.user_metadata.name);

      sessionStorage.setItem("pfpUrl", data.user_metadata.avatar_url);
      sessionStorage.setItem("username", data.user_metadata.name);
    });
  }, [navigate]);

  const fetchBooks = useCallback(async (search = "") => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setBooks(null);

    let data = [];
    let error = null;

    if (activeCollection) {
      const { data: links, error: linkError } = await supabase
        .from('memberOfCollection')
        .select('book_id')
        .eq('collection_id', activeCollection);

      if (linkError) {
        setFetchError("Could not fetch collection links");
        return;
      }

      const bookIds = links.map(l => l.book_id);

      if (bookIds.length === 0) {
        setBooks([]);
        return;
      }

      const res = await supabase
        .from('books')
        .select('id, title, author, file_url, created_at')
        .in('id', bookIds);

      data = res.data;
      error = res.error;
    } else {
      let query = supabase
        .from('books')
        .select('id, title, author, file_url, created_at')
        .eq('uploaded_by', user.id);

      if (search.trim() !== "") {
        query = query.ilike('title', `%${search}%`);
      }

      const res = await query;
      data = res.data;
      error = res.error;
    }

    if (error) {
      setFetchError("Could not fetch books");
      setBooks(null);
      return;
    }

    setBooks(data || []);
  }, [navigate, activeCollection]);

  const handleSearch = (str) => {
    fetchBooks(str);
  };

  useEffect(() => {
    fetchBooks();
  }, [activeCollection]);

  const myCollection = useMemo(() => {
    const col = new Collection();
    if (books !== null) {
      books.forEach((book) => {
        col.addBook(new Book(
          book.id,
          book.title,
          book.author,
          "Fiction",
          book.file_type,
          book.created_at,
          book.file_url
        ));
      });
    }
    return col;
  }, [books]);

  return (
    <div className="dashboard-container">
      <button 
        className="dashboard-mobile-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {isSidebarOpen && (
        <div 
          className="dashboard-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`dashboard-sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar
          onNavigate={() => setIsSidebarOpen(false)}
          selectedCollection={activeCollection}
          setSelectedCollection={(id) => {
            setActiveCollection(id === activeCollection ? null : id);
          }}
        />
      </div>

      <div className="dashboard-main-content">
        <DashboardHeader outputSearch={handleSearch}/>

        <main className="dashboard-grid-container">
          <div className="dashboard-documents-grid">
            {myCollection.getCollection().map((doc) => (
              <DocumentCard 
                key={doc.id}
                id={doc.id}
                title={doc.title}
                uploadDate={doc.uploadDate}
                type={doc.fileType}
                fileURL={doc.fileURL}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}