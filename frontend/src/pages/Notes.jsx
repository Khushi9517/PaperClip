import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import NoteCard from '../components/notes/NoteCard';
import NoteModal from '../components/notes/NoteModal';
import {
  getNotes, createNote, updateNote,
  deleteNote, searchNotes
} from '../services/api';
import './Notes.css';
import Spinner from '../components/common/Spinner';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [activeTag, setActiveTag] = useState('');

  // Load all notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch (err) {
      console.error('Fetch notes error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await searchNotes(searchQuery);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setActiveTag('');
  };

  // Create or update note
  const handleSaveNote = async (noteData) => {
    if (editingNote) {
      const res = await updateNote(editingNote._id, noteData);
      setNotes(notes.map(n =>
        n._id === editingNote._id ? res.data : n
      ));
    } else {
      const res = await createNote(noteData);
      setNotes([res.data, ...notes]);
    }
    setEditingNote(null);
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(noteId);
      setNotes(notes.filter(n => n._id !== noteId));
      if (searchResults) {
        setSearchResults(searchResults.filter(n => n._id !== noteId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Toggle pin
  const handleTogglePin = async (note) => {
    try {
      const res = await updateNote(note._id, { isPinned: !note.isPinned });
      setNotes(notes.map(n =>
        n._id === note._id ? res.data : n
      ));
    } catch (err) {
      console.error('Pin error:', err);
    }
  };

  // Open modal for editing
  const handleEditNote = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  // Open modal for new note
  const handleNewNote = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  // Filter notes by tag
  const allTags = [...new Set(notes.flatMap(n => n.tags || []))];

  const displayedNotes = (() => {
    let list = searchResults !== null ? searchResults : notes;
    if (activeTag) {
      list = list.filter(n => n.tags?.includes(activeTag));
    }
    return list;
  })();

  const pinnedNotes = displayedNotes.filter(n => n.isPinned);
  const unpinnedNotes = displayedNotes.filter(n => !n.isPinned);

  return (
    <Layout>
      <div className="notes-page">

        {/* Page Header */}
        <div className="notes-header">
          <div className="notes-header-left">
            <h2 className="notes-heading">My Notes</h2>
            <span className="notes-count">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>
          <button className="btn btn-primary" onClick={handleNewNote}>
            <FiPlus /> New Note
          </button>
        </div>

        {/* Search Bar */}
        <form className="notes-search" onSubmit={handleSearch}>
          <div className="search-input-wrap">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="input search-input"
              placeholder="Search notes by title, content or tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {(searchQuery || searchResults !== null) && (
              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
              >
                <FiX />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-outline">Search</button>
        </form>

        {/* Tag Filter Bar */}
        {allTags.length > 0 && (
          <div className="tag-filter-bar">
            <span className="tag-filter-label">Filter:</span>
            <button
              className={`tag-filter-btn ${activeTag === '' ? 'active' : ''}`}
              onClick={() => setActiveTag('')}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-filter-btn ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Notes Content */}
        {loading ? (
          <Spinner text="Loading Notes..." />
        ) : displayedNotes.length === 0 ? (
          <div className="notes-empty">
            <p className="notes-empty-icon">🗒️</p>
            <h3>No notes found</h3>
            <p>
              {searchResults !== null
                ? 'Try a different search term'
                : 'Click "New Note" to write your first note'}
            </p>
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedNotes.length > 0 && (
              <div className="notes-section">
                <h4 className="notes-section-label">📌 Pinned</h4>
                <div className="notes-grid">
                  {pinnedNotes.map(note => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteNote}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Notes Section */}
            {unpinnedNotes.length > 0 && (
              <div className="notes-section">
                {pinnedNotes.length > 0 && (
                  <h4 className="notes-section-label">🗒️ All Notes</h4>
                )}
                <div className="notes-grid">
                  {unpinnedNotes.map(note => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteNote}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Note Modal */}
        <NoteModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingNote(null); }}
          onSave={handleSaveNote}
          editingNote={editingNote}
        />

      </div>
    </Layout>
  );
};

export default Notes;