import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="google-site-verification" content="H7mODFbLsLZQVighNNZBIlFHoInuoI881YleLZ7b4vo" />
      </head>
      <body className="min-h-full bg-stone-950 text-stone-200 antialiased">
        {children}
      </body>
    </html>
  );
}
