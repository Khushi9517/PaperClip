import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import './Navbar.css';

const pageTitles = {
  '/':         'Dashboard',
  '/notes':    'My Notes',
  '/tasks':    'Daily Tasks',
  '/calendar': 'Calendar',
};

const Navbar = ({ onMenuClick, onSearch }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();

const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const currentTitle = pageTitles[location.pathname] || 'PaperClip';

  return (
    <header className="navbar">

      {/* Left side */}
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuClick}>
          <FiMenu />
        </button>
        <div className="navbar-title">
          <h2>{currentTitle}</h2>
          <span className="navbar-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="navbar-right">
        {searchOpen ? (
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="input navbar-search-input"
              placeholder="Search notes..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="navbar-icon-btn"
              onClick={() => { setSearchOpen(false); setSearchValue(''); }}
            >
              <FiX />
            </button>
          </form>
        ) : (
          <button
            className="navbar-icon-btn"
            onClick={() => setSearchOpen(true)}
          >
            <FiSearch />
          </button>
        )}
      </div>

    </header>
  );
};

export default Navbar;