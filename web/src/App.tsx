import React, { useState } from 'react';
import './App.css';

interface Bookmark {
  key?: string;
  url: string;
  title: string;
  created_at?: string;
}

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const saveBookmark = async () => {
    if (!url.trim()) {
      setMessage('URL is required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/api/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          title: title.trim() || url.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Bookmark saved successfully!');
        setUrl('');
        setTitle('');
        // Add to local list for immediate feedback
        setBookmarks(prev => [{
          url: url.trim(),
          title: title.trim() || url.trim(),
          created_at: new Date().toISOString(),
        }, ...prev]);
      } else {
        setMessage(`Error: ${data.message || 'Failed to save bookmark'}`);
      }
    } catch (error) {
      setMessage('Failed to connect to server. Make sure the backend is running.');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBookmark();
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">🚢 Harbour</h1>
        <p className="subtitle">Your personal bookmark manager</p>
      </header>

      <div className="content">
        <div className="form">
        <h2 className="form-title">Add New Bookmark</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">URL *</label>
            <input
              type="url"
              className="input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Title (optional)</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional title for the bookmark"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !url.trim()}
            className="button"
            style={{
              opacity: loading || !url.trim() ? 0.6 : 1,
            }}
          >
            {loading ? 'Saving...' : 'Save Bookmark'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('Error') || message.includes('Failed') ? 'error-message' : 'success-message'}`}>
            {message}
          </div>
        )}
        </div>

        <div className="bookmarks-list">
        <h2 className="section-title">Recent Bookmarks</h2>
        {bookmarks.length === 0 ? (
          <p className="empty-state">
            No bookmarks yet. Add your first bookmark above!
          </p>
        ) : (
          <div className="bookmarks-grid">
            {bookmarks.map((bookmark, index) => (
              <div key={index} className="bookmark-item">
                <h3 className="bookmark-title">{bookmark.title}</h3>
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="bookmark-url">
                  {bookmark.url}
                </a>
                {bookmark.created_at && (
                  <p className="bookmark-date">
                    {new Date(bookmark.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}


export default App;
