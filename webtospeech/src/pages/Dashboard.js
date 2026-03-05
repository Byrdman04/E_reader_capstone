import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User, Search, Filter, FolderPlus, Upload } from 'lucide-react';
import './Dashboard.css';


function Dashboard() {
    const navigate = useNavigate();

    const loadProfilePage = () => {
    navigate('/Profile');
    };

const [directories/*, setDirectories*/] = useState([
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Technical' },
    { id: 4, name: 'Research' },
  ]);

  const [books] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: '#e5e7eb' },
    { id: 2, title: '1984', author: 'George Orwell', cover: '#dbeafe' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: '#fce7f3' },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', cover: '#fef3c7' },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', cover: '#d1fae5' },
    { id: 6, title: 'Animal Farm', author: 'George Orwell', cover: '#e0e7ff' },
  ]);

  const [selectedDirectory, setSelectedDirectory] = useState(null);


    return (
    <div className="app-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="profile-icon" onClick={loadProfilePage}>
          <User />
          
        </div>
        <div className="title">Web To Speach</div>
        <div className="spacer" />
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search books..."
            className="search-input"
          />
        </div>
        <button className="filter-button">
          <Filter />
        </button>
      </div>

      <div className="main-content">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="sidebar-top">
            <button className="add-directory-button">
              <FolderPlus />
              Add Directory
            </button>
          </div>

          <div className="directories-list">
            {directories.map((dir) => (
              <div
                key={dir.id}
                onClick={() => setSelectedDirectory(dir.id)}
                className={`directory-item ${selectedDirectory === dir.id ? 'selected' : ''}`}
              >
                {dir.name}
              </div>
            ))}
          </div>

          <div className="sidebar-bottom">
            <button className="upload-button" >
              <Upload />
              Upload
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="books-area">
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-item">
                <div
                  className="book-cover"
                  style={{ backgroundColor: book.cover }}
                >
                  <div className="book-cover-inner">
                    <div className="book-cover-title">{book.title}</div>
                  </div>
                </div>
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default Dashboard;