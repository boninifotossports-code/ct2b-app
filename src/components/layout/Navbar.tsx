"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  Dumbbell,
  CheckSquare,
  Users,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function NavbarPrincipal() {
  // REGRA DE OURO DO REACT: TODOS os hooks devem ser chamados no topo,
  // SEMPRE na mesma ordem e NUNCA depois de um if (...) return!
  const pathname = usePathname();
  const router = useRouter();

  const [montado, setMontado] = useState(false);
  const [menuTreinosAberto, setMenuTreinosAberto] = useState(false);
  const [usuario, setUsuario] = useState<{ nome?: string; role?: string } | null>(null);

  useEffect(() => {
    setMontado(true);
    try {
      const match = document.cookie.match(new RegExp("(^| )ct2b_session=([^;]+)"));
      if (match) {
        setUsuario(JSON.parse(decodeURIComponent(match[2])));
      }
    } catch (e) {
      console.error("Erro ao ler sessão:", e);
    }
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "ct2b_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  // Se estiver na tela de login ou troca de senha, não exibe a barra
  // (Este retorno condicional só acontece DEPOIS de todos os hooks serem registrados!)
  const rotasSemNavbar = ["/login", "/trocar-senha"];
  if (rotasSemNavbar.includes(pathname)) {
    return null;
  }

  return (
    <header className="border-b border-slate-800 bg-[#0b1120] sticky top-0 z-50 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo CT 2B */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center font-black text-orange-500 text-lg shadow-lg shadow-orange-600/10">
            2B
          </div>
          <div>
            <span className="block text-xs font-black tracking-wider text-slate-100 uppercase">
              Centro de Desenvolvimento
            </span>
            <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
              de Futebol e Futsal
            </span>
          </div>
        </Link>

        {/* Links de Navegação */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              pathname === "/dashboard"
                ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          {/* Dropdown Treinos */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuTreinosAberto(!menuTreinosAberto)}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 font-semibold text-xs tracking-wide transition-colors flex items-center gap-1.5"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Treinos</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {menuTreinosAberto && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50"
                onMouseLeave={() => setMenuTreinosAberto(false)}
              >
                <Link
                  href="/treinos/novo"
                  prefetch={false}
                  onClick={() => setMenuTreinosAberto(false)}
                  className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Criar Novo Treino
                </Link>
                <Link
                  href="/treinos"
                  prefetch={false}
                  onClick={() => setMenuTreinosAberto(false)}
                  className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Histórico de Treinos
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/presenca"
            prefetch={false}
            className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
              pathname === "/presenca"
                ? "text-emerald-400 bg-emerald-500/10 font-bold"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>Chamada</span>
          </Link>

          <Link
            href="/atletas"
            prefetch={false}
            className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
              pathname === "/atletas"
                ? "text-orange-500 bg-orange-500/10 font-bold"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            <Users className="w-4 h-4 text-sky-400" />
            <span>Cadastros</span>
          </Link>
        </nav>

        {/* Informações da Sessão e Ação Sair */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">
              {usuario?.role ? usuario.role : "Comissão Técnica"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Sair do sistema"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}