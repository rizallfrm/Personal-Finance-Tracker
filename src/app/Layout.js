// src/app/layout.js
'use client';
import { ReduxProvider } from './providers';
import '../styles/globals.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}