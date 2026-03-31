import { useState, useMemo, useEffect } from 'react';
//import { useNavigate } from 'react-router';
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

  const [books, setBooks] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  console.log(fetchError); //This only exists to "use" the variable for no warning compilation.

  useEffect(() => {
    const fetchBooks = async () => {
      const { data: { user} } = await supabase.auth.getUser();
    if (!user) {
        alert("You must be logged in to upload a book.");
        return;
    }

//this is the fetching from the DB 
const { data, error } = await supabase
  .from('books')
  .select('id, title, author, file_url, created_at')
  .eq('uploaded_by', user.id);

  if(error){
    setFetchError("Could not fetch books");
    setBooks(null);
    console.log(error);
  }
  if(data){
    setBooks(data);
    setFetchError(null);
  }

  console.log(data, error);
  
  
    }
    //Makes it continuous or something. 
    fetchBooks()
  }, []);
  


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
        <DashboardHeader />

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
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}