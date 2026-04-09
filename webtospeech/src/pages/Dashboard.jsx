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

// Initialize Supabase client
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

export default function Dashboard() {
  const navigate = useNavigate();

  const [books, setBooks] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  async function loadUserInfo() {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }

    useEffect(() => {
    function displayUserData(pfpUrl) {
      const profilePicture = document.getElementsByClassName('sidebar-user-avatar')[0];

      profilePicture.innerHTML = ''; // Remove placeholder SVG
      profilePicture.innerHTML = `<img src="${pfpUrl}" class="avatar-img" />`;
    }

    //If user data already cached, use existing info
    if (sessionStorage.getItem("pfpUrl") && sessionStorage.getItem("username")) {
      displayUserData(sessionStorage.getItem("pfpUrl"), sessionStorage.getItem("username"));
      return;
    }

    //Otherwise, fetch the user data
    loadUserInfo().then((data) => {
      if (!data){
        alert("No user information loaded, please log in.");
        navigate('/');
      }

      console.log(data);
      displayUserData(data.user_metadata.avatar_url, data.user_metadata.name);

      sessionStorage.setItem("pfpUrl", data.user_metadata.avatar_url);
      sessionStorage.setItem("username", data.user_metadata.name);
    });
  }, [navigate]);

  //Do useCallback to prevent infinite loop of useEffect and fetchBooks.
  //Also it will cache the results of the function and only re-run it when the dependencies change.
  const fetchBooks = useCallback(async (search = "") => {
    const { data: { user} } = await supabase.auth.getUser();
    if (!user) {
      
      alert("You must be logged in to upload a book.");
        navigate('/');
        return;
    }

    //this just creates the queary
    let queary = supabase
      .from('books')
      .select('id, title, author, file_url, created_at')
      .eq('uploaded_by', user.id);

    //this will modify the if there is a search
    if(search.trim() !== ""){
    queary = queary.ilike('title', `%${search}%`);
    //ilike ignores case for the search and the % is a wildcard that allows for partial matches. 
    // So if the search is "Harry" it will match "Harry Potter" and "harry potter and the sorcerer's stone"
    }

    //calls the queary on the DB and 
    const { data, error } = await queary;

    if(error){
      setFetchError("Could not fetch books");
      setBooks(null);
      console.log(error);
      console.log(fetchError);
      return;
    }

    if(data){
      setBooks(data);
      setFetchError(null);
    }

    console.log(data, error);
    //This should only ever get set for the total num of books, not for collections.
    sessionStorage.setItem("numBooksUploaded", data.length);
  
  //dependency just to get rid of no use warning and error check.
  }, [fetchError, navigate]);

  //on search it will update the search state and call fetchBooks with the new search term.
  const handleSearch = (str) => {
    fetchBooks(str);
  };
  
  useEffect(() => {
    //Makes it continuous or something. 
    fetchBooks()
  }, [fetchBooks]);


  const myCollection = useMemo(() => {
  const col = new Collection();
  if (books !== null) {
    books.forEach((book) => {
      col.addBook(new Book(book.id, book.title, book.author, "Fiction", book.file_type, book.created_at, book.file_url));
    });
  }
  return col;
}, [books]);

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Mobile Menu Button */}
      <button 
        className="dashboard-mobile-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="dashboard-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`dashboard-sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="dashboard-main-content">
        {/* Header */}
        <DashboardHeader outputSearch={handleSearch}/>

        {/* Document Grid */}
        <main className="dashboard-grid-container">
          <div className="dashboard-documents-grid">
            {/* What this does is map through the collection and display each document */}
            {myCollection.getCollection().map((doc) => (
              /* 1. The DocumentCard component  is created for each book in the collection
                2. key={doc.id} gives each card a unique identifier for tracking updating and deleation.
                3. The {...doc} takes all the properties of the book object and passes them
                  To the DocumentCard component to create the card instace for that object.
                  
                  Note: changed {...doc} to only taking specific info from the book object.*/
              <DocumentCard key={doc.id} 
              id = {doc.id}
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