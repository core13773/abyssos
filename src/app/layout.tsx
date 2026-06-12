import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-stone-950 text-stone-200 antialiased">
        {children}
      </body>
    </html>
  );
}
