import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiBookOpen, FiCheckSquare,
  FiCalendar, FiX, FiFeather
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    { path: '/',         icon: <FiHome />,        label: 'Home'     },
    { path: '/notes',    icon: <FiBookOpen />,     label: 'Notes'    },
    { path: '/tasks',    icon: <FiCheckSquare />,  label: 'Tasks'    },
    { path: '/calendar', icon: <FiCalendar />,     label: 'Calendar' },
  ];

  return (
    <>
      {/* Overlay — clicking it closes sidebar on mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <FiFeather className="logo-icon" />
          <span className="logo-text">PaperClip</span>
          <button className="sidebar-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <hr className="divider" />

        {/* User info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        <hr className="divider" />

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <hr className="divider" />

        {/* Bottom actions */}
        <div className="sidebar-footer">
          <button className="nav-item theme-toggle" onClick={toggleTheme}>
            <span className="nav-icon">{isDark ? '☀️' : '🕯️'}</span>
            <span className="nav-label">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;

