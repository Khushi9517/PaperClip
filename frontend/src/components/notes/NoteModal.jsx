import { useState, useEffect } from 'react';
import { FiX, FiTag, FiPlus } from 'react-icons/fi';
import './NoteModal.css';

const NoteModal = ({ isOpen, onClose, onSave, editingNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  // When editing, pre-fill the form with existing note data
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content || '');
      setTags(editingNote.tags || []);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
    setTagInput('');
  }, [editingNote, isOpen]);

  const handleAddTag = (e) => {
    // Add tag when user presses Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/,/g, '');
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSave({ title: title.trim(), content, tags });
      onClose();
    } catch (err) {
      console.error('Save note error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {editingNote ? 'Edit Note' : 'New Note'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="input"
              placeholder="Note title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="input"
              placeholder="Write your thoughts here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={7}
            />
          </div>

          {/* Tags input */}
          <div className="form-group">
            <label className="form-label">
              <FiTag style={{ marginRight: '0.3rem' }} />
              Tags — press Enter or comma to add
            </label>
            <div className="tags-input-container">
              {tags.map(tag => (
                <span key={tag} className="tag tag-removable">
                  {tag}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <FiX size={10} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="tags-input"
                placeholder={tags.length === 0 ? 'work, personal...' : ''}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !title.trim()}
            >
              {loading ? 'Saving...' : editingNote ? 'Save Changes' : 'Create Note'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NoteModal;
