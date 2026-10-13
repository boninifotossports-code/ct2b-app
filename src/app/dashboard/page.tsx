import React from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  BookOpen,
  ClipboardList,
  CheckSquare,
  FolderOpen,
  UserCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      {/* ──────────────── Conteúdo Principal ──────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Cabeçalho de Boas-Vindas & Card do Treinador */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-orange-500 uppercase">
              Painel de Gestão
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3 mt-1">
              Olá, Treinador 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Pronto para mais um dia de treinos no CT 2B?
            </p>
          </div>

          {/* Badge Treinador Principal */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-3 flex items-center gap-3.5 self-start md:self-auto shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-black text-base flex items-center justify-center">
              TR
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">
                Treinador Principal
              </div>
              <div className="text-[10px] font-black text-slate-500 tracking-wider uppercase mt-0.5">
                Administração
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────── Cards de Resumo Operacional ──────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card: Total de Atletas */}
          <div className="bg-[#0d1424] border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xl hover:border-slate-700/80 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-slate-800/70 text-slate-300 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total de Atletas
            </div>
            <div className="text-3xl font-black text-white mt-1">
              1 Aluno
            </div>
            <Link
              href="/cadastros"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-400 mt-4 transition-colors"
            >
              <span>Gerir elenco</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card: Próximo Treino */}
          <div className="bg-[#0d1424] border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xl hover:border-slate-700/80 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-slate-800/70 text-orange-400 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Próximo Treino
            </div>
            <div className="text-2xl font-black text-white mt-1">
              Treino nº 1
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Hoje • Duração: 90 min
            </div>
            <Link
              href="/presenca"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-3 transition-colors"
            >
              <span>Realizar chamada</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card: Treinos & Exercícios */}
          <div className="bg-[#0d1424] border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xl hover:border-slate-700/80 transition-colors sm:col-span-2 lg:col-span-1">
            <div className="w-11 h-11 rounded-2xl bg-slate-800/70 text-amber-400 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Treinos & Exercícios
            </div>
            <div className="flex items-center gap-6 mt-1">
              <div>
                <span className="text-2xl font-black text-white">1</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1.5">
                  Planos
                </span>
              </div>
              <div>
                <span className="text-2xl font-black text-white">1</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1.5">
                  Exercícios
                </span>
              </div>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-4">
              Biblioteca ativa e atualizada
            </div>
          </div>
        </section>

        {/* ──────────────── Grid de Atalhos & Biblioteca Tática ──────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Coluna da Esquerda: Acesso Rápido e Planos Recentes */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bloco: Acesso Rápido */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Acesso Rápido
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/treinos/novo"
                  className="bg-[#0d1424] hover:bg-[#111a30] border border-slate-800/80 hover:border-orange-500/40 rounded-2xl p-4 flex items-center gap-4 transition-all group shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 group-hover:bg-orange-600/20 text-orange-400 flex items-center justify-center transition-colors">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                      Criar Novo Treino
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Monte com o quadro tático virtual
                    </div>
                  </div>
                </Link>

                <Link
                  href="/presenca"
                  className="bg-[#0d1424] hover:bg-[#111a30] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-4 flex items-center gap-4 transition-all group shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 group-hover:bg-emerald-600/20 text-emerald-400 flex items-center justify-center transition-colors">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Fazer Chamada
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Controle presenças em tempo real
                    </div>
                  </div>
                </Link>

                <Link
                  href="/treinos"
                  className="bg-[#0d1424] hover:bg-[#111a30] border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-4 flex items-center gap-4 transition-all group shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 group-hover:bg-amber-600/20 text-amber-400 flex items-center justify-center transition-colors">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      Treinos Criados
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Aceda ao histórico de planos de treino
                    </div>
                  </div>
                </Link>

                <Link
                  href="/cadastros"
                  className="bg-[#0d1424] hover:bg-[#111a30] border border-slate-800/80 hover:border-sky-500/40 rounded-2xl p-4 flex items-center gap-4 transition-all group shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 group-hover:bg-sky-600/20 text-sky-400 flex items-center justify-center transition-colors">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                      Gerir Alunos
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Registe e acompanhe os seus atletas
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Bloco: Planos Recentes */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Planos Recentes 📅
                </h2>
              </div>

              <div className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-lg hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-2 rounded-xl bg-slate-800 text-center min-w-[68px]">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Treino
                    </span>
                    <span className="block text-base font-black text-orange-500">
                      Nº 1
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">
                      Competitivo • Sol
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Hoje • Horário: 16:30 • Duração: 90 min
                    </div>
                  </div>
                </div>

                <Link
                  href="/treinos"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors shrink-0"
                >
                  Ver Ficha
                </Link>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Biblioteca de Táticas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Biblioteca de Táticas 🔍
              </h2>
            </div>

            <div className="bg-[#0d1424] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Organize & reutilize os exercícios
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  As táticas e os exercícios planeados ficam registados no
                  sistema para consulta e reutilização no planeamento diário.
                </p>
              </div>

              <div className="w-full aspect-[4/3] rounded-2xl bg-[#090e1a] border border-slate-800/90 flex flex-col items-center justify-center p-6 text-center group hover:border-orange-500/40 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-white">
                  Quadro Tático Interativo
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                  Módulos Fut 7 e Futsal
                </div>
              </div>

              <Link
                href="/treinos"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Aceder aos Treinos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}