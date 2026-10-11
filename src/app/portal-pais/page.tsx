"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Atleta {
  id: string;
  nomeCompleto: string;
  categoria: string;
}

interface TreinoSemana {
  id: string;
  titulo: string;
  categoria: string;
  data: string;
  hora: string;
  local: string;
  vagasTotais: number;
  bloqueado: boolean;
  professorConvidado?: string | null;
  confirmacoes: {
    id: string;
    atletaId: string;
    status: string;
  }[];
}

interface FeedbackItem {
  id: string;
  nota: number;
  tags: string;
  comentario: string;
  data: string;
  atleta: {
    id: string;
    nomeCompleto: string;
    categoria: string;
  };
}

export default function PortalPaisPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [filhos, setFilhos] = useState<Atleta[]>([]);
  const [treinosSemana, setTreinosSemana] = useState<TreinoSemana[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  const getIntervaloSemanaAtual = () => {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;

    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate() + diffSegunda);

    const domingo = new Date(segunda);
    domingo.setDate(segunda.getDate() + 6);

    return {
      inicio: segunda.toISOString().split("T")[0],
      fim: domingo.toISOString().split("T")[0],
    };
  };

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const rawUser = localStorage.getItem("ct2b_user");
      if (!rawUser) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(rawUser);
      setUsuario(userData);
      const listaFilhos = userData.atletas || [];
      setFilhos(listaFilhos);

      const { inicio, fim } = getIntervaloSemanaAtual();

      const resAgenda = await fetch(`/api/agenda?inicio=${inicio}&fim=${fim}`);
      if (resAgenda.ok) {
        const dadosAgenda = await resAgenda.json();
        setTreinosSemana(dadosAgenda);
      }

      if (listaFilhos.length > 0) {
        const ids = listaFilhos.map((f: Atleta) => f.id).join(",");
        const resFeedbacks = await fetch(`/api/feedbacks?atletaIds=${ids}`);
        if (resFeedbacks.ok) {
          const dadosFeedbacks = await resFeedbacks.json();
          setFeedbacks(dadosFeedbacks);
        }
      }
    } catch (erro) {
      console.error("Erro ao carregar dados do portal:", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const getStatusConfirmacao = (treinoId: string, atletaId: string) => {
    const treino = treinosSemana.find((t) => t.id === treinoId);
    if (!treino) return null;
    const conf = treino.confirmacoes.find((c) => c.atletaId === atletaId);
    return conf ? conf.status : null;
  };

  const confirmarIda = async (
    treinoId: string,
    atletaId: string,
    novoStatus: "CONFIRMADO" | "RECUSADO"
  ) => {
    try {
      setProcessandoId(`${treinoId}-${atletaId}`);
      const res = await fetch("/api/agenda/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treinoId,
          atletaId,
          status: novoStatus,
        }),
      });

      if (res.ok) {
        setTreinosSemana((prev) =>
          prev.map((treino) => {
            if (treino.id !== treinoId) return treino;

            const confirmacoesFiltradas = treino.confirmacoes.filter(
              (c) => c.atletaId !== atletaId
            );

            return {
              ...treino,
              confirmacoes: [
                ...confirmacoesFiltradas,
                { id: `temp-${Date.now()}`, atletaId, status: novoStatus },
              ],
            };
          })
        );
      }
    } catch (erro) {
      console.error("Erro ao confirmar presença:", erro);
    } finally {
      setProcessandoId(null);
    }
  };

  const handleLogout = () => {
    document.cookie = "ct2b_session=; path=/; max-age=0;";
    localStorage.removeItem("ct2b_user");
    router.push("/login");
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        A carregar dados do portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
            Área do Responsável
          </span>
          <h1 className="text-2xl font-black text-white mt-2">
            Olá, {usuario?.nome || "Responsável"}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Acompanhe a agenda semanal e as avaliações pedagógicas dos seus atletas.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
        >
          <span>Terminar Sessão</span>
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📢</span>
            <h2 className="text-lg font-bold text-white">Treinos Desta Semana</h2>
          </div>
          <span className="text-[11px] text-orange-400 font-bold uppercase tracking-wider">
            Confirmação Necessária
          </span>
        </div>

        {treinosSemana.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-950/60 rounded-2xl border border-gray-800/80">
            Nenhum treino agendado para a presente semana.
          </div>
        ) : (
          <div className="space-y-3">
            {treinosSemana.map((treino) => (
              <div
                key={treino.id}
                className="p-5 bg-gray-950 border border-gray-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{treino.hora}</span>
                    <span className="text-xs text-gray-400 font-mono">• {treino.data}</span>
                    <span className="text-xs bg-gray-900 border border-gray-800 px-2 py-0.5 rounded text-gray-300 font-bold">
                      {treino.local}
                    </span>
                  </div>

                  {treino.professorConvidado && (
                    <p className="text-xs text-purple-400 font-bold mt-1.5 flex items-center gap-1">
                      <span>⭐</span>
                      <span>Professor Convidado: {treino.professorConvidado}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                  {filhos.map((atleta) => {
                    const status = getStatusConfirmacao(treino.id, atleta.id);
                    const emProcesso = processandoId === `${treino.id}-${atleta.id}`;

                    return (
                      <div
                        key={atleta.id}
                        className="flex items-center gap-2 bg-gray-900 p-2 rounded-xl border border-gray-800"
                      >
                        <span className="text-xs text-gray-300 font-semibold px-1">
                          {atleta.nomeCompleto}:
                        </span>

                        <button
                          disabled={emProcesso}
                          onClick={() => confirmarIda(treino.id, atleta.id, "CONFIRMADO")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                            status === "CONFIRMADO"
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                              : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                          }`}
                        >
                          {status === "CONFIRMADO" ? "✓ Vai" : "Confirmar"}
                        </button>

                        <button
                          disabled={emProcesso}
                          onClick={() => confirmarIda(treino.id, atleta.id, "RECUSADO")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                            status === "RECUSADO"
                              ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                              : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                          }`}
                        >
                          {status === "RECUSADO" ? "✕ Não vai" : "Não vai"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <h2 className="text-lg font-bold text-white">Evolução & Boletim Técnico</h2>
          </div>
          <span className="text-[11px] text-gray-400 font-semibold">
            Feedback Exclusivo do Treinador
          </span>
        </div>

        {feedbacks.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-950/60 rounded-2xl border border-gray-800/80 text-xs">
            Nenhuma avaliação registada para os seus atletas até ao momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((item) => {
              const tagsArray = item.tags ? item.tags.split(",") : [];

              return (
                <div
                  key={item.id}
                  className="bg-gray-950 border border-gray-800 rounded-2xl p-5 space-y-3 hover:border-gray-700 transition-colors shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">⚽ {item.atleta?.nomeCompleto}</h3>
                      <span className="text-[10px] font-bold text-orange-400 uppercase">
                        {item.atleta?.categoria}
                      </span>
                    </div>

                    <div className="flex items-center text-sm" title={`Conceito ${item.nota}/5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={i < (item.nota || 5) ? "opacity-100" : "opacity-20 grayscale"}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  {tagsArray.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tagsArray.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-orange-600/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-lg font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.comentario && (
                    <p className="text-xs text-gray-300 bg-gray-900/80 p-3 rounded-xl border border-gray-800/80 leading-relaxed italic">
                      "{item.comentario}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-gray-800/60 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <span>Comissão Técnica CT 2B</span>
                    <span>{new Date(item.data).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}