"use client";

import { useEffect, useState } from "react";

interface Atleta {
  id: string;
  nomeCompleto: string;
  categoria: string;
  posicao?: string;
}

interface TreinoAgendado {
  id: string;
  titulo: string;
  categoria: string;
  data: string; // YYYY-MM-DD
  hora: string;
  local: string;
  professorConvidado?: string | null;
  confirmacoes: {
    id: string;
    atletaId: string;
    status: string;
  }[];
}

export default function ChamadaPage() {
  const [offsetSemanas, setOffsetSemanas] = useState(0);
  const [dataSelecionada, setDataSelecionada] = useState<string>("");
  const [treinosSemana, setTreinosSemana] = useState<TreinoAgendado[]>([]);
  const [treinoAtivoId, setTreinoAtivoId] = useState<string>("");

  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [presencas, setPresencas] = useState<{ [atletaId: string]: string }>({});
  const [carregando, setCarregando] = useState(true);
  const [salvandoId, setSalvandoId] = useState<string | null>(null);

  // Modal de Feedback
  const [modalFeedbackAberto, setModalFeedbackAberto] = useState(false);
  const [atletaAvaliado, setAtletaAvaliado] = useState<Atleta | null>(null);
  const [nota, setNota] = useState(5);
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const [comentario, setComentario] = useState("");
  const [salvandoFeedback, setSalvandoFeedback] = useState(false);
  const [mensagemFeedback, setMensagemFeedback] = useState("");

  const tagsDisponiveis = [
    "🔥 Grande Intensidade",
    "🎯 Excelente Finalização",
    "⚽ Boa Visão de Jogo / Passe",
    "🛡️ Forte Marcação e Cobertura",
    "🧠 Ótima Tomada de Decisão",
    "👏 Foco & Disciplina",
    "🧤 Ótima Atuação no Gol",
    "⚠️ Atenção ao Posicionamento",
  ];

  // Gera os 7 dias da semana (Segunda a Domingo)
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

  // Inicializa a data de hoje ou a primeira da semana
  useEffect(() => {
    if (diasSemana.length > 0 && !dataSelecionada) {
      const hojeIso = new Date().toISOString().split("T")[0];
      const hojeNaSemana = diasSemana.some((d) => d.iso === hojeIso);
      setDataSelecionada(hojeNaSemana ? hojeIso : diasSemana[0].iso);
    }
  }, [offsetSemanas]);

  // Carrega atletas matriculados
  useEffect(() => {
    async function carregarAtletas() {
      try {
        const res = await fetch("/api/atletas");
        if (res.ok) setAtletas(await res.json());
      } catch (err) {
        console.error("Erro ao carregar atletas:", err);
      }
    }
    carregarAtletas();
  }, []);

  // Carrega os treinos da semana selecionada
  useEffect(() => {
    async function carregarTreinosDaSemana() {
      try {
        setCarregando(true);
        const inicio = diasSemana[0].iso;
        const fim = diasSemana[6].iso;
        const res = await fetch(`/api/agenda?inicio=${inicio}&fim=${fim}`);
        if (res.ok) {
          const dados: TreinoAgendado[] = await res.json();
          setTreinosSemana(dados);
        }
      } catch (err) {
        console.error("Erro ao buscar agenda:", err);
      } finally {
        setCarregando(false);
      }
    }
    carregarTreinosDaSemana();
  }, [offsetSemanas]);

  // Filtra treinos agendados para a data ativa
  const treinosDoDia = treinosSemana.filter((t) => t.data === dataSelecionada);

  // Auto-seleciona o primeiro treino do dia caso o ativo não pertença a ele
  useEffect(() => {
    if (treinosDoDia.length > 0) {
      const aindaExiste = treinosDoDia.some((t) => t.id === treinoAtivoId);
      if (!aindaExiste) {
        setTreinoAtivoId(treinosDoDia[0].id);
      }
    } else {
      setTreinoAtivoId("");
      setPresencas({});
    }
  }, [dataSelecionada, treinosSemana]);

  // Carrega as presenças gravadas para o treino específico ativo
  useEffect(() => {
    if (!treinoAtivoId) return;

    async function carregarPresencas() {
      try {
        const res = await fetch(`/api/presenca?treinoId=${treinoAtivoId}`);
        if (res.ok) {
          const dados = await res.json();
          const mapa: { [atletaId: string]: string } = {};
          dados.forEach((p: any) => {
            mapa[p.atletaId] = p.status;
          });
          setPresencas(mapa);
        }
      } catch (err) {
        console.error("Erro ao buscar presenças salvas:", err);
      }
    }
    carregarPresencas();
  }, [treinoAtivoId]);

  const treinoAtual = treinosSemana.find((t) => t.id === treinoAtivoId);

  // Resposta informada pelo pai no portal
  const getConfirmacaoPais = (atletaId: string) => {
    if (!treinoAtual) return null;
    const conf = treinoAtual.confirmacoes.find((c) => c.atletaId === atletaId);
    return conf ? conf.status : null;
  };

  const handleMarcarPresenca = async (
    atletaId: string,
    novoStatus: "PRESENTE" | "JUSTIFICADA" | "FALTA"
  ) => {
    if (!treinoAtivoId) return;

    setSalvandoId(atletaId);
    setPresencas((prev) => ({ ...prev, [atletaId]: novoStatus }));

    try {
      await fetch("/api/presenca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treinoId: treinoAtivoId,
          atletaId,
          status: novoStatus,
        }),
      });
    } catch (err) {
      console.error("Erro ao salvar presença:", err);
    } finally {
      setSalvandoId(null);
    }
  };

  const abrirModalFeedback = (atleta: Atleta) => {
    setAtletaAvaliado(atleta);
    setNota(5);
    setTagsSelecionadas([]);
    setComentario("");
    setMensagemFeedback("");
    setModalFeedbackAberto(true);
  };

  const toggleTag = (tag: string) => {
    setTagsSelecionadas((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSalvarFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!atletaAvaliado || !treinoAtivoId) return;

    setSalvandoFeedback(true);
    setMensagemFeedback("");

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atletaId: atletaAvaliado.id,
          treinoId: treinoAtivoId,
          nota,
          tags: tagsSelecionadas,
          comentario,
          tipo: "INDIVIDUAL",
        }),
      });

      if (res.ok) {
        setMensagemFeedback("✓ Feedback registrado e disponível no portal dos pais!");
        setTimeout(() => {
          setModalFeedbackAberto(false);
          setSalvandoFeedback(false);
        }, 1200);
      } else {
        setMensagemFeedback("Erro ao registrar avaliação.");
        setSalvandoFeedback(false);
      }
    } catch {
      setMensagemFeedback("Erro de conexão.");
      setSalvandoFeedback(false);
    }
  };

  const diaAtivoObj = diasSemana.find((d) => d.iso === dataSelecionada);
  const tituloData = diaAtivoObj
    ? diaAtivoObj.dataObj.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* CABEÇALHO */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">Chamada & Avaliação</h1>
        <p className="text-gray-400 text-sm mt-1">
          Navegue pelas semanas, escolha o dia e marque a presença e o feedback técnico de cada atleta.
        </p>
      </div>

      {/* NAVEGAÇÃO DE DIAS DA SEMANA */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {/* Voltar Semana */}
          <button
            onClick={() => setOffsetSemanas((prev) => prev - 1)}
            title="Semana anterior"
            className="p-3 bg-gray-950 border border-gray-800 rounded-2xl text-gray-400 hover:text-white hover:border-gray-700 transition-all shrink-0"
          >
            ‹
          </button>

          {/* Cards dos Dias (Segunda a Domingo) */}
          <div className="flex items-center gap-2 flex-1 justify-between min-w-[620px]">
            {diasSemana.map((dia) => {
              const selecionado = dataSelecionada === dia.iso;
              const temTreinosNesteDia = treinosSemana.some((t) => t.data === dia.iso);

              return (
                <button
                  key={dia.iso}
                  onClick={() => setDataSelecionada(dia.iso)}
                  className={`flex-1 py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all relative ${
                    selecionado
                      ? "bg-orange-600 text-white shadow-xl shadow-orange-600/30 scale-105 border border-orange-400/40"
                      : "bg-gray-950/60 border border-gray-800/80 text-gray-400 hover:text-gray-200 hover:border-gray-700"
                  }`}
                >
                  <span className="text-[11px] font-bold tracking-wider">{dia.nome}</span>
                  <span className="text-2xl font-black mt-0.5 leading-none">{dia.numero}</span>
                  <span className="text-[10px] uppercase font-semibold opacity-70 mt-0.5">
                    {dia.mes}
                  </span>

                  {/* Ponto indicador de treino agendado */}
                  {temTreinosNesteDia && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        selecionado ? "bg-white" : "bg-orange-500 animate-pulse"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Avançar Semana */}
          <button
            onClick={() => setOffsetSemanas((prev) => prev + 1)}
            title="Próxima semana"
            className="p-3 bg-gray-950 border border-gray-800 rounded-2xl text-gray-400 hover:text-white hover:border-gray-700 transition-all shrink-0"
          >
            ›
          </button>
        </div>
      </div>

      {/* BARRA DO DIA E SELEÇÃO DE HORÁRIOS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900/60 border border-gray-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm capitalize">
          <span className="text-lg">📅</span>
          <span>{tituloData}</span>
        </div>

        {treinosDoDia.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Horários:
            </span>
            {treinosDoDia.map((t) => (
              <button
                key={t.id}
                onClick={() => setTreinoAtivoId(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  treinoAtivoId === t.id
                    ? "bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30"
                    : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                }`}
              >
                ⏰ {t.hora} - {t.local}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ESTADO DO TREINO SELECIONADO OU AVISO DE DIA LIVRE */}
      {carregando ? (
        <div className="p-12 text-center text-gray-500 bg-gray-900 border border-gray-800 rounded-3xl">
          Carregando informações da sessão...
        </div>
      ) : treinosDoDia.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-gray-900/40 border border-gray-800 rounded-3xl space-y-2">
          <p className="text-base font-bold text-gray-300">Nenhum treino agendado para este dia.</p>
          <p className="text-xs text-gray-500">
            Selecione outro dia com ponto laranja no topo ou agende um treino no menu <b>Treinos &gt; Agendamento</b>.
          </p>
        </div>
      ) : !treinoAtual ? null : (
        <div className="space-y-4">
          {/* BANNER DE DETALHES DA SESSÃO ATIVA */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-950 border border-gray-800 p-4 rounded-2xl text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                {treinoAtual.hora} • {treinoAtual.local}
              </span>
              <span className="text-gray-300 font-medium">Categoria: {treinoAtual.categoria}</span>
              {treinoAtual.professorConvidado && (
                <span className="text-purple-400 font-bold">
                  ⭐ Professor Convidado: {treinoAtual.professorConvidado}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-gray-400 font-bold">
              <span>
                Presentes: <b className="text-emerald-400">{Object.values(presencas).filter((v) => v === "PRESENTE").length}</b>
              </span>
              <span>
                Faltas: <b className="text-red-400">{Object.values(presencas).filter((v) => v === "FALTA").length}</b>
              </span>
            </div>
          </div>

          {/* LISTA DE ATLETAS */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 bg-gray-950/60 border-b border-gray-800 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>Atleta & Confirmação dos Pais</span>
              <span>Status da Presença & Avaliação</span>
            </div>

            <div className="divide-y divide-gray-800/80">
              {atletas.map((atleta) => {
                const statusAtual = presencas[atleta.id];
                const avisoPais = getConfirmacaoPais(atleta.id);
                const salvando = salvandoId === atleta.id;

                return (
                  <div
                    key={atleta.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-lg">
                        ⚽
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{atleta.nomeCompleto}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] font-bold uppercase text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                            {atleta.categoria}
                          </span>

                          {/* Aviso Prévio dos Pais */}
                          {avisoPais === "CONFIRMADO" ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              ✓ Confirmado pelo pai
                            </span>
                          ) : avisoPais === "RECUSADO" ? (
                            <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                              ✕ Pai avisou que não vai
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-gray-500 italic">
                              Sem confirmação prévia
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Botões de Presença */}
                      <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
                        <button
                          disabled={salvando}
                          onClick={() => handleMarcarPresenca(atleta.id, "PRESENTE")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            statusAtual === "PRESENTE"
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          Presente
                        </button>
                        <button
                          disabled={salvando}
                          onClick={() => handleMarcarPresenca(atleta.id, "JUSTIFICADA")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            statusAtual === "JUSTIFICADA"
                              ? "bg-yellow-600 text-white shadow-md shadow-yellow-600/20"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          Justificada
                        </button>
                        <button
                          disabled={salvando}
                          onClick={() => handleMarcarPresenca(atleta.id, "FALTA")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            statusAtual === "FALTA"
                              ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          Falta
                        </button>
                      </div>

                      {/* Botão de Avaliação Individual */}
                      <button
                        onClick={() => abrirModalFeedback(atleta)}
                        className="flex items-center gap-1.5 bg-gray-800 hover:bg-orange-600 text-gray-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-gray-700/60 shadow-sm"
                        title="Enviar Feedback Desta Sessão"
                      >
                        <span>💬</span>
                        <span>Avaliar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE FEEDBACK INDIVIDUAL */}
      {modalFeedbackAberto && atletaAvaliado && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  Avaliação da Sessão ({treinoAtual?.data})
                </span>
                <h2 className="text-lg font-black text-white">
                  ⚽ {atletaAvaliado.nomeCompleto} ({atletaAvaliado.categoria})
                </h2>
              </div>
              <button
                onClick={() => setModalFeedbackAberto(false)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {mensagemFeedback && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center rounded-xl">
                {mensagemFeedback}
              </div>
            )}

            <form onSubmit={handleSalvarFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">
                  Conceito do Treino
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <button
                      type="button"
                      key={estrela}
                      onClick={() => setNota(estrela)}
                      className={`text-2xl transition-transform hover:scale-125 focus:outline-none ${
                        estrela <= nota ? "opacity-100" : "opacity-30 grayscale"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                  <span className="text-xs text-orange-400 font-bold ml-2">
                    {nota}/5 {nota === 5 ? "(Excelente)" : nota === 4 ? "(Muito Bom)" : "(Regular)"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">
                  Destaques (Tags Rápidas)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tagsDisponiveis.map((tag) => {
                    const ativa = tagsSelecionadas.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-xl font-medium border transition-all ${
                          ativa
                            ? "bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/25"
                            : "bg-gray-950 text-gray-400 border-gray-800 hover:text-gray-200 hover:border-gray-700"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Mensagem para o Responsável
                </label>
                <textarea
                  rows={3}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Ex: Excelente participação na marcação e foco nos exercícios..."
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl p-3 text-xs text-gray-200 outline-none resize-none placeholder-gray-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalFeedbackAberto(false)}
                  className="flex-1 bg-gray-800 text-gray-300 font-bold py-2.5 rounded-xl text-xs uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoFeedback}
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase shadow-lg shadow-orange-600/20 disabled:opacity-50"
                >
                  {salvandoFeedback ? "Salvando..." : "Salvar Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}