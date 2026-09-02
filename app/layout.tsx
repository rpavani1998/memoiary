import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { JournalProvider } from '@/lib/context/JournalContext';

export const metadata: Metadata = {
  title: 'Memoiary — Your Memories, Beautifully Connected',
  description: 'A private, beautiful personal journal and memory engine. Your memories, beautifully connected.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Memoiary — Your Memories, Beautifully Connected',
    description: 'A private, beautiful personal journal and memory engine. Your memories, beautifully connected.',
    type: 'website',
    images: [{ url: '/logo.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memoiary — Your Memories, Beautifully Connected',
    description: 'A private, beautiful personal journal and memory engine. Your memories, beautifully connected.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <JournalProvider>
          {children}
        </JournalProvider>
      </body>
    </html>
  );
}
