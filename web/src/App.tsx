import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native-web';
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

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚢 Harbour</Text>
        <Text style={styles.subtitle}>Your personal bookmark manager</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Add New Bookmark</Text>
        
        <form onSubmit={handleSubmit}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL *</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="https://example.com"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title (optional)</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Optional title for the bookmark"
              placeholderTextColor="#999"
            />
          </View>

          <button 
            type="submit" 
            disabled={loading || !url.trim()}
            style={{
              ...styles.button,
              opacity: loading || !url.trim() ? 0.6 : 1,
            }}
          >
            {loading ? 'Saving...' : 'Save Bookmark'}
          </button>
        </form>

        {message && (
          <Text style={[
            styles.message,
            message.includes('Error') || message.includes('Failed') ? styles.errorMessage : styles.successMessage
          ]}>
            {message}
          </Text>
        )}
      </View>

      <View style={styles.bookmarksList}>
        <Text style={styles.sectionTitle}>Recent Bookmarks</Text>
        {bookmarks.length === 0 ? (
          <Text style={styles.emptyState}>
            No bookmarks yet. Add your first bookmark above!
          </Text>
        ) : (
          bookmarks.map((bookmark, index) => (
            <View key={index} style={styles.bookmarkItem}>
              <Text style={styles.bookmarkTitle}>{bookmark.title}</Text>
              <Text style={styles.bookmarkUrl}>{bookmark.url}</Text>
              {bookmark.created_at && (
                <Text style={styles.bookmarkDate}>
                  {new Date(bookmark.created_at).toLocaleDateString()}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  form: {
    backgroundColor: 'white',
    margin: 24,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1f2937',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    border: 'none',
    fontSize: 16,
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
  },
  message: {
    marginTop: 12,
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderColor: '#10b981',
    borderWidth: 1,
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  bookmarksList: {
    margin: 24,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyState: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    fontStyle: 'italic',
    padding: 32,
  },
  bookmarkItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  bookmarkUrl: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 4,
  },
  bookmarkDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default App;
