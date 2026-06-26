import Index from '@/components/pages/Index';

export const metadata = {
  title: 'Sanatan Diksha — Your Daily Spiritual Companion',
  description:
    'Start your spiritual journey with Sanatan Diksha. Get today\'s Verse of the Day from the Bhagavad Geeta, daily Panchang, temple finder, and personalised cosmic profile — all in one place.',
  keywords: [
    'Sanatan Diksha',
    'Bhagavad Geeta',
    'verse of the day',
    'daily panchang',
    'Hindu spiritual platform',
    'temple finder',
    'pandit booking',
    'cosmic profile',
    'vedic astrology',
    'pooja online',
  ],
  authors: [{ name: 'Sanatan Diksha' }],
  metadataBase: new URL('https://www.sanatandiksha.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sanatan Diksha — Your Daily Spiritual Companion',
    description:
      'Bhagavad Geeta verse of the day, daily Panchang, temple finder, and personalised Vedic cosmic profile. Begin your spiritual practice today.',
    url: 'https://www.sanatandiksha.com',
    siteName: 'Sanatan Diksha',
    images: [
      {
        url: '/Sanatan Logo-high res.png',
        width: 1200,
        height: 630,
        alt: 'Sanatan Diksha — Spiritual Platform',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanatan Diksha — Your Daily Spiritual Companion',
    description:
      'Bhagavad Geeta verse of the day, daily Panchang, temple finder, and personalised Vedic cosmic profile.',
    images: ['/Sanatan Logo-high res.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function Page() {
  return <Index />;
}