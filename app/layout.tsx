import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { JournalProvider } from '@/lib/context/JournalContext';

export const metadata: Metadata = {
  title: 'Memoiary — Your Memories, Beautifully Connected',
  description: 'A private, beautiful personal journal and memory engine. Your memories, beautifully connected.',
  icons: {
    icon: '/logo-mark.png',
    apple: '/logo-mark.png',
  },
  openGraph: {
    title: 'Memoiary — Your Memories, Beautifully Connected',
    description: 'A private, beautiful personal journal and memory engine. Your memories, beautifully connected.',
    type: 'website',
    images: [{ url: '/logo-mark.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memoiary — Your Memories, Beautifully Connected',
    description: 'A private, beautiful personal journal and memory engine. Your memories, beautifully connected.',
    images: ['/logo-mark.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <JournalProvider>
          {children}
        </JournalProvider>
      </body>
    </html>
  );
}
