import { FiEdit2, FiTrash2, FiBookmark } from 'react-icons/fi';
import './EventList.css';

const EventList = ({ events, onEdit, onDelete, onTogglePin }) => {
  if (events.length === 0) {
    return (
      <div className="event-list-empty">
        <p>📅</p>
        <p>No events on this day</p>
        <p className="event-list-empty-sub">
          Click the + button to add one
        </p>
      </div>
    );
  }

  return (
    <div className="event-list">
      {events.map(event => (
        <div
          key={event._id}
          className={`event-list-item ${event.isPinned ? 'pinned' : ''}`}
          style={{ borderLeftColor: event.color }}
        >
          {/* Color dot */}
          <div
            className="event-color-dot"
            style={{ backgroundColor: event.color }}
          />

          {/* Content */}
          <div className="event-list-content">
            <div className="event-list-top">
              <h4 className="event-list-title">{event.title}</h4>
              {event.isPinned && (
                <span className="event-pin-badge">📌</span>
              )}
            </div>
            {event.description && (
              <p className="event-list-desc">{event.description}</p>
            )}
            {event.tasks?.length > 0 && (
              <p className="event-list-tasks">
                🗒️ {event.tasks.length} linked task{event.tasks.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="event-list-actions">
            <button
              className={`event-action-btn ${event.isPinned ? 'active' : ''}`}
              onClick={() => onTogglePin(event)}
              title={event.isPinned ? 'Unpin' : 'Pin'}
            >
              <FiBookmark size={13} />
            </button>
            <button
              className="event-action-btn"
              onClick={() => onEdit(event)}
              title="Edit"
            >
              <FiEdit2 size={13} />
            </button>
            <button
              className="event-action-btn danger"
              onClick={() => onDelete(event._id)}
              title="Delete"
            >
              <FiTrash2 size={13} />
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default EventList;
