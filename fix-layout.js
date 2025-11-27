const fs = require('fs');

console.log('🔧 Fixing layout.tsx syntax errors...');

// Create a clean, working layout.tsx file
const layoutContent = `'use client';

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import FixedHeader from '@/components/layout/FixedHeader';
import { ErrorBoundary } from 'react-error-boundary';

function LayoutErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <html lang="en">
      <body className={\`\${GeistSans.variable} \${GeistMono.variable} antialiased\`}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Error</h1>
            <p className="text-gray-600 mb-4">There was a problem loading the application.</p>
            <button
              onClick={resetErrorBoundary}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={\`\${GeistSans.variable} \${GeistMono.variable} antialiased\`}>
        <ErrorBoundary
          FallbackComponent={LayoutErrorFallback}
          onReset={() => {
            window.location.reload();
          }}
        >
          <AuthProvider>
            <CartProvider>
              <FixedHeader />
              <main className="pt-16">
                {children}
              </main>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Garden & Grains',
  description: 'Fresh, healthy meals delivered to you',
};
`;

fs.writeFileSync('src/app/layout.tsx', layoutContent);
console.log('✅ Fixed layout.tsx syntax errors');
console.log('🚀 Now run: npm run dev');
