import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import DocumentCard from '../components/DocumentCard';
import './Dashboard.css';

// Mock data for documents
const mockDocuments = [
  {
    id: '1',
    title: 'Annual Report 2026',
    uploadDate: 'March 15, 2026',
    type: 'PDF Document',
  },
  {
    id: '2',
    title: 'Meeting Notes',
    uploadDate: 'March 14, 2026',
    type: 'Text Document',
  },
  {
    id: '3',
    title: 'Project Proposal',
    uploadDate: 'March 13, 2026',
    type: 'Word Document',
  },
  {
    id: '4',
    title: 'Budget Analysis',
    uploadDate: 'March 12, 2026',
    type: 'Excel Spreadsheet',
  },
  {
    id: '5',
    title: 'Marketing Strategy',
    uploadDate: 'March 11, 2026',
    type: 'PDF Document',
  },
  {
    id: '6',
    title: 'Research Paper',
    uploadDate: 'March 10, 2026',
    type: 'PDF Document',
  },
  {
    id: '7',
    title: 'Client Feedback',
    uploadDate: 'March 9, 2026',
    type: 'Text Document',
  },
  {
    id: '8',
    title: 'Product Roadmap',
    uploadDate: 'March 8, 2026',
    type: 'PowerPoint',
  },
];

export default function Dashboard() {
  const [documents] = useState(mockDocuments);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-main-content">
        {/* Header */}
        <DashboardHeader />

        {/* Document Grid */}
        <main className="dashboard-grid-container">
          <div className="dashboard-documents-grid">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} {...doc} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}