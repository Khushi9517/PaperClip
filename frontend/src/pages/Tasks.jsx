import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import TaskItem from '../components/tasks/TaskItem';
import TaskModal from '../components/tasks/TaskModal';
import {
  getTasks, createTask, updateTask,
  deleteTask, toggleTask
} from '../services/api';
import './Tasks.css';
import Spinner from '../components/common/Spinner';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save (create or update)
  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      const res = await updateTask(editingTask._id, taskData);
      setTasks(tasks.map(t =>
        t._id === editingTask._id ? res.data : t
      ));
    } else {
      const res = await createTask(taskData);
      setTasks([res.data, ...tasks]);
    }
    setEditingTask(null);
  };

  // Toggle completion
  const handleToggle = async (taskId) => {
    try {
      const res = await toggleTask(taskId);
      setTasks(tasks.map(t =>
        t._id === taskId ? res.data : t
      ));
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // Delete
  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Edit
  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Filter and sort logic
  const filteredTasks = tasks
    .filter(t => {
      if (filterStatus === 'pending') return !t.isCompleted;
      if (filterStatus === 'completed') return t.isCompleted;
      return true;
    })
    .filter(t => {
      if (filterPriority !== 'all') return t.priority === filterPriority;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      // Default: newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Stats
  const totalTasks = tasks.length;
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const pendingCount = tasks.filter(t => !t.isCompleted).length;
  const highPriorityCount = tasks.filter(t =>
    t.priority === 'high' && !t.isCompleted
  ).length;

  // Progress percentage
  const progressPercent = totalTasks === 0
    ? 0
    : Math.round((completedCount / totalTasks) * 100);

    return (
    <Layout>
      <div className="tasks-page">

        {/* Header */}
        <div className="tasks-header">
          <div>
            <h2 className="tasks-heading">Daily Tasks</h2>
            <span className="tasks-count">
              {pendingCount} remaining · {completedCount} done
            </span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setEditingTask(null); setModalOpen(true); }}
          >
            <FiPlus /> New Task
          </button>
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className="tasks-progress">
            <div className="progress-info">
              <span className="progress-label">Today's Progress</span>
              <span className="progress-percent">{progressPercent}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="tasks-stats">
          <div className="task-stat-card">
            <span className="task-stat-value">{totalTasks}</span>
            <span className="task-stat-label">Total</span>
          </div>
          <div className="task-stat-card">
            <span className="task-stat-value pending">{pendingCount}</span>
            <span className="task-stat-label">Pending</span>
          </div>
          <div className="task-stat-card">
            <span className="task-stat-value done">{completedCount}</span>
            <span className="task-stat-label">Completed</span>
          </div>
          <div className="task-stat-card">
            <span className="task-stat-value high">{highPriorityCount}</span>
            <span className="task-stat-label">High Priority</span>
          </div>
        </div>

        {/* Filters */}
        <div className="tasks-filters">
          <div className="filter-group">
            <span className="filter-label">Status:</span>
            {['all', 'pending', 'completed'].map(s => (
              <button
                key={s}
                className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <span className="filter-label">Priority:</span>
            {['all', 'high', 'medium', 'low'].map(p => (
              <button
                key={p}
                className={`filter-btn ${filterPriority === p ? 'active' : ''} ${p !== 'all' ? `priority-filter-${p}` : ''}`}
                onClick={() => setFilterPriority(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <span className="filter-label">Sort:</span>
            <select
              className="input filter-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="createdAt">Newest First</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <Spinner text="Loading tasks..." />
        ) : filteredTasks.length === 0 ? (
          <div className="tasks-empty">
            <p className="tasks-empty-icon">✅</p>
            <h3>
              {filterStatus === 'completed'
                ? 'No completed tasks yet'
                : filterStatus === 'pending'
                ? 'No pending tasks!'
                : 'No tasks yet'}
            </h3>
            <p>
              {filterStatus === 'all'
                ? 'Click "New Task" to add your first task'
                : 'Try changing your filters'}
            </p>
          </div>
        ) : (
          <div className="tasks-list">
            {filteredTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <TaskModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
          onSave={handleSaveTask}
          editingTask={editingTask}
        />

      </div>
    </Layout>
  );
};

export default Tasks;