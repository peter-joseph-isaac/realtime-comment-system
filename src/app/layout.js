'use client';  // Mark this as a client component

import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import "./globals.css"; // Import any global styles

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          {children} {/* This renders the rest of your app */}
        </body>
      </html>
    </SessionProvider>
  );
}
