"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardTreinador() {
  const [metricas, setMetricas] = useState({
    alunos: 0,
    planosCount: 0,
    exerciciosCount: 0,
    proximoTreino: null as any,
    ultimosPlanos: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setMetricas(data);
        }
      } catch (error) {
        console.error("Erro ao carregar métricas do dashboard");
      } finally {
        setLoading(false);
      }
    }
    carregarDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 lg:p-8">
      {/* CABEÇALHO BOAS-VINDAS */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-orange-500 font-bold text-xs uppercase tracking-widest">Painel de Gestão</p>
          <h1 className="text-3xl font-black tracking-tight text-white mt-1">Olá, Treinador 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Pronto para mais um dia de treinos no CT 2B?</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-3 shadow-inner">
          <div className="w-10 h-10 rounded-full bg-[#15803d] flex items-center justify-center font-black text-white">TR</div>
          <div>
            <p className="text-xs font-bold text-gray-300">Treinador Principal</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Administração</p>
          </div>
        </div>
      </div>

      {/* ÁREA DE MÉTRICAS (CARDS PREMIUM) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* TOTAL DE ALUNOS */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-orange-500/40 transition-all rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-5 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:opacity-10 transition-opacity"></div>
          <span className="text-3xl">👥</span>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-4">Total de Atletas</p>
          <p className="text-4xl font-black text-white mt-1">
            {loading ? "..." : `${metricas.alunos} Alunos`}
          </p>
          <Link href="/atletas" className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 mt-4 transition-colors">
            Gerir elenco →
          </Link>
        </div>

        {/* PRÓXIMO TREINO */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-[#15803d]/40 transition-all rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#15803d] opacity-5 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:opacity-10 transition-opacity"></div>
          <span className="text-3xl">⚽</span>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-4">Próximo Treino</p>
          <p className="text-2xl font-black text-white mt-1 truncate">
            {loading ? "..." : metricas.proximoTreino ? `Treino nº ${metricas.proximoTreino.numeroPlano}` : "Hoje, às 16:30"}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {metricas.proximoTreino ? `${metricas.proximoTreino.data} • Vol: ${metricas.proximoTreino.volume}` : "Nenhuma sessão futura agendada"}
          </p>
          <Link href="/presenca" className="text-xs font-bold text-[#15803d] hover:text-green-400 flex items-center gap-1 mt-3 transition-colors">
            Realizar chamada →
          </Link>
        </div>

        {/* METAS RÁPIDAS */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-blue-500/40 transition-all rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:opacity-10 transition-opacity"></div>
          <span className="text-3xl">📚</span>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-4">Treinos & Exercícios</p>
          <div className="flex gap-4 mt-2">
            <div>
              <p className="text-2xl font-black text-white">{metricas.planosCount}</p>
              <p className="text-[9px] uppercase font-black text-gray-500">Planos</p>
            </div>
            <div className="w-px bg-gray-800"></div>
            <div>
              <p className="text-2xl font-black text-white">{metricas.exerciciosCount}</p>
              <p className="text-[9px] uppercase font-black text-gray-500">Exercícios</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase">Biblioteca ativa e atualizada</p>
        </div>
      </div>

      {/* ÁREA DE ACESSOS E CONTEÚDO */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1 & 2: ACESSOS E ÚLTIMOS TREINOS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ACESSOS RÁPIDOS */}
          <div>
            <h3 className="font-extrabold text-xl mb-4 border-l-4 border-orange-500 pl-3">Acesso Rápido ⚡</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* MONTAR TREINO */}
              <Link href="/treinos/planeamento" className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-orange-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02] shadow">
                <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center text-2xl">📋</div>
                <div>
                  <h4 className="font-bold text-gray-200">Criar Novo Treino</h4>
                  <p className="text-xs text-gray-400">Monte com o quadro tático virtual</p>
                </div>
              </Link>

              {/* CHAMADA */}
              <Link href="/presenca" className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-orange-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02] shadow">
                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center text-2xl">📝</div>
                <div>
                  <h4 className="font-bold text-gray-200">Fazer Chamada</h4>
                  <p className="text-xs text-gray-400">Controle presenças em tempo real</p>
                </div>
              </Link>

              {/* HISTÓRICO DE TREINOS */}
              <Link href="/treinos-feitos" className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-orange-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02] shadow">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center text-2xl">🗂️</div>
                <div>
                  <h4 className="font-bold text-gray-200">Treinos Criados</h4>
                  <p className="text-xs text-gray-400">Aceda ao histórico de planos de treino</p>
                </div>
              </Link>

              {/* CADASTROS */}
              <Link href="/atletas" className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-orange-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02] shadow">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center text-2xl">🛡️</div>
                <div>
                  <h4 className="font-bold text-gray-200">Gerir Alunos</h4>
                  <p className="text-xs text-gray-400">Cadastre e acompanhe os seus atletas</p>
                </div>
              </Link>

            </div>
          </div>

          {/* ÚLTIMOS PLANOS REGISTADOS */}
          <div>
            <h3 className="font-extrabold text-xl mb-4 border-l-4 border-orange-500 pl-3">Planos Recentes 📅</h3>
            {metricas.ultimosPlanos.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center text-gray-500">
                Ainda não criou planos de treino. Os treinos que guardar vão aparecer aqui!
              </div>
            ) : (
              <div className="space-y-3">
                {metricas.ultimosPlanos.map((plano: any) => (
                  <div key={plano.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors rounded-2xl p-4 flex justify-between items-center gap-4 shadow">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-800 rounded-xl px-3 py-2 text-center border border-gray-700 min-w-[60px]">
                        <span className="text-[9px] text-gray-400 font-bold block uppercase">Treino</span>
                        <span className="text-lg font-black text-orange-500">Nº {plano.numeroPlano}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-200">{plano.periodo} • {plano.clima}</h4>
                        <p className="text-xs text-gray-400 font-medium">Data: {plano.data} • Hora: {plano.hora} • Vol: {plano.volume}</p>
                      </div>
                    </div>
                    <Link href={`/treinos-feitos?id=${plano.id}`} className="text-xs font-bold bg-[#333] hover:bg-orange-500 text-white px-3 py-2 rounded-lg transition-colors">
                      Ver Ficha 📄
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* COLUNA 3: FEED E BIBLIOTECA DE EXERCÍCIOS */}
        <div>
          <h3 className="font-extrabold text-xl mb-4 border-l-4 border-orange-500 pl-3">Biblioteca de Táticas 🔍</h3>
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6 shadow">
            <div>
              <h4 className="font-bold text-gray-200 text-sm">Organize & reutilize os exercícios</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">As táticas individuais que desenhou e guardou ficam registadas no sistema para que possa reutilizá-las no planeamento diário.</p>
            </div>
            
            <div className="w-full aspect-[1.5/1] bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center text-center p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[#15803d]/10 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-3xl mb-2">📐⚽</span>
                <p className="text-xs font-bold text-gray-300">Quadro Tático Interativo</p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Módulos Fut 7 e Futsal</p>
              </div>
            </div>

            <Link href="/treinos/planeamento" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex justify-center items-center gap-2">
              <span>✍🏼📐</span> ACESSAR QUADRO TÁTICO
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}