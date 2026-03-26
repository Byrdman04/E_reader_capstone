import { File, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DocumentCard.css';

//
export default function DocumentCard({ id, title, uploadDate, type }) {
  const navigate = useNavigate();

  
  return (
    //Makes the cards clickable and navigates to the document page when clicked
    <div className="document-card-wrapper" onClick={() => navigate(`/document/${id}`)}>
      {/* Card */}
      <div className="document-card">
        <div className="document-card-content">
          <File className="document-card-icon" />
          <h4 className="document-card-title">{title}</h4>
          <p className="document-card-type">{type}</p>
        </div>
      </div>

      {/* Menu Button - appears on hover */}
      <button className="document-card-menu">
        <MoreVertical />
      </button>

      {/* Document info */}
      <p className="document-card-date">{uploadDate}</p>
    </div>
  );
}
