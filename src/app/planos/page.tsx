"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AtividadePlano {
  title?: string;
  time?: string;
  players?: string;
  space?: string;
  specificObjective?: string;
  description?: string;
  image?: string;
}

interface PlanoTreino {
  id: string;
  numeroPlano: number;
  data: string;
  hora: string;
  microciclo: string;
  mesociclo: string;
  periodo: string;
  clima: string;
  volume: string;
  jogadores: string;
  material: string;
  objetivosGerais: string;
  objetivosEspecificos: string;
  observacoes: string;
  atividades: AtividadePlano[] | any;
  createdAt: string;
}

export default function PlanosSalvosPage() {
  const router = useRouter();
  const [planos, setPlanos] = useState<PlanoTreino[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [planoDetalhe, setPlanoDetalhe] = useState<PlanoTreino | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  const carregarPlanos = async () => {
    try {
      setCarregando(true);
      const res = await fetch("/api/planos");
      if (res.ok) {
        const data = await res.json();
        setPlanos(data);
      }
    } catch (err) {
      console.error("Erro ao carregar planos:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPlanos();
  }, []);

  const handleExcluir = async (id: string) => {
    if (!confirm("Tem a certeza de que pretende eliminar este plano de treino?")) return;

    try {
      setExcluindoId(id);
      const res = await fetch(`/api/planos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlanos((prev) => prev.filter((p) => p.id !== id));
        if (planoDetalhe?.id === id) setPlanoDetalhe(null);
      }
    } catch (err) {
      console.error("Erro ao eliminar:", err);
    } finally {
      setExcluindoId(null);
    }
  };

  const handleBaixarPdf = async () => {
    if (!pdfRef.current || !planoDetalhe) return;
    setGerandoPdf(true);

    try {
      // @ts-ignore
      const html2pdf = (await import("html2pdf.js")).default;
      const elemento = pdfRef.current;

      const opcoes = {
  margin: [8, 8, 8, 8] as [number, number, number, number],
  filename: `Plano_Treino_${planoDetalhe.numeroPlano}_CT2B.pdf`,
  image: { type: "jpeg" as const, quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true, backgroundColor: "#030712" },
  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
};

      await html2pdf().set(opcoes).from(elemento).save();
    } catch (erro) {
      console.error("Erro ao gerar PDF:", erro);
      alert("Ocorreu um erro ao descarregar o PDF.");
    } finally {
      setGerandoPdf(false);
    }
  };

  const handleEditarPlano = (id: string) => {
    router.push(`/treinos/planeamento?editId=${id}`);
  };

  const planosFiltrados = planos.filter((p) => {
    const termo = busca.toLowerCase();
    return (
      p.numeroPlano.toString().includes(termo) ||
      p.objetivosGerais?.toLowerCase().includes(termo) ||
      p.data?.toLowerCase().includes(termo) ||
      p.periodo?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Planos de Treino Salvos</h1>
          <p className="text-gray-400 text-sm mt-1">Histórico completo de sessões planeadas, exercícios e arquivos táticos.</p>
        </div>

        <Link
          href="/treinos/planeamento"
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-600/20 self-start sm:self-auto"
        >
          <span>➕</span>
          Novo Planeamento
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 flex items-center gap-3">
        <span className="text-gray-500 pl-2">🔍</span>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar por número do plano, data, objetivo ou período..."
          className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500 w-full"
        />
        {busca && (
          <button onClick={() => setBusca("")} className="text-xs text-gray-500 hover:text-gray-300 pr-2">Limpar</button>
        )}
      </div>

      {carregando ? (
        <div className="p-12 text-center text-gray-500 bg-gray-900/40 border border-gray-800 rounded-3xl">A carregar planos de treino...</div>
      ) : planosFiltrados.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-gray-900/40 border border-gray-800 rounded-3xl">Nenhum plano encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {planosFiltrados.map((plano) => {
            const totalExercicios = Array.isArray(plano.atividades) ? plano.atividades.length : 0;
            return (
              <div key={plano.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow hover:border-gray-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      Plano #{plano.numeroPlano}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">📅 {plano.data || "Sem data"}</span>
                  </div>

                  <h3 className="font-bold text-white text-base line-clamp-1">{plano.objetivosGerais || "Treino Técnico/Tático"}</h3>

                  <div className="mt-3 space-y-1.5 text-xs text-gray-400">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Período:</span>
                      <span className="text-gray-300 font-medium">{plano.periodo || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Horário / Duração:</span>
                      <span className="text-gray-300 font-medium">{plano.hora || "-"} {plano.volume ? `(${plano.volume})` : ""}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Exercícios Montados:</span>
                      <span className="text-orange-400 font-bold">{totalExercicios}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-800 flex items-center gap-2">
                  <button
                    onClick={() => setPlanoDetalhe(plano)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-all text-center"
                  >
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleEditarPlano(plano.id)}
                    title="Editar Plano"
                    className="p-2 rounded-xl text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 border border-transparent hover:border-orange-500/20 transition-all text-xs"
                  >
                    ✏️
                  </button>
                  <button
                    disabled={excluindoId === plano.id}
                    onClick={() => handleExcluir(plano.id)}
                    title="Eliminar Plano"
                    className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50 text-xs"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {planoDetalhe && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-4xl h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    Plano de Sessão #{planoDetalhe.numeroPlano}
                  </span>
                  <h2 className="text-lg font-black text-white truncate max-w-md">
                    {planoDetalhe.objetivosGerais || "Treino Técnico/Tático"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBaixarPdf}
                  disabled={gerandoPdf}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-emerald-600/20"
                >
                  <span>📥</span>
                  <span>{gerandoPdf ? "A gerar..." : "Baixar PDF"}</span>
                </button>

                <button
                  onClick={() => handleEditarPlano(planoDetalhe.id)}
                  className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20"
                >
                  <span>✏️</span>
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => setPlanoDetalhe(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-lg"
                  title="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
              <div ref={pdfRef} className="space-y-6 text-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-950 p-4 rounded-2xl border border-gray-800 text-xs">
                  <div>
                    <span className="text-gray-500 block">Data</span>
                    <span className="text-gray-200 font-bold">{planoDetalhe.data || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Horário / Duração</span>
                    <span className="text-gray-200 font-bold">{planoDetalhe.hora || "-"} {planoDetalhe.volume ? `(${planoDetalhe.volume})` : ""}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Microciclo / Meso</span>
                    <span className="text-gray-200 font-bold">{planoDetalhe.microciclo || "-"} / {planoDetalhe.mesociclo || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Jogadores / Clima</span>
                    <span className="text-gray-200 font-bold">{planoDetalhe.jogadores || "-"} / {planoDetalhe.clima || "-"}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {planoDetalhe.objetivosEspecificos && (
                    <div>
                      <h4 className="font-bold text-gray-400 uppercase tracking-wider">Objetivos Específicos</h4>
                      <p className="text-gray-300 mt-1 bg-gray-950 p-3 rounded-xl border border-gray-800 font-medium">
                        {planoDetalhe.objetivosEspecificos}
                      </p>
                    </div>
                  )}

                  {planoDetalhe.material && (
                    <div>
                      <h4 className="font-bold text-gray-400 uppercase tracking-wider">Material Necessário</h4>
                      <p className="text-gray-300 mt-1 bg-gray-950 p-3 rounded-xl border border-gray-800 font-medium">
                        {planoDetalhe.material}
                      </p>
                    </div>
                  )}

                  {planoDetalhe.observacoes && (
                    <div>
                      <h4 className="font-bold text-gray-400 uppercase tracking-wider">Observações</h4>
                      <p className="text-gray-300 mt-1 bg-gray-950 p-3 rounded-xl border border-gray-800 font-medium">
                        {planoDetalhe.observacoes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-white text-sm border-l-4 border-orange-500 pl-3">Exercícios da Sessão</h4>
                  {Array.isArray(planoDetalhe.atividades) && planoDetalhe.atividades.length > 0 ? (
                    <div className="space-y-6">
                      {planoDetalhe.atividades.map((atv: AtividadePlano, idx: number) => (
                        <div key={idx} className="bg-gray-950 border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/80 pb-2">
                            <span className="font-bold text-orange-400 text-sm">
                              Exercício {idx + 1}: {atv.title || "Organização Técnica"}
                            </span>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-400 font-mono">
                              {atv.time && <span>⏱️ {atv.time}</span>}
                              {atv.players && <span>👥 {atv.players}</span>}
                              {atv.space && <span>📐 {atv.space}</span>}
                            </div>
                          </div>

                          {atv.image && (
                            <div className="rounded-xl overflow-hidden border border-gray-800 flex justify-center bg-gray-900 p-2">
                              <img src={atv.image} alt={`Prancheta ${idx + 1}`} className="max-h-96 w-auto object-contain rounded-lg shadow-lg" />
                            </div>
                          )}

                          {atv.specificObjective && (
                            <p className="text-xs text-gray-300">
                              <b className="text-orange-400">Objetivo do Exercício:</b> {atv.specificObjective}
                            </p>
                          )}

                          {atv.description && (
                            <p className="text-xs text-gray-400">
                              <b className="text-gray-300">Descrição Metodológica:</b> {atv.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Nenhum exercício com desenho tático registado neste plano.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-gray-800 bg-gray-900 flex justify-end shrink-0">
              <button
                onClick={() => setPlanoDetalhe(null)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-5 py-2 rounded-xl text-xs uppercase transition-colors"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}