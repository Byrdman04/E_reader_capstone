import { createClient } from "@supabase/supabase-js";
import {useState} from 'react';

//Conststant Status Strings that will be tied to the upload process.
const UploadStatus = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    SUCCESS: 'success',
    ERROR: 'error'
};

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);


export default function Upload({onClose}) {

//This useState is where the file will be stored and located
const[file, setFile] = useState(null);
//How we are tieing the status to the upload process
const[status, setStatus] = useState(UploadStatus.IDLE);

const [title, setTitle] = useState('');
const [author, setAuthor] = useState('');
const [genre, setGenre] = useState('');

//This function stores the 1 and only file that is chosen by the 
//user and sets it to the file useState variable.
//NOTE: This is important because it is how we store and access the file.
function handleFileChange(e) {
    if(e.target.files){
        setFile(e.target.files[0]);
    }
}

async function handleFileUpload(){
    if (!file) return;

    setStatus(UploadStatus.UPLOADING);

    //Creates unique file path
    const fileName = `${Date.now()}_${file.name}`;

    

    try {
        //uploads file to the storage
        const { data, error } = await supabase.storage.from('books').upload(fileName, file);
        

        const { error: dbError } = await supabase
                    .from('books')
                    .insert({
                        title: title,
                        author: author,
                        genre: genre,
                        file_path: fileName
                    });

                if (dbError) throw dbError;

            setStatus(UploadStatus.SUCCESS);

            // Auto close the modal after 1.5 seconds on success
            setTimeout(() => onClose(), 1500);
    } catch {
        console.error("Upload Failed:", err);
        setStatus(UploadStatus.ERROR)
    };
}

    return (
        // Dark overlay behind the modal
        <div className="modal-overlay" onClick={onClose}>

            {/* stopPropagation prevents clicks INSIDE the modal from closing it */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Upload a Book</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileChange}
                    />

                    {/* Show selected filename */}
                    {file && <p>Selected: {file.name}</p>}
                </div>

                <div className="modal-footer">
                    <button onClick={onClose}>Cancel</button>
                    <button
                        onClick={handleFileUpload}
                        disabled={
                            status === UploadStatus.UPLOADING ||
                            !file ||
                            !title
                        }
                    >
                        {status === UploadStatus.UPLOADING ? 'Uploading...' : 'Upload'}
                    </button>
                </div>

                {/* Status messages */}
                {status === UploadStatus.SUCCESS && <p>Book uploaded!</p>}
                {status === UploadStatus.ERROR && <p>Upload failed. Try again.</p>}
            </div>
        </div>
    );
}