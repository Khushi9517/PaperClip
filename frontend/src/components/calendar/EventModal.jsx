import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import '../notes/NoteModal.css';
import './EventModal.css';

const COLORS = [
  '#b5a48b', '#c9a84c', '#8b6914',
  '#7a9e7e', '#4a7c59', '#8b4a4a',
  '#6b7fa3', '#9b7db3', '#c47a5a',
];

const EventModal = ({ isOpen, onClose, onSave, editingEvent, defaultDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setColor(editingEvent.color || COLORS[0]);
      setDate(new Date(editingEvent.date).toISOString().split('T')[0]);
    } else {
      setTitle('');
      setDescription('');
      setColor(COLORS[0]);
      // Pre-fill with the selected date
      if (defaultDate) {
        setDate(defaultDate.toISOString().split('T')[0]);
      }
    }
  }, [editingEvent, isOpen, defaultDate]);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setColor(editingEvent.color || COLORS[0]);
      setDate(new Date(editingEvent.date).toISOString().split('T')[0]);
    } else {
      setTitle('');
      setDescription('');
      setColor(COLORS[0]);
      // Pre-fill with the selected date
      if (defaultDate) {
        setDate(defaultDate.toISOString().split('T')[0]);
      }
    }
  }, [editingEvent, isOpen, defaultDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setLoading(true);
    try {
      await onSave({ title: title.trim(), description, date, color });
      onClose();
    } catch (err) {
      console.error('Save event error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h3 className="modal-title">
            {editingEvent ? 'Edit Event' : 'New Event'}
          </h3>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="input"
              placeholder="What's happening?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="input"
              placeholder="Add details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          {/* Color picker */}
          <div className="form-group">
            <label className="form-label">Event Color</label>
            <div className="color-picker">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !title.trim() || !date}
            >
              {loading ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Event'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EventModal;