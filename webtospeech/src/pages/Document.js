import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Pause, Play, Volume2, Bookmark, Type, Palette, X } from 'lucide-react';
import { createClient } from "@supabase/supabase-js";
import { useSpeech } from '../hooks/UseSpeech';
import { usePagination} from '../hooks/UsePagination';
import SpeechHighlight from '../components/SpeechHighlight';
import './Document.css';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

function Document() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  console.log(title);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mainContentRef = useRef(null);

  // UI state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('sepia');

  // Pagination
  const { currentPage, totalPages, pageContent, goToNext, goToPrev } = usePagination(content, mainContentRef);

  // Speech — hook takes over all TTS concerns
  const {
    isPlaying,
    speed,
    volume,
    highlightIndex,
    handlePlayPause,
    handleSpeedChange,
    handleVolumeChange,
  } = useSpeech(pageContent);

  const themes = {
    sepia: { bg: '#f5f1e8', text: '#2c2416' },
    white: { bg: '#ffffff', text: '#000000' },
    dark:  { bg: '#1a1a1a', text: '#e0e0e0' },
  };

  useEffect(() => {
    const loadDocument = async () => {
      try {
        //get doc info from the DB
        const { data, error } = await supabase
          .from('books')
          .select('title, file_url')
          .eq('id', id)
          .single();

        if (error) {
          setError("Could not load document");
          setLoading(false);
          console.log(error);
          return;
        }

        setTitle(data.title);
        
        //fetch the file from the bucket using the URL 
        const { data: fileData, error: fileError } = await supabase.storage
          .from('user-books')
          .download(data.file_url);

        if (fileError) throw new Error("Failed to fetch document content");

        setContent(await fileData.text());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  // Left & Right Arrow Page Handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft')  goToPrev();
  };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  if (loading) return <div className="loading">Loading document...</div>;
  if (error)   return <div className="error">{error}</div>;

  const currentTheme = themes[theme];

  return (
    <div className="ereader-container" style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      {/* Header */}
      <header className="header">
        <button className="back-button" aria-label="Go back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={32} strokeWidth={3} />
        </button>
        <h1 className="app-title">WebToSpeech</h1>
      </header>

      {/* Document Content */}
      <main className="main-content" ref={mainContentRef}>
        <div className="document-container">
          <SpeechHighlight
            content={pageContent}
            highlightIndex={highlightIndex}
            fontSize={fontSize}
          />
        </div>
      </main>

      {/* Pagination Controls */}
        <div className="pagination-controls">
          <button className="page-button" onClick={goToPrev} disabled={currentPage === 0}>
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
            <span className="page-indicator">{currentPage + 1} / {totalPages}</span>
              <button className="page-button" onClick={goToNext} disabled={currentPage === totalPages - 1}>
                <ArrowRight size={24} strokeWidth={3} />
              </button>
        </div>

      {/* Controls Bar */}
      <footer className="controls-bar">
        <div className="controls-container">
          <button onClick={handlePlayPause} className="play-button" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying
              ? <Pause size={40} fill="white" strokeWidth={0} />
              : <Play  size={40} fill="white" strokeWidth={0} />
            }
          </button>

          <div className="speed-control">
            <span className="speed-label">0.5x</span>
            <input
              type="range"
              className="slider"
              min="0.5" max="2" step="0.25"
              value={speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              aria-label="Speed control"
              style={{ width: '96px' }}
            />
            <span className="speed-label">2x</span>
          </div>

          <div className="volume-control">
            <Volume2 size={24} className="volume-icon" />
            <input
              type="range"
              className="slider"
              min="0" max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              aria-label="Volume control"
            />
          </div>

          <div className="right-controls">
            <button onClick={() => setShowThemeDialog(true)} className="icon-button theme-button" aria-label="Change theme">
              <Palette size={24} />
            </button>
            <button onClick={() => setShowFontDialog(true)} className="icon-button" aria-label="Font settings">
              <Type size={24} />
            </button>
            <button onClick={() => setIsBookmarked(!isBookmarked)} className="bookmark-button" aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
              <Bookmark size={40} fill={isBookmarked ? 'white' : 'none'} strokeWidth={2} />
            </button>
          </div>
        </div>
      </footer>

      {/* Font Dialog */}
      {showFontDialog && (
        <div className="dialog-overlay" onClick={() => setShowFontDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <button className="dialog-close" onClick={() => setShowFontDialog(false)} style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <X size={24} />
            </button>
            <h2 className="dialog-title">Font Settings</h2>
            <div className="settings-section">
              <label className="settings-label">Font Size: {fontSize}px</label>
              <input
                type="range"
                className="slider"
                min="12" max="24" step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                style={{ width: '100%', background: '#9b1c1c' }}
              />
              <p className="preview-text" style={{ fontSize: `${fontSize}px`, marginTop: '16px' }}>
                Preview: The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Theme Dialog */}
      {showThemeDialog && (
        <div className="dialog-overlay" onClick={() => setShowThemeDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <button className="dialog-close" onClick={() => setShowThemeDialog(false)} style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <X size={24} />
            </button>
            <h2 className="dialog-title">Reading Theme</h2>
            <div className="theme-grid">
              {Object.entries(themes).map(([key, val]) => (
                <div
                  key={key}
                  className={`theme-option ${theme === key ? 'active' : ''}`}
                  onClick={() => { setTheme(key); setShowThemeDialog(false); }}
                >
                  <div className="theme-preview" style={{ backgroundColor: val.bg }} />
                  <span className="theme-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Document;