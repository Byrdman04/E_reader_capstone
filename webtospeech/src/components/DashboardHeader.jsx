import { Search } from 'lucide-react';
import './DashboardHeader.css';
import { useState } from 'react'; 

export default function DashboardHeader( { outputSearch}) {

const [queary, setQueary] = useState("");


//Function for when enter key is pressed.
function handleKeyPress(e){
  if(e.key === 'Enter'){
    outputSearch(queary);
  }
}

//Function for button click for search
function handleSearchClick(){
  outputSearch(queary);
}

//Function for clearing search when the input is cleared.
function handleInputChange(e){
  setQueary(e.target.value);
  if(e.target.value.trim() === ""){
    outputSearch("");
  }
}

  return (
    <header className="dashboard-header">
      {/* Logo/Title */}
      <h1 className="dashboard-header-title">WebToSpeech</h1>

      {/* Search Bar */}
      <div className="dashboard-header-search-container">
        <div className="dashboard-header-search-wrapper">
          <input
            type="text"
            placeholder="Search documents..."
            className="dashboard-header-search-input"
            value = {queary} //passed string
            onChange = {handleInputChange} //updates parent element
            onKeyDown = {handleKeyPress} //handles enter key
          />
          <Search 
            className="dashboard-header-search-icon" 
            onClick={handleSearchClick}
            style={{ cursor: 'pointer' }}
            />
        </div>

        {/* Filter Button */}
        {/*<button className="dashboard-header-filter-button">
          <Filter />
        </button>*/}
      </div>
    </header>
  );
}
