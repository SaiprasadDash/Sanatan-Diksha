'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrivateGuard from '@/components/shared/PrivateGuard';
import Header from '@/components/inc/header';
import Sidebar from '@/components/user/sidebar';

export default function UserLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userTyp = localStorage.getItem('user_typ');
    if (userTyp !== 'Customer') router.replace('/');
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(p => !p);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <PrivateGuard>
      <link rel="stylesheet" href="/eduassets/css/style.css"/>
      <style>{`
        .layout-wrapper { display: flex; }
        .main-content { flex:1; padding:20px; min-height:100vh; margin-left:260px; }
        @media(max-width:768px){
          .main-content { margin-left:0; padding:16px; }
          .sd-mobile-menu-btn { display:flex !important; }
        }
        .sd-mobile-menu-btn {
          display:none; background:transparent; border:none; color:#FFD569;
          font-size:24px; cursor:pointer; padding:8px; margin-right:12px;
          border-radius:8px; transition:all 0.2s ease; align-items:center; justify-content:center;
        }
        .sd-mobile-menu-btn:hover { background:rgba(255,213,105,0.1); }
      `}</style>
      <Header onMenuToggle={toggleSidebar} isMenuOpen={isSidebarOpen} />
      <div className="container">
        <div className="layout-wrapper d-flex">
          <Sidebar isMobileOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
          <main className="main-content">
            <div className="blur-wrapper">
              <div className="blur-circle blur-purple"></div>
              <div className="blur-circle blur-teal"></div>
              <div className="blur-circle blur-amber"></div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </PrivateGuard>
  );
}
