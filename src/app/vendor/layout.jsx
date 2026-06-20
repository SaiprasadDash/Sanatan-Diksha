'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrivateGuard from '@/components/shared/PrivateGuard';
import Header from '@/components/inc/header';
import Sidebar from '@/components/vendor/sidebar';
import Apiconnect from '@/services/Apiconnect';

export default function VendorLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [kycSts, setKycSts] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userTyp = localStorage.getItem('user_typ');
    if (userTyp !== 'Vendor') { router.replace('/'); return; }

    Apiconnect.postData('vendor/vendorinfo').then(res => {
      setKycSts(res.data?.vendor?.kyc_status);
    }).catch(console.error);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(p => !p);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <PrivateGuard>
      <Header onMenuToggle={toggleSidebar} isMenuOpen={isSidebarOpen} />
      <div className="container">
        <div className="layout-wrapper d-flex">
          <Sidebar isMobileOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} kycSts={kycSts} />
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
