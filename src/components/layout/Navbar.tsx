"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function NavbarPrincipal() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [dropdownTreinosAberto, setDropdownTreinosAberto] = useState(false);
  const [accordionTreinosMobile, setAccordionTreinosMobile] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (
    !pathname ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/trocar-senha") ||
    pathname.startsWith("/portal-pais")
  ) {
    return null;
  }

  const subitensTreinos = [
    {
      nome: "Planeamento",
      descricao: "Montador e prancheta tática em PDF",
      rota: "/treinos/planeamento",
      icone: "📝",
    },
    {
      nome: "Planos Salvos",
      descricao: "Histórico e biblioteca de treinos",
      rota: "/planos",
      icone: "📁",
    },
    {
      nome: "Agendamento",
      descricao: "Calendário e controlo de vagas",
      rota: "/agenda",
      icone: "📅",
    },
  ];

  const rotaTreinoAtiva = subitensTreinos.some((sub) =>
    pathname.startsWith(sub.rota)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownTreinosAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie = "ct2b_session=; path=/; max-age=0;";
    localStorage.removeItem("ct2b_user");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/85 backdrop-blur-xl border-b border-gray-800/80 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          <Link href="/" className="flex items-center gap-3 shrink-0 focus:outline-none">
            <div className="h-14 sm:h-16 flex items-center justify-center p-1 rounded-2xl bg-gray-900/60 border border-gray-800/60 shadow-inner hover:border-orange-500/40 transition-all">
              <img
                src="/topo-logo.png"
                alt="Centro de Treinamento 2B"
                className="h-full w-auto object-contain drop-shadow-md hover:scale-105 transition-transform"
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1.5 bg-gray-900/80 border border-gray-800/80 p-1.5 rounded-2xl shadow-inner backdrop-blur-md">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                pathname === "/"
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
              }`}
            >
              <span className="text-sm">📊</span>
              Dashboard
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownTreinosAberto(!dropdownTreinosAberto)}
                onMouseEnter={() => setDropdownTreinosAberto(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all focus:outline-none ${
                  rotaTreinoAtiva || dropdownTreinosAberto
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                }`}
              >
                <span className="text-sm">⚽</span>
                <span>Treinos</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownTreinosAberto ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownTreinosAberto && (
                <div
                  onMouseLeave={() => setDropdownTreinosAberto(false)}
                  className="absolute left-0 mt-2 w-64 rounded-2xl bg-gray-900/95 border border-gray-800 shadow-2xl backdrop-blur-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-gray-500 border-b border-gray-800/80 mb-1">
                    Gestão de Treinos
                  </div>
                  {subitensTreinos.map((sub) => {
                    const ativo = pathname.startsWith(sub.rota);
                    return (
                      <Link
                        key={sub.rota}
                        href={sub.rota}
                        onClick={() => setDropdownTreinosAberto(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                          ativo
                            ? "bg-orange-600/15 border border-orange-500/30 text-white"
                            : "hover:bg-gray-800/70 text-gray-300 hover:text-white"
                        }`}
                      >
                        <span className="text-xl p-1 bg-gray-800/80 rounded-lg border border-gray-700/50">
                          {sub.icone}
                        </span>
                        <div>
                          <div className={`text-xs font-bold ${ativo ? "text-orange-400" : "text-white"}`}>
                            {sub.nome}
                          </div>
                          <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                            {sub.descricao}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/presenca"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                pathname.startsWith("/presenca")
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
              }`}
            >
              <span className="text-sm">✅</span>
              Chamada
            </Link>

            <Link
              href="/atletas"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                pathname.startsWith("/atletas")
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
              }`}
            >
              <span className="text-sm">👥</span>
              Cadastros
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Comissão Técnica
            </div>

            <button
              onClick={handleLogout}
              title="Terminar Sessão"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair</span>
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setMenuMobileAberto(!menuMobileAberto)}
              aria-label="Abrir menu"
              className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-orange-500 transition-all focus:outline-none"
            >
              <svg className="w-6 h-6 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuMobileAberto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {menuMobileAberto && (
        <div className="lg:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link
            href="/"
            onClick={() => setMenuMobileAberto(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
              pathname === "/"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                : "text-gray-300 bg-gray-900/60 hover:bg-gray-900 hover:text-white border border-gray-800/60"
            }`}
          >
            <span className="text-base">📊</span>
            Dashboard
          </Link>

          <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setAccordionTreinosMobile(!accordionTreinosMobile)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider font-bold text-white focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">⚽</span>
                <span>Treinos</span>
                {rotaTreinoAtiva && <span className="w-2 h-2 rounded-full bg-orange-500"></span>}
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${accordionTreinosMobile ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {accordionTreinosMobile && (
              <div className="px-3 pb-3 space-y-1.5 border-t border-gray-800/60 pt-2">
                {subitensTreinos.map((sub) => {
                  const ativo = pathname.startsWith(sub.rota);
                  return (
                    <Link
                      key={sub.rota}
                      href={sub.rota}
                      onClick={() => setMenuMobileAberto(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        ativo
                          ? "bg-orange-600 text-white shadow-md shadow-orange-600/25"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span className="text-sm">{sub.icone}</span>
                      <span>{sub.nome}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/presenca"
            onClick={() => setMenuMobileAberto(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
              pathname.startsWith("/presenca")
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                : "text-gray-300 bg-gray-900/60 hover:bg-gray-900 hover:text-white border border-gray-800/60"
            }`}
          >
            <span className="text-base">✅</span>
            Chamada
          </Link>

          <Link
            href="/atletas"
            onClick={() => setMenuMobileAberto(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
              pathname.startsWith("/atletas")
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                : "text-gray-300 bg-gray-900/60 hover:bg-gray-900 hover:text-white border border-gray-800/60"
            }`}
          >
            <span className="text-base">👥</span>
            Cadastros
          </Link>

          <div className="pt-3 border-t border-gray-800/80">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Terminar Sessão
            </button>
          </div>
        </div>
      )}
    </header>
  );
}