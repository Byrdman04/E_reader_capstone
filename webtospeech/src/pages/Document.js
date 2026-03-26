import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pause, Play, Volume2, Bookmark, Type, Palette, X } from 'lucide-react';
import './Document.css';

function Document() {
  //Nav Init
    const navigate = useNavigate();


    const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(75);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('sepia');

  const themes = {
    sepia: { bg: '#f5f1e8', text: '#2c2416' },
    white: { bg: '#ffffff', text: '#000000' },
    dark: { bg: '#1a1a1a', text: '#e0e0e0' },
}

const sampleText = `Chapter 1: The Beginning

In the heart of a bustling city, where ancient architecture met modern innovation, there lived a woman named Elena who had dedicated her life to uncovering forgotten stories.

Her small apartment, tucked away on the third floor of a building that had witnessed a century of change, was filled with books, manuscripts, and artifacts from different eras. Each object held a story, and Elena believed that every story deserved to be told.

One rainy autumn evening, as the city lights reflected off the wet cobblestones below, Elena received a mysterious package. There was no return address, only her name written in elegant calligraphy on the brown paper wrapping.

Inside, she found an old leather-bound journal, its pages yellowed with age but remarkably well-preserved. The first entry was dated 1847, and as Elena began to read, she realized this was no ordinary diary—it was a chronicle of a secret society that had operated in the shadows of history.

The journal spoke of hidden chambers beneath the city, of codes and ciphers, of meetings held under the cover of darkness. It mentioned names she recognized from history books, but in contexts she had never imagined.

Elena's heart raced with excitement. This was the kind of discovery that historians dreamed about—a primary source that could rewrite what they thought they knew about the past.

But as she delved deeper into the journal's secrets, she began to notice something unsettling. Someone was watching her apartment. Strange figures lingered on the street corner below. Her phone would ring, but no one would speak when she answered.

The past, it seemed, was not content to remain buried. And those who had kept its secrets for nearly two centuries were not pleased that their story was being brought to light.

Elena knew she had a choice to make: return to the safety of her academic research, or follow the trail that this mysterious journal had laid before her—a trail that led into the unknown depths of the city, and perhaps into danger.

She chose to follow the story. After all, wasn't that what she had always done?`;

  const currentTheme = themes[theme];

  return (
    <div className="ereader-container" style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      {/* Header */}
      <header className="header">
        <button className="back-button" aria-label="Go back" onClick= {() => navigate('/dashboard')}>
          <ArrowLeft size={32} strokeWidth={3} />
        </button>
        <h1 className="app-title">WebToSpeech</h1>
      </header>

      {/* Document Content */}
      <main className="main-content">
        <div className="document-container">
          <div className="document-text" style={{ fontSize: `${fontSize}px` }}>
            {sampleText}
          </div>
        </div>
      </main>

      {/* Controls Bar */}
      <footer className="controls-bar">
        <div className="controls-container">
          {/* Play/Pause Button */}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="play-button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={40} fill="white" strokeWidth={0} />
            ) : (
              <Play size={40} fill="white" strokeWidth={0} />
            )}
          </button>

          {/* Speed Control */}
          <div className="speed-control">
            <span className="speed-label">0.5x</span>
            <input
              type="range"
              className="slider"
              min="0.5"
              max="2"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              aria-label="Speed control"
              style={{ width: '96px' }}
            />
            <span className="speed-label">2x</span>
          </div>

          {/* Volume Control */}
          <div className="volume-control">
            <Volume2 size={24} className="volume-icon" />
            <div className="slider-container">
              <input
                type="range"
                className="slider"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                aria-label="Volume control"
              />
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="right-controls">
            {/* Theme Button */}
            <button 
              onClick={() => setShowThemeDialog(true)}
              className="icon-button theme-button"
              aria-label="Change theme"
            >
              <Palette size={24} />
            </button>

            {/* Font Settings Button */}
            <button 
              onClick={() => setShowFontDialog(true)}
              className="icon-button"
              aria-label="Font settings"
            >
              <Type size={24} />
            </button>

            {/* Bookmark Button */}
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="bookmark-button"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark 
                size={40}
                fill={isBookmarked ? 'white' : 'none'} 
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </footer>

      {/* Font Settings Dialog */}
      {showFontDialog && (
        <div className="dialog-overlay" onClick={() => setShowFontDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="dialog-close" 
              onClick={() => setShowFontDialog(false)}
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <X size={24} />
            </button>
            <div className="dialog-header">
              <h2 className="dialog-title">Font Settings</h2>
            </div>
            <div className="settings-section">
              <label className="settings-label">Font Size: {fontSize}px</label>
              <input
                type="range"
                className="slider"
                min="12"
                max="24"
                step="1"
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
            <button 
              className="dialog-close" 
              onClick={() => setShowThemeDialog(false)}
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <X size={24} />
            </button>
            <div className="dialog-header">
              <h2 className="dialog-title">Reading Theme</h2>
            </div>
            <div className="theme-grid">
              <div
                className={`theme-option ${theme === 'sepia' ? 'active' : ''}`}
                onClick={() => {
                  setTheme('sepia');
                  setShowThemeDialog(false);
                }}
              >
                <div className="theme-preview" style={{ backgroundColor: '#f5f1e8' }}></div>
                <span className="theme-name">Sepia</span>
              </div>
              <div
                className={`theme-option ${theme === 'white' ? 'active' : ''}`}
                onClick={() => {
                  setTheme('white');
                  setShowThemeDialog(false);
                }}
              >
                <div className="theme-preview border" style={{ backgroundColor: '#ffffff' }}></div>
                <span className="theme-name">White</span>
              </div>
              <div
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => {
                  setTheme('dark');
                  setShowThemeDialog(false);
                }}
              >
                <div className="theme-preview" style={{ backgroundColor: '#1a1a1a' }}></div>
                <span className="theme-name">Dark</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Document;