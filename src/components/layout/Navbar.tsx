'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Dumbbell, 
  Users, 
  Video, 
  FileText, 
  UserSquare, 
  History, 
  CalendarCheck 
} from 'lucide-react';

interface NavbarProps {
  currentRole: 'coach' | 'guardian';
  onRoleToggle: (role: 'coach' | 'guardian') => void;
}

export function Navbar({ currentRole, onRoleToggle }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Links específicos para o Treinador
  const coachLinks = [
    { name: 'Chamada', href: '/chamada', icon: Users },
    { name: 'Montador', href: '/treinos', icon: Dumbbell },
    { name: 'Acervo', href: '/videos', icon: Video },
    { name: 'Boletins', href: '/feedback', icon: FileText },
  ];

  // Links específicos para a Família
  const guardianLinks = [
    { name: 'Visão Geral', href: '/meu-atleta', icon: UserSquare },
    { name: 'Presença', href: '/presenca', icon: CalendarCheck },
    { name: 'Histórico', href: '/treinos-feitos', icon: History },
  ];

  const activeLinks = currentRole === 'coach' ? coachLinks : guardianLinks;

  return (
    <nav className="bg-ct2b-surface border-b border-ct2b-border sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Lado Esquerdo: Logo e Menu Desktop */}
          <div className="flex items-center">
            {/* Logo CT 2B */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black border-2 border-ct2b-orange flex items-center justify-center font-black text-ct2b-orange text-lg">
                2B
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-black text-sm block uppercase tracking-wider">Centro de Treinamento</span>
                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">by AB Labs</span>
              </div>
            </div>

            {/* Links Desktop */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
              {activeLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-ct2b-orange text-white shadow-md shadow-ct2b-orange/20'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Lado Direito: Alternador de Perfil */}
          <div className="hidden sm:flex sm:items-center">
            <div className="flex bg-ct2b-bg p-1 rounded-xl border border-ct2b-border">
              <button
                onClick={() => onRoleToggle('coach')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'coach'
                    ? 'bg-ct2b-border text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Treinador
              </button>
              <button
                onClick={() => onRoleToggle('guardian')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'guardian'
                    ? 'bg-ct2b-border text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Família
              </button>
            </div>
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Expandido */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-ct2b-surface border-b border-ct2b-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {activeLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-ct2b-orange text-white'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Alternador de Perfil Mobile */}
          <div className="px-4 py-4 border-t border-ct2b-border bg-ct2b-bg/50">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Visão Ativa:</p>
            <div className="flex bg-ct2b-surface p-1 rounded-xl border border-ct2b-border">
              <button
                onClick={() => { onRoleToggle('coach'); setIsMobileMenuOpen(false); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'coach'
                    ? 'bg-ct2b-border text-white shadow-sm'
                    : 'text-zinc-500'
                }`}
              >
                Treinador
              </button>
              <button
                onClick={() => { onRoleToggle('guardian'); setIsMobileMenuOpen(false); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'guardian'
                    ? 'bg-ct2b-border text-white shadow-sm'
                    : 'text-zinc-500'
                }`}
              >
                Família
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}