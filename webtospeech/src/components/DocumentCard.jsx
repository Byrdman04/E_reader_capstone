import { File, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import './DocumentCard.css';
import { supabase } from "../supabaseClient";

export default function DocumentCard({ id, title, uploadDate, type, fileURL }) {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="document-card-wrapper">
      
      {/* ONLY THIS navigates */}
      <div
        className="document-card"
        onClick={() => navigate(`/document/${id}`)}
      >
        <div className="document-card-content">
          <File className="document-card-icon" />
          <h4 className="document-card-title">{title}</h4>
          <p className="document-card-type">{type}</p>
        </div>
      </div>

      <ThreeDotMenu
        bookId={id}
        fileURL={fileURL}
        items={[
          { label: 'Edit', onClick: () => setShowEdit(true) },
          { label: 'Add to Collection', type: 'collections' },
          { label: 'Delete', onClick: () => deleteDocument(id, fileURL) }
        ]}
      />

      {showEdit && (
        <EditDocument
          documentID={id}
          onClose={() => setShowEdit(false)}
        />
      )}

      <p className="document-card-date">{uploadDate}</p>
    </div>
  );
}

function ThreeDotMenu({ items, bookId }) {
  const [open, setOpen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    async function fetchCollections() {
      const { data } = await supabase
        .from('collections')
        .select('id, name');

      if (data) setCollections(data);
    }

    fetchCollections();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowCollections(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={ref}>

      <button
        className="document-card-menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
          setShowCollections(false);
        }}
      >
        <MoreVertical />
      </button>

      {open && (
        <ul className="three-dot-menu-dropdown">

          {items.map((item) => {

            if (item.type === 'collections') {
              return (
                <li key="collections">

                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCollections((v) => !v);
                    }}
                  >
                    Add to Collection ▸
                  </button>

                  {showCollections && (
                    <div
                      className="collections-submenu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {collections.map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          className="dropdown-subitem"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCollection(bookId, col.id);
                            setOpen(false);
                            setShowCollections(false);
                          }}
                        >
                          {col.name}
                        </button>
                      ))}
                    </div>
                  )}

                </li>
              );
            }

            return (
              <li key={item.label}>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    item.onClick();
                  }}
                >
                  {item.label}
                </button>
              </li>
            );
          })}

        </ul>
      )}
    </div>
  );
}

async function addToCollection(bookId, collectionId) {
  const { error } = await supabase
    .from('memberOfCollection')
    .insert({ book_id: bookId, collection_id: collectionId });

  if (error) {
    console.error(error);
    alert("Failed to add to collection");
  } else {
    console.log("Added to collection");
  }
}

async function deleteDocument(documentId, fileURL) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', documentId);

  if (error) {
    console.error(error);
  }

  await supabase.storage
    .from('user-books')
    .remove([fileURL]);
}

function EditDocument({ documentID, onClose }) {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  async function saveChanges() {
    await supabase
      .from('books')
      .update({ title: newTitle, author: newAuthor })
      .eq('id', documentID);

    onClose();
  }

  return (
    <div className="edit-document-form" onClick={onClose}>
      <div className="edit-document-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Document</h2>

        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
          placeholder="Author"
        />

        <div className="button-row">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={saveChanges}>Save</button>
        </div>
      </div>
    </div>
  );
}