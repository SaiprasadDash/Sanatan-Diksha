import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import '@/styles/global.css';


import Script from "next/script";
import { AuthProvider } from "@/context/AuthProvider";
import { VisitorProvider } from "@/context/VisitorContext";
import AnalyticsProvider from "@/components/shared/AnalyticsProvider";

export const metadata = {
  title: "Sanatan Diksha",
  description: "Sanatan Diksha Platform",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/eduassets/vendor/wow-master/css/libs/animate.css" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet" />
        {/* <link rel="stylesheet" href="/eduassets/css/style.css" /> */}
        <link rel="stylesheet" href="/eduassets/icons/fontawesome/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" />
        <style>{`body { font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; }`}</style>
      </head>
      <body>
        <VisitorProvider>
          <AuthProvider>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </AuthProvider>
        </VisitorProvider>
        <Script src="/eduassets/vendor/jquery/jquery.min.js" strategy="beforeInteractive" />
        <Script src="/eduassets/vendor/global/global.min.js" strategy="afterInteractive" />
        <Script src="/eduassets/js/dlabnav-init.js" strategy="afterInteractive" />
        <Script src="/eduassets/js/custom.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}