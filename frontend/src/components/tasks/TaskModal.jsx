import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './TaskModal.css';
import '../notes/NoteModal.css';
import './TaskModal.css';

const TaskModal = ({ isOpen, onClose, onSave, editingTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setTags(editingTask.tags || []);
      // Format date for input — HTML date inputs need "YYYY-MM-DD" format
      if (editingTask.dueDate) {
        setDueDate(new Date(editingTask.dueDate).toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setTags([]);
    }
    setTagInput('');
  }, [editingTask, isOpen]);

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/,/g, '');
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        description,
        dueDate: dueDate || null,
        priority,
        tags,
      });
      onClose();
    } catch (err) {
      console.error('Save task error:', err);
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
            {editingTask ? 'Edit Task' : 'New Task'}
          </h3>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              className="input"
              placeholder="What needs to be done?"
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
              placeholder="Add more details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Due date + Priority row */}
          <div className="task-modal-row">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="input"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags — press Enter or comma</label>
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

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !title.trim()}
            >
              {loading ? 'Saving...' : editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskModal;