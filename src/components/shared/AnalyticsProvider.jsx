'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ReactGA from 'react-ga4';

let initialized = false;

export default function AnalyticsProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!initialized) {
      ReactGA.initialize('G-H8REM9SBYQ');
      initialized = true;
    }
  }, []);

  useEffect(() => {
    if (initialized) ReactGA.send({ hitType: 'pageview', page: pathname });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return children;
}
