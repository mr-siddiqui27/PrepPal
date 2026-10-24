import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MainLayout.css';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Landing page has its own clean public layout (Navbar + Footer, no internal sidebar/search header)
  if (location.pathname === '/') {
    return (
      <div className="landing-layout" id="landing-layout-root">
        <Navbar />
        <main className="landing-layout-main" id="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  // Dedicated clean viewport for login and signup screens
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <div className="auth-layout">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="app-shell" id="app-shell-root">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(prev => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="app-main-viewport">
        <TopHeader onToggleMobileSidebar={() => setMobileOpen(prev => !prev)} />
        <main className="app-page-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
