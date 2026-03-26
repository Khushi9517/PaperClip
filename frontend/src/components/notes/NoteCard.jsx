import { FiEdit2, FiTrash2, FiBookmark } from 'react-icons/fi';
import './NoteCard.css';

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`note-card ${note.isPinned ? 'pinned' : ''}`}>

      {/* Pin badge */}
      {note.isPinned && (
        <div className="pin-badge">📌 Pinned</div>
      )}

      {/* Body */}
      <div className="note-card-body" onClick={() => onEdit(note)}>
        <h3 className="note-card-title">{note.title}</h3>
        {note.content && (
          <p className="note-card-content">
            {note.content.slice(0, 120)}
            {note.content.length > 120 ? '...' : ''}
          </p>
        )}
        {note.tags?.length > 0 && (
          <div className="note-card-tags">
            {note.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        <p className="note-card-date">{formattedDate}</p>
      </div>

      {/* Actions */}
      <div className="note-card-actions">
        <button
          className={`note-action-btn ${note.isPinned ? 'active' : ''}`}
          onClick={() => onTogglePin(note)}
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          <FiBookmark />
        </button>
        <button
          className="note-action-btn"
          onClick={() => onEdit(note)}
          title="Edit"
        >
          <FiEdit2 />
        </button>
        <button
          className="note-action-btn danger"
          onClick={() => onDelete(note._id)}
          title="Delete"
        >
          <FiTrash2 />
        </button>
      </div>

    </div>
  );
};

export default NoteCard;