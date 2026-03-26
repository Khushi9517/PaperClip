import { FiEdit2, FiTrash2, FiCalendar, FiTag } from 'react-icons/fi';
import { format, isPast, isToday } from 'date-fns';
import './TaskItem.css';

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {

  const getDueDateInfo = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    if (isToday(date)) return { label: 'Today', class: 'due-today' };
    if (isPast(date) && !task.isCompleted) return { label: format(date, 'MMM d'), class: 'due-overdue' };
    return { label: format(date, 'MMM d'), class: 'due-future' };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''} priority-border-${task.priority}`}>

      {/* Checkbox */}
      <button
        className={`task-checkbox ${task.isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(task._id)}
        title={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.isCompleted ? '✓' : ''}
      </button>

      {/* Content */}
      <div className="task-content">
        <p className="task-title">{task.title}</p>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          {dueDateInfo && (
            <span className={`task-due ${dueDateInfo.class}`}>
              <FiCalendar size={11} />
              {dueDateInfo.label}
            </span>
          )}
          <span className={`task-priority-badge priority-${task.priority}`}>
            {task.priority}
          </span>
          {task.tags?.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button
          className="task-action-btn"
          onClick={() => onEdit(task)}
          title="Edit"
        >
          <FiEdit2 size={14} />
        </button>
        <button
          className="task-action-btn danger"
          onClick={() => onDelete(task._id)}
          title="Delete"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

    </div>
  );
};

export default TaskItem;

