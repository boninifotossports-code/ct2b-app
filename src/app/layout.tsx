'use client';

import React, { useState } from 'react';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<'coach' | 'guardian'>('coach');

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-ct2b-bg text-ct2b-text antialiased selection:bg-ct2b-orange selection:text-white">
        <Navbar currentRole={role} onRoleToggle={setRole} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}