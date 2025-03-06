
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers";
import ScrollToTop from "@/components/ScrollToTop";
import React from 'react';

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['100', '300', '400', '500', '700', '900']
});

// Viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  colorScheme: 'dark'
};

export const metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: 'Valoled | Innovative Lighting Solutions',
    template: '%s | Valoled'
  },
  description: 'Valoled offers cutting-edge lighting solutions for indoor, outdoor, and specialized applications. Discover our range of innovative lighting products and solutions.',

  // Basic metadata
  applicationName: 'Valoled',
  authors: [{ name: 'Valoled Team' }],
  generator: 'Next.js',
  keywords: ['lighting', 'LED', 'indoor lighting', 'outdoor lighting', 'smart lighting', 'commercial lighting', 'architectural lighting'],
  referrer: 'origin-when-cross-origin',

  // iOS specific
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Valoled',
  },

  // Open Graph
  openGraph: {
    type: 'website',
    siteName: 'Valoled',
    title: 'Valoled | Innovative Lighting Solutions',
    description: 'Discover cutting-edge lighting solutions for every space. Transform your environment with our innovative lighting products.',
    url: 'https://your-domain.com',
    locale: 'en_US',
    images: [
      {
        url: '/logo-black.png',
        width: 1200,
        height: 630,
        alt: 'Valoled Lighting Solutions'
      }
    ]
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Valoled | Innovative Lighting Solutions',
    description: 'Transform your space with innovative lighting solutions from Valoled.',
    images: ['/twitter-image.jpg'],
    creator: '@valoled',
    site: '@valoled'
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },

  // Alternate languages
  alternates: {
    canonical: 'https://your-domain.com',
    languages: {
      'en-US': 'https://your-domain.com',
    }
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      }
    ],
  },

  // Manifest
  manifest: '/manifest.json'
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body>
  
          <Providers>
            <Navbar />
            <main>
              {children}
            </main>
            <ScrollToTop />
            <Footer />
          </Providers>
 
      </body>
    </html>
  );
}