import { useState, useMemo } from 'react';
//import { useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import DocumentCard from '../components/DocumentCard';
import './Dashboard.css';
import Book from '../components/BookDir/Book';
import Collection from '../components/BookDir/Collection';



export default function Dashboard() {
  const myCollection = useMemo(() => {
  const col = new Collection();
  col.addBook(new Book(1, "The Great Gatsby", "F. Scott Fitzgerald", "Fiction", "epub","March 15, 2026", "/path/to/gatsby"));
  col.addBook(new Book(2, "1984", "George Orwell", "Fiction", "pdf", "March 14, 2026", "/path/to/1984"));
  col.addBook(new Book(3, "To Kill a Mockingbird", "Harper Lee", "Fiction", "txt", "March 13, 2026", "/path/to/mockingbird"));
  return col;
}, []);

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