import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { JournalProvider } from '@/lib/context/JournalContext';

export const metadata: Metadata = {
  title: 'Memoiary — Your Memory & Story Witness',
  description: 'A private, beautiful personal journal and witness companion that helps you see, structure, connect, and discover your own life story.',
  openGraph: {
    title: 'Memoiary — Your Memory & Story Witness',
    description: 'A private, beautiful personal journal and witness companion that helps you see, structure, connect, and discover your own life story.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memoiary — Your Memory & Story Witness',
    description: 'A private, beautiful personal journal and witness companion that helps you see, structure, connect, and discover your own life story.',
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
