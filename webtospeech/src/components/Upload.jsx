import { createClient } from "@supabase/supabase-js";
import {useState, useEffect} from 'react';

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
const [selectedGenreIds, setSelectedGenreIds] = useState([]);  // ← array of IDs
const [allGenres, setAllGenres] = useState([]);                 // ← fetched from DB

    // Fetch genres from Supabase when modal opens
    useEffect(() => {
        async function loadGenres() {
            const { data } = await supabase
                .from('genres')
                .select('*')
                .order('name');
            if (data) setAllGenres(data);
        }
        loadGenres();
    }, []);

    function toggleGenre(genreId) {
        setSelectedGenreIds(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)   // deselect
                : [...prev, genreId]                   // select
        );
    }

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

    const { data: { user} } = await supabase.auth.getUser();
    if (!user) {
        alert("You must be logged in to upload a book.");
        return;
    }

    setStatus(UploadStatus.UPLOADING);

    //Creates unique file path
    const fileName = `${user.id}/${file.name}`;

    

    try {
        //uploads file to the storage
        const { data: storageData, error: uploadError } = await supabase.storage
            .from('user-books')
            .upload(fileName, file);
        
        if (uploadError) throw uploadError;

        const { data: book,error: dbError } = await supabase
                    .from('books')
                    .insert([{
                        title,
                        author,
                        cover_url: null,
                        file_url: fileName,
                        uploaded_by: user.id,
                        is_community: false
                    }]).select().single();

                    console.log("DB Insert Result:", { storageData, dbError });

                if (dbError) throw dbError;
                if (!book) throw new Error("Book insert returned no data");  // safety check

                //Linking genres ro books
                if(selectedGenreIds.length > 0){
                    const { error: genreLinkError } = await supabase
                        .from('book_genres')
                        .insert(
                            selectedGenreIds.map(genre_id => ({
                                book_id: book.id,
                                genre_id: genre_id
                            }))
                        );
                    if (genreLinkError) throw genreLinkError;
                }


            setStatus(UploadStatus.SUCCESS);

            // Auto close the modal after 1.5 seconds on success
            setTimeout(() => onClose(), 1500);
    } catch (err) {
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

                    {/* Genre toggle buttons instead of a text field */}
                    <div className="genre-picker">
                        <p>Genres:</p>
                        {allGenres.map(g => (
                            <button
                                key={g.id}
                                type="button"
                                className={selectedGenreIds.includes(g.id) ? 'genre-tag active' : 'genre-tag'}
                                onClick={() => toggleGenre(g.id)}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>

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