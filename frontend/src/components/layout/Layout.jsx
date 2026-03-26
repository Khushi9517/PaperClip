import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="layout-main">
        <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;