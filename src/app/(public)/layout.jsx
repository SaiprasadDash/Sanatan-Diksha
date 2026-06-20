'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/inc/header';
import Footer from '@/components/inc/footer';

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith('/investoropportunity');

  return (
    <>
      {!hideLayout && <Header />}
      <main>
        <div className="blur-wrapper">
          <div className="blur-circle blur-purple"></div>
          <div className="blur-circle blur-teal"></div>
          <div className="blur-circle blur-amber"></div>
        </div>
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}
