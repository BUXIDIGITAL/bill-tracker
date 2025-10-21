import './globals.css';
import './styles/theme.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bill Tracker',
  description: 'Track subscriptions and bills with a sleek dark theme calendar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text">
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  );
}
