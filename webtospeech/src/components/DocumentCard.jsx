import { File, MoreVertical } from 'lucide-react';
import './DocumentCard.css';

//
export default function DocumentCard({ title, uploadDate, type }) {
  return (
    <div className="document-card-wrapper">
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
