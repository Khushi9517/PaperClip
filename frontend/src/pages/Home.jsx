import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiCheckSquare, FiCalendar, FiPlus } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { getNotes, getTasks, getEvents } from '../services/api';
import './Home.css';
import Spinner from '../components/common/Spinner';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const now = new Date();
        const [notesRes, tasksRes, eventsRes] = await Promise.all([
          getNotes(),
          getTasks(),
          getEvents({
            month: now.getMonth() + 1,
            year: now.getFullYear()
          }),
        ]);
        setNotes(notesRes.data);
        setTasks(tasksRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Derived data — calculated from state
  const pinnedNotes = notes.filter(n => n.isPinned).slice(0, 3);
  const recentNotes = notes.filter(n => !n.isPinned).slice(0, 3);
  const todayStr = new Date().toDateString();
  const todayTasks = tasks.filter(t =>
    t.dueDate && new Date(t.dueDate).toDateString() === todayStr
  );
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .slice(0, 3);

    const stats = [
    {
      icon: <FiBookOpen />,
      label: 'Total Notes',
      value: notes.length,
      sub: `${pinnedNotes.length} pinned`,
      color: 'stat-gold',
      path: '/notes',
    },
    {
      icon: <FiCheckSquare />,
      label: 'Pending Tasks',
      value: pendingTasks.length,
      sub: `${completedTasks.length} completed`,
      color: 'stat-green',
      path: '/tasks',
    },
    {
      icon: <FiCalendar />,
      label: 'Upcoming Events',
      value: upcomingEvents.length,
      sub: 'this month',
      color: 'stat-brown',
      path: '/calendar',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading your journal...</div>
      </Layout>
    );
  }

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good Morning' :
    greetingHour < 17 ? 'Good Afternoon' :
    'Good Evening';

    return (
    <Layout>
      <div className="home">

        {/* Welcome Banner */}
        <div className="home-banner">
          <div className="banner-text">
            <p className="banner-greeting">{greeting},</p>
            <h1 className="banner-name">{user?.name} ✦</h1>
            <p className="banner-quote">
              "A place for every thought, and every thought in its place."
            </p>
          </div>
          <div className="banner-decoration">📜</div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`stat-card ${stat.color}`}
              onClick={() => navigate(stat.path)}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                <span className="stat-sub">{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="home-grid">

          {/* Pinned Notes */}
          <section className="home-section">
            <div className="section-header">
              <h3 className="section-title">📌 Pinned Notes</h3>
              <button className="btn btn-outline section-btn"
                onClick={() => navigate('/notes')}>
                View All
              </button>
            </div>
            {pinnedNotes.length === 0 ? (
              <div className="empty-state">
                <p>No pinned notes yet.</p>
                <button className="btn btn-primary"
                  onClick={() => navigate('/notes')}>
                  <FiPlus /> New Note
                </button>
              </div>
            ) : (
              <div className="mini-notes-grid">
                {pinnedNotes.map(note => (
                  <div key={note._id} className="mini-note-card"
                    onClick={() => navigate('/notes')}>
                    <h4 className="mini-note-title">{note.title}</h4>
                    <p className="mini-note-content">
                      {note.content?.slice(0, 80)}
                      {note.content?.length > 80 ? '...' : ''}
                    </p>
                    <div className="mini-note-tags">
                      {note.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Today's Tasks */}
          <section className="home-section">
            <div className="section-header">
              <h3 className="section-title">✅ Today's Tasks</h3>
              <button className="btn btn-outline section-btn"
                onClick={() => navigate('/tasks')}>
                View All
              </button>
            </div>
            {todayTasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks due today.</p>
                <button className="btn btn-primary"
                  onClick={() => navigate('/tasks')}>
                  <FiPlus /> Add Task
                </button>
              </div>
            ) : (
              <div className="mini-tasks-list">
                {todayTasks.map(task => (
                  <div key={task._id}
                    className={`mini-task-item ${task.isCompleted ? 'completed' : ''}`}>
                    <span className="mini-task-check">
                      {task.isCompleted ? '✓' : '○'}
                    </span>
                    <span className="mini-task-title">{task.title}</span>
                    <span className={`mini-task-priority priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Notes */}
          <section className="home-section">
            <div className="section-header">
              <h3 className="section-title">🗒️ Recent Notes</h3>
              <button className="btn btn-outline section-btn"
                onClick={() => navigate('/notes')}>
                View All
              </button>
            </div>
            {recentNotes.length === 0 ? (
              <div className="empty-state">
                <p>No notes yet. Start writing!</p>
              </div>
            ) : (
              <div className="mini-notes-grid">
                {recentNotes.map(note => (
                  <div key={note._id} className="mini-note-card"
                    onClick={() => navigate('/notes')}>
                    <h4 className="mini-note-title">{note.title}</h4>
                    <p className="mini-note-content">
                      {note.content?.slice(0, 80)}
                      {note.content?.length > 80 ? '...' : ''}
                    </p>
                    <p className="mini-note-date">
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Upcoming Events */}
          <section className="home-section">
            <div className="section-header">
              <h3 className="section-title">🗓️ Upcoming Events</h3>
              <button className="btn btn-outline section-btn"
                onClick={() => navigate('/calendar')}>
                View All
              </button>
            </div>
            {upcomingEvents.length === 0 ? (
              <div className="empty-state">
                <p>No upcoming events.</p>
                <button className="btn btn-primary"
                  onClick={() => navigate('/calendar')}>
                  <FiPlus /> Add Event
                </button>
              </div>
            ) : (
              <div className="mini-events-list">
                {upcomingEvents.map(event => (
                  <div key={event._id} className="mini-event-item"
                    style={{ borderLeftColor: event.color }}>
                    <div className="mini-event-date">
                      <span className="event-day">
                        {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
                      </span>
                      <span className="event-month">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="mini-event-info">
                      <p className="mini-event-title">{event.title}</p>
                      {event.isPinned && <span className="tag">📌 pinned</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default Home;