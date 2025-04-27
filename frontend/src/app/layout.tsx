// File: src/app/layout.tsx
import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow p-4">
          <div className="max-w-4xl mx-auto flex space-x-4">
            <Link href="/" className="font-medium text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="/reports" className="font-medium text-gray-700 hover:text-gray-900">
              Reports
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
