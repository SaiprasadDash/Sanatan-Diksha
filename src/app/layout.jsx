import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.css';
import '@/styles/user.css';
import '@/styles/index.css';

import { AuthProvider } from '@/context/AuthProvider';
import { VisitorProvider } from '@/context/VisitorContext';
import AnalyticsProvider from '@/components/shared/AnalyticsProvider';

export const metadata = {
  title: 'Sanatan Diksha',
  description: 'Sanatan Diksha Platform',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/eduassets/css/style.css" />
        <link rel="stylesheet" href="/eduassets/icons/fontawesome/css/all.min.css" />
        <link rel="stylesheet" href="/eduassets/icons/bootstrap-icons/font/bootstrap-icons.css" />
      </head>
      <body>
        <VisitorProvider>
          <AuthProvider>
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          </AuthProvider>
        </VisitorProvider>
      </body>
    </html>
  );
}
