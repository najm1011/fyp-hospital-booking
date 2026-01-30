import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Pages where footer should be shown (public pages)
  const showFooter = !isAuthenticated || location.pathname === '/';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Sidebar - only show when authenticated */}
      {isAuthenticated && (
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      )}

      {/* Main content */}
      <main
        id="main-content"
        className={`
          pt-16 flex-1 transition-all duration-300
          ${isAuthenticated ? 'lg:pl-64' : ''}
        `}
      >
        <div key={location.pathname} className="p-4 sm:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Footer - show on public pages */}
      {showFooter && (
        <div className={isAuthenticated ? 'lg:pl-64' : ''}>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
