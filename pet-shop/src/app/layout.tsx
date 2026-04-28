import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import { Header } from '@/components/header';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});
const interTight = Inter({
  variable: '--font-inter-tight',
  subsets: ['latin'],
  weight: ['700'],
});

export const metadata: Metadata = {
  title: 'Pet World',
  description: 'Here you see all the clients and services booked by them',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'min-h-full',
        'antialiased',
        inter.variable,
        interTight.variable,
        'font-sans',
        geist.variable
      )}
    >
      <body className="min-h-screen flex flex-col bg-background-primary">
        <Header />
        <div className="max-w-3xl mx-auto">
          <main className="flex-1 flex-col mt-12">
            {children}
            <Toaster position="top-right" />
          </main>
        </div>
      </body>
    </html>
  );
}
