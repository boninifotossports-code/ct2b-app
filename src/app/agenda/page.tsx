"use client";

import { useEffect, useState } from "react";

interface TreinoSlot {
  id: string;
  titulo: string;
  categoria: string;
  data: string;
  hora: string;
  local: string;
  vagasTotais: number;
  bloqueado: boolean;
  professorConvidado?: string | null;
  recorrente: boolean;
  grupoRecorrenciaId?: string | null;
  confirmacoes: {
    id: string;
    status: string;
    atleta: { id: string; nomeCompleto: string };
  }[];
}

export default function AgendaPage() {
  const [dataSelecionada, setDataSelecionada] = useState<string>("");
  const [offsetSemanas, setOffsetSemanas] = useState(0);
  const [treinos, setTreinos] = useState<TreinoSlot[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [treinoEditando, setTreinoEditando] = useState<TreinoSlot | null>(null);

  const [formHora, setFormHora] = useState("08:00");
  const [formLocal, setFormLocal] = useState("Campo Principal");
  const [formCategoria, setFormCategoria] = useState("Geral");
  const [formVagas, setFormVagas] = useState(12);
  const [formConvidado, setFormConvidado] = useState("");
  const [formRecorrente, setFormRecorrente] = useState(false);
  const [formSemanas, setFormSemanas] = useState(4);

  const [editEscopo, setEditEscopo] = useState<"APENAS_ESTE" | "TODOS_RECORRENTES">("APENAS_ESTE");
  const [editLocal, setEditLocal] = useState("");
  const [editHora, setEditHora] = useState("");
  const [editVagas, setEditVagas] = useState(12);
  const [editConvidado, setEditConvidado] = useState("");
  const [editBloqueado, setEditBloqueado] = useState(false);

  const getDiasSemana = (offset = 0) => {
    const hoje = new Date();
    const diaAtual = hoje.getDay();
    const diffParaSegunda = diaAtual === 0 ? -6 : 1 - diaAtual;

    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate() + diffParaSegunda + offset * 7);

    const dias = [];
    const nomesSemana = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];

    for (let i = 0; i < 7; i++) {
      const d = new Date(segunda);
      d.setDate(segunda.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const diaNum = d.getDate();
      const mesAbrev = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

      dias.push({
        nome: nomesSemana[i],
        numero: diaNum,
        mes: mesAbrev,
        iso,
        dataObj: d,
      });
    }
    return dias;
  };

  const diasSemana = getDiasSemana(offsetSemanas);

  useEffect(() => {
    if (diasSemana.length > 0 && !dataSelecionada) {
      setDataSelecionada(diasSemana[0].iso);
    }
  }, [offsetSemanas]);

  const carregarTreinos = async () => {
    try {
      setCarregando(true);
      const inicio = diasSemana[0].iso;
      const fim = diasSemana[6].iso;
      const res = await fetch(`/api/agenda?inicio=${inicio}&fim=${fim}`);
      if (res.ok) {
        const data = await res.json();
        setTreinos(data);
      }
    } catch (err) {
      console.error("Erro ao buscar agenda:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (diasSemana.length > 0) {
      carregarTreinos();
    }
  }, [offsetSemanas]);

  const treinosDoDia = treinos.filter((t) => t.data === dataSelecionada);

  const diaAtivoObj = diasSemana.find((d) => d.iso === dataSelecionada);
  const tituloDia = diaAtivoObj
    ? diaAtivoObj.dataObj.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const handleSalvarNovo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: dataSelecionada,
          hora: formHora,
          local: formLocal,
          categoria: formCategoria,
          vagasTotais: formVagas,
          professorConvidado: formConvidado,
          recorrente: formRecorrente,
          semanasRecorrencia: formSemanas,
        }),
      });

      if (res.ok) {
        setModalNovoAberto(false);
        setFormConvidado("");
        setFormRecorrente(false);
        carregarTreinos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const abrirEdicao = (treino: TreinoSlot) => {
    setTreinoEditando(treino);
    setEditLocal(treino.local);
    setEditHora(treino.hora);
    setEditVagas(treino.vagasTotais);
    setEditConvidado(treino.professorConvidado || "");
    setEditBloqueado(treino.bloqueado);
    setEditEscopo("APENAS_ESTE");
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!treinoEditando) return;

    try {
      const res = await fetch("/api/agenda", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: treinoEditando.id,
          local: editLocal,
          hora: editHora,
          vagasTotais: editVagas,
          professorConvidado: editConvidado,
          bloqueado: editBloqueado,
          escopoEdicao: editEscopo,
        }),
      });

      if (res.ok) {
        setTreinoEditando(null);
        carregarTreinos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Agendamento & Calendário</h1>
          <p className="text-gray-400 text-sm mt-1">Controle de sessões, vagas disponíveis e escala semanal.</p>
        </div>

        <button
          onClick={() => setModalNovoAberto(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-600/20"
        >
          <span className="text-base">➕</span>
          Novo Horário
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setOffsetSemanas((prev) => prev - 1)}
            title="Semana anterior"
            className="p-3 bg-gray-950 border border-gray-800 rounded-2xl text-gray-400 hover:text-white hover:border-gray-700 transition-all shrink-0"
          >
            ‹
          </button>

          <div className="flex items-center gap-2 flex-1 justify-between min-w-[620px]">
            {diasSemana.map((dia) => {
              const selecionado = dataSelecionada === dia.iso;
              return (
                <button
                  key={dia.iso}
                  onClick={() => setDataSelecionada(dia.iso)}
                  className={`flex-1 py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    selecionado
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-105 border border-indigo-400/40"
                      : "bg-gray-950/60 border border-gray-800/80 text-gray-400 hover:text-gray-200 hover:border-gray-700"
                  }`}
                >
                  <span className="text-[11px] font-bold tracking-wider">{dia.nome}</span>
                  <span className="text-2xl font-black mt-0.5 leading-none">{dia.numero}</span>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 mt-0.5">{dia.mes}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setOffsetSemanas((prev) => prev + 1)}
            title="Próxima semana"
            className="p-3 bg-gray-950 border border-gray-800 rounded-2xl text-gray-400 hover:text-white hover:border-gray-700 transition-all shrink-0"
          >
            ›
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-white font-bold text-sm capitalize px-1">
        <span className="text-lg">📅</span>
        <span>{tituloDia}</span>
      </div>

      {carregando ? (
        <div className="p-12 text-center text-gray-500 bg-gray-900/40 border border-gray-800 rounded-3xl">Carregando horários da semana...</div>
      ) : treinosDoDia.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-gray-900/40 border border-gray-800 rounded-3xl">Nenhum treino agendado para este dia.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {treinosDoDia.map((treino) => {
            const confirmadosCount = treino.confirmacoes.filter((c) => c.status === "CONFIRMADO").length;
            const vagasLivres = treino.vagasTotais - confirmadosCount;
            const lotado = vagasLivres <= 0;

            return (
              <div
                key={treino.id}
                onClick={() => abrirEdicao(treino)}
                className={`cursor-pointer rounded-2xl p-4 flex flex-col justify-between transition-all border shadow-md hover:scale-[1.02] ${
                  treino.bloqueado
                    ? "bg-gray-900/80 border-gray-800 opacity-60 text-gray-500"
                    : lotado
                    ? "bg-red-950/20 border-red-800/40 text-red-300"
                    : "bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500 text-emerald-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-white">{treino.hora}</span>
                    {treino.recorrente && <span className="text-[10px] text-gray-400" title="Recorrente">🔄</span>}
                  </div>

                  <p className="text-[11px] font-bold mt-1 text-gray-300 truncate">{treino.local}</p>

                  {treino.professorConvidado && (
                    <span className="mt-1 inline-block text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-bold truncate max-w-full">
                      Prof. {treino.professorConvidado}
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-center justify-between text-[11px] font-bold">
                  {treino.bloqueado ? (
                    <span className="text-gray-500">🚫 BLOQUEADO</span>
                  ) : lotado ? (
                    <span className="text-red-400 font-extrabold">LOTADO (0 VAGAS)</span>
                  ) : (
                    <span className="text-emerald-400">{vagasLivres}/{treino.vagasTotais} VAGAS</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white border-l-4 border-orange-500 pl-3">Novo Agendamento de Treino</h2>

            <form onSubmit={handleSalvarNovo} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={formHora}
                    onChange={(e) => setFormHora(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Vagas Totais</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formVagas}
                    onChange={(e) => setFormVagas(parseInt(e.target.value, 10))}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Local do Treino</label>
                <input
                  type="text"
                  required
                  value={formLocal}
                  onChange={(e) => setFormLocal(e.target.value)}
                  placeholder="Ex: Campo 1, Quadra Coberta"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Professor Convidado (Opcional)</label>
                <input
                  type="text"
                  value={formConvidado}
                  onChange={(e) => setFormConvidado(e.target.value)}
                  placeholder="Ex: Treinador Ricardo"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                />
              </div>

              <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-200">
                  <input
                    type="checkbox"
                    checked={formRecorrente}
                    onChange={(e) => setFormRecorrente(e.target.checked)}
                    className="accent-orange-500"
                  />
                  <span>Repetir semanalmente (Treino Recorrente)</span>
                </label>

                {formRecorrente && (
                  <div className="pt-2 border-t border-gray-800 text-xs text-gray-400">
                    <span>Criar para as próximas </span>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={formSemanas}
                      onChange={(e) => setFormSemanas(parseInt(e.target.value, 10))}
                      className="w-16 bg-gray-900 border border-gray-700 px-2 py-1 rounded text-white text-center font-bold"
                    />
                    <span> semanas</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2.5 rounded-xl text-xs uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase"
                >
                  Agendar Treino
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {treinoEditando && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white border-l-4 border-orange-500 pl-3">Editar Treino</h2>

            <form onSubmit={handleSalvarEdicao} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={editHora}
                    onChange={(e) => setEditHora(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Vagas Totais</label>
                  <input
                    type="number"
                    min={1}
                    value={editVagas}
                    onChange={(e) => setEditVagas(parseInt(e.target.value, 10))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Local</label>
                <input
                  type="text"
                  required
                  value={editLocal}
                  onChange={(e) => setEditLocal(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Professor Convidado (Somente este dia)</label>
                <input
                  type="text"
                  value={editConvidado}
                  onChange={(e) => setEditConvidado(e.target.value)}
                  placeholder="Nome do convidado"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-red-400 p-2 bg-red-950/20 border border-red-900/30 rounded-xl">
                <input
                  type="checkbox"
                  checked={editBloqueado}
                  onChange={(e) => setEditBloqueado(e.target.checked)}
                  className="accent-red-500"
                />
                <span>Bloquear horário</span>
              </label>

              {treinoEditando.recorrente && (
                <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl space-y-2">
                  <p className="text-xs font-bold uppercase text-orange-500">Escopo da Edição:</p>
                  <label className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer">
                    <input
                      type="radio"
                      name="escopo"
                      checked={editEscopo === "APENAS_ESTE"}
                      onChange={() => setEditEscopo("APENAS_ESTE")}
                      className="accent-orange-500"
                    />
                    <span>Alterar apenas este treino desta semana</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer">
                    <input
                      type="radio"
                      name="escopo"
                      checked={editEscopo === "TODOS_RECORRENTES"}
                      onChange={() => setEditEscopo("TODOS_RECORRENTES")}
                      className="accent-orange-500"
                    />
                    <span>Alterar este e todos os treinos recorrentes futuros</span>
                  </label>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTreinoEditando(null)}
                  className="flex-1 bg-gray-800 text-gray-300 font-bold py-2.5 rounded-xl text-xs uppercase"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}