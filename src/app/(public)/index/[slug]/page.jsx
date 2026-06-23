import Index from '@/components/pages/Index';

export const metadata = {
  title: "Sanatan Diksha | Your Spiritual Companion Powered by AI",
  description:
    "Discover your cosmic profile, daily panchang, Bhagavad Gita wisdom, temple information, and spiritual guidance powered by AI.",

  keywords: [
    "Sanatan Diksha",
    "Bhagavad Gita",
    "Daily Panchang",
    "Hindu Spirituality",
    "Vedic Astrology",
    "Temple Darshan",
    "Sanatan Dharma",
    "AI Spiritual Companion"
  ],

  openGraph: {
    title: "Sanatan Diksha",
    description:
      "Daily Panchang, Bhagavad Gita wisdom, temples and personalized spiritual guidance.",
    type: "website",
    siteName: "Sanatan Diksha",
    images: [
      {
        url: "/favicon.svg",
        width: 1200,
        height: 630,
        alt: "Sanatan Diksha",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sanatan Diksha",
    description:
      "Daily Panchang, Bhagavad Gita wisdom and spiritual guidance.",
    images: ["/favicon.svg"],
  },
};

export default function Page() {
  return <Index />;
}