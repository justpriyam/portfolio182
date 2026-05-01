import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Priyam Gupta | Portfolio',
  description:
    'Personal portfolio of Priyam Gupta — Computer Science Engineering Undergraduate, Backend & Full-Stack Developer, and Innovator.',
  keywords: [
    'Priyam Gupta',
    'Portfolio',
    'Full-Stack Developer',
    'Backend Developer',
    'Computer Science',
    'React',
    'Next.js',
    'Java',
    'Python',
  ],
  authors: [{ name: 'Priyam Gupta' }],
  openGraph: {
    title: 'Priyam Gupta | Portfolio',
    description:
      'Backend & Full-Stack Developer passionate about building scalable APIs, AI-driven tools, and efficient systems.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased bg-primary`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
