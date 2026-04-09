import { File, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState , useRef} from 'react';
import './DocumentCard.css';
import { createClient } from "@supabase/supabase-js";
import { createPortal } from 'react-dom';


const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

//
export default function DocumentCard({ id, title, uploadDate, type, fileURL }) {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  

  
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
      <ThreeDotMenu
        items= {[
          { label: 'Edit', onClick: () => setShowEdit(true) },
          { label: 'Delete', onClick: () => {deleteDocument(id, fileURL); console.log('Delete'); } },
        ]}
        /> 
        {showEdit && (
          <EditDocument 
          documentID={id} 
          onClose={() => setShowEdit(false)} />
        )}


      {/* Document info */}
      <p className="document-card-date">{uploadDate}</p>
    </div>
  );
}

function ThreeDotMenu({items}){
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef(null);

useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={ref}>
      <button className="document-card-menu" onClick={(e) => {e.stopPropagation(); setShowMenu(!showMenu); }} aria-label="Open menu">
        <MoreVertical />
      </button>
      {showMenu && (
        <ul className="three-dot-menu-dropdown" onClick={(e) => e.stopPropagation()}>
          {items.map((item) => (
            <li key={item.label}
               onClick={() => {item.onClick(); setShowMenu(false);}}
               >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}

async function deleteDocument(documentId, fileURL) {
    try {
        // This deletes the document record from the database TABLE
        const { error: deleteError } = await supabase
            .from('books')
            .delete()
            .eq('id', documentId);

        if (deleteError) throw deleteError;

        // This deletes the file from the bucket in the DB
        const { error: storageError } = await supabase.storage
             .from('user-books')
             .remove([fileURL]); 
             

        if (storageError) throw storageError;

        console.log("Deleted successfully");

    } catch (err) {
        console.error("Delete Failed:", err);
    }
  }

   function EditDocument({documentID, onClose}) {
    const [newTitle, setNewTitle] = useState("");
    const [newAuthor, setNewAuthor] = useState("");

    async function saveChanges() {
    try {

        //Valid input check
        if(newTitle.trim() === "" || newAuthor.trim() === ""){
          alert("Title and Author cannot be empty");
          return;
        }

        // This updates the document record in the database TABLE
        const { error: updateError } = await supabase
            .from('books')
            .update({ title: `${newTitle}`, author: `${newAuthor}` })
            .eq('id', documentID);

        if (updateError) throw updateError;

        console.log("Updated successfully");
        onClose(); // Close the edit form after saving

    } catch (err) {
        console.error("Update Failed:", err);
    }
  }

    return createPortal(
      <div className="edit-document-form" onClick={(e) => {e.stopPropagation(); onClose();}}>
        <div className="edit-document-modal" onClick={(e) => e.stopPropagation()}>
          <h2>Edit Document</h2>
          <input type="text" 
                  placeholder="New Title" 
                  id="newTitle" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  />
          <input type="text" 
                 placeholder="New Author" 
                 id="newAuthor" 
                 value={newAuthor}
                 onChange={(e) => setNewAuthor(e.target.value)}
                 />
              <div className="edit-document-buttons">
                 <button onClick={onClose}>Cancel</button>
                 <button onClick={saveChanges}>Save</button>
              </div>
        </div>
      </div>,
      document.body
    );

  }


  
