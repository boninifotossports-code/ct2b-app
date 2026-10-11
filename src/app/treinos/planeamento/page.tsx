"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PlaneamentoAvancado() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdUrl = searchParams.get("editId");

  const [planoId, setPlanoId] = useState<string | null>(editIdUrl);
  const [todosPlanos, setTodosPlanos] = useState<any[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [carregandoPlano, setCarregandoPlano] = useState(false);

  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [atividades, setAtividades] = useState<any[]>([]);
  const exportRef = useRef<HTMLDivElement>(null);

  const [cabecalho, setCabecalho] = useState({
    numeroPlano: "1",
    jogadores: "26",
    microciclo: "1",
    mesociclo: "1",
    periodo: "Competitivo",
    data: "2026-10-10",
    hora: "16:30",
    clima: "Sol",
    volume: "90 min",
    material: "Fita\nCones\nBolas\nColetes",
    objetivosGerais: "Movimentação das linhas de marcação\n(balanço, contenção e cobertura)\nFinalização e posse",
    objetivosEspecificos: "Contenção e cobertura\nFinalização\nRelações em campo",
    observacoes: "ATIVIDADES ESPELHADAS",
  });

  const carregarListaPlanos = async () => {
    try {
      const res = await fetch("/api/planos");
      if (res.ok) {
        const data = await res.json();
        setTodosPlanos(data);
      }
    } catch (err) {
      console.error("Erro ao carregar lista de planos:", err);
    }
  };

  const carregarPlanoPorId = async (id: string) => {
    try {
      setCarregandoPlano(true);
      const res = await fetch(`/api/planos?id=${id}`);
      if (res.ok) {
        const plano = await res.json();
        setPlanoId(plano.id);
        setCabecalho({
          numeroPlano: plano.numeroPlano ? String(plano.numeroPlano) : "1",
          jogadores: plano.jogadores || "",
          microciclo: plano.microciclo || "",
          mesociclo: plano.mesociclo || "",
          periodo: plano.periodo || "",
          data: plano.data || "",
          hora: plano.hora || "",
          clima: plano.clima || "",
          volume: plano.volume || "",
          material: plano.material || "",
          objetivosGerais: plano.objetivosGerais || "",
          objetivosEspecificos: plano.objetivosEspecificos || "",
          observacoes: plano.observacoes || "",
        });

        let atvs = [];
        if (Array.isArray(plano.atividades)) {
          atvs = plano.atividades;
        } else if (typeof plano.atividades === "string") {
          try {
            atvs = JSON.parse(plano.atividades);
          } catch {
            atvs = [];
          }
        }
        setAtividades(atvs);
      }
    } catch (err) {
      console.error("Erro ao carregar plano:", err);
    } finally {
      setCarregandoPlano(false);
    }
  };

  useEffect(() => {
    carregarListaPlanos();
  }, []);

  useEffect(() => {
    if (editIdUrl) {
      carregarPlanoPorId(editIdUrl);
    }
  }, [editIdUrl]);

  const trocarDePlano = (novoId: string) => {
    if (!novoId) return;
    router.push(`/treinos/planeamento?editId=${novoId}`);
  };

  const planoIndexAtual = todosPlanos.findIndex((p) => p.id === planoId);

  const irParaAnterior = () => {
    if (planoIndexAtual > 0) {
      trocarDePlano(todosPlanos[planoIndexAtual - 1].id);
    }
  };

  const irParaProximo = () => {
    if (planoIndexAtual >= 0 && planoIndexAtual < todosPlanos.length - 1) {
      trocarDePlano(todosPlanos[planoIndexAtual + 1].id);
    }
  };

  const handleCabecalho = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCabecalho({ ...cabecalho, [e.target.name]: e.target.value });
  };

  const limparPlano = () => {
    if (confirm("Deseja criar um novo plano limpo?")) {
      setPlanoId(null);
      setAtividades([]);
      const proxNumero =
        todosPlanos.length > 0
          ? Math.max(...todosPlanos.map((p) => p.numeroPlano || 0)) + 1
          : 1;

      setCabecalho({
        numeroPlano: String(proxNumero),
        jogadores: "26",
        microciclo: "1",
        mesociclo: "1",
        periodo: "Competitivo",
        data: new Date().toISOString().split("T")[0],
        hora: "16:30",
        clima: "Sol",
        volume: "90 min",
        material: "",
        objetivosGerais: "",
        objetivosEspecificos: "",
        observacoes: "ATIVIDADES ESPELHADAS",
      });
      router.push("/treinos/planeamento");
    }
  };

  const salvarPlanoNoBanco = async () => {
    try {
      setSalvando(true);
      const res = await fetch("/api/planos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: planoId,
          numeroPlano: cabecalho.numeroPlano,
          jogadores: cabecalho.jogadores,
          microciclo: cabecalho.microciclo,
          mesociclo: cabecalho.mesociclo,
          periodo: cabecalho.periodo,
          data: cabecalho.data,
          hora: cabecalho.hora,
          clima: cabecalho.clima,
          volume: cabecalho.volume,
          material: cabecalho.material,
          objetivosGerais: cabecalho.objetivosGerais,
          objetivosEspecificos: cabecalho.objetivosEspecificos,
          observacoes: cabecalho.observacoes,
          atividades: atividades,
        }),
      });

      if (res.ok) {
        const salvo = await res.json();
        setPlanoId(salvo.id);
        alert(`Plano nº ${salvo.numeroPlano} guardado com sucesso!`);
        carregarListaPlanos();
        router.push(`/treinos/planeamento?editId=${salvo.id}`);
      } else {
        alert("Erro ao guardar o plano.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha de comunicação.");
    } finally {
      setSalvando(false);
    }
  };

  const removerAtividade = (idxParaRemover: number) => {
    if (confirm("Remover este exercício do treino?")) {
      setAtividades(atividades.filter((_, idx) => idx !== idxParaRemover));
    }
  };

  const exportarPDF = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/jpeg", 0.9);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text(
      "Desenvolvido por AB Labs | CT 2B",
      14,
      pdf.internal.pageSize.getHeight() - 8
    );

    pdf.save(`Treino_CT2B_N${cabecalho.numeroPlano}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col">
      {/* BARRA SUPERIOR FIXA */}
      <div className="bg-white border-b border-gray-300 px-6 py-3 flex flex-wrap justify-between items-center sticky top-0 z-10 shadow-sm gap-4">
        
        {/* NÚMERO DO PLANO E NAVEGADOR ENTRE PLANOS */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
              Plano de Treino
            </p>
            <div className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              Treino nº
              <input
                type="text"
                name="numeroPlano"
                value={cabecalho.numeroPlano}
                onChange={handleCabecalho}
                className="w-12 bg-transparent outline-none border-b border-dashed border-gray-400 focus:border-blue-500 text-center"
              />
            </div>
          </div>

          {/* BARRINHA DE NAVEGAÇÃO DE PLANOS SALVOS */}
          {todosPlanos.length > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 p-1 rounded-lg">
              <button
                onClick={irParaAnterior}
                disabled={planoIndexAtual <= 0}
                title="Plano Anterior"
                className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
              >
                ◀ Ant
              </button>

              <select
                value={planoId || ""}
                onChange={(e) => trocarDePlano(e.target.value)}
                className="bg-white border border-gray-300 text-xs rounded px-2 py-1 font-semibold text-gray-700 outline-none"
              >
                <option value="">-- Alternar Plano --</option>
                {todosPlanos.map((p) => (
                  <option key={p.id} value={p.id}>
                    Plano #{p.numeroPlano} ({p.data || "Sem data"})
                  </option>
                ))}
              </select>

              <button
                onClick={irParaProximo}
                disabled={planoIndexAtual === -1 || planoIndexAtual >= todosPlanos.length - 1}
                title="Próximo Plano"
                className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
              >
                Próx ▶
              </button>
            </div>
          )}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={limparPlano}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-bold rounded shadow-sm hover:bg-gray-50 transition-colors uppercase"
          >
            NOVO PLANO
          </button>

          <button
            onClick={salvarPlanoNoBanco}
            disabled={salvando}
            className="bg-[#15803d] hover:bg-green-700 text-white px-5 py-2 text-xs font-bold rounded shadow transition-colors uppercase disabled:opacity-50"
          >
            {salvando ? "A GUARDAR..." : "GUARDAR PLANO"}
          </button>

          <button
            onClick={exportarPDF}
            className="bg-[#0056b3] text-white px-5 py-2 text-xs font-bold rounded shadow hover:bg-blue-800 transition-colors uppercase"
          >
            EXPORTAR PDF
          </button>
        </div>
      </div>

      {carregandoPlano && (
        <div className="bg-orange-50 border-b border-orange-200 text-orange-700 px-6 py-1.5 text-xs font-semibold text-center">
          A carregar plano e exercícios...
        </div>
      )}

      {/* CORPO DA SESSÃO */}
      <div className="max-w-6xl mx-auto w-full p-6 space-y-6">
        
        {/* INFORMAÇÕES DA SESSÃO */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-[#e9ecef] border-b border-gray-300 px-4 py-2 font-bold text-gray-600 text-base">
            Informações da Sessão
          </div>
          <div className="p-0 text-sm">
            <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50/50">
              <div className="border-r border-gray-200 p-3 flex items-center">
                <span className="font-bold mr-2 text-gray-700">Nº Jogadores</span>
                <input
                  type="text"
                  name="jogadores"
                  value={cabecalho.jogadores}
                  onChange={handleCabecalho}
                  className="flex-1 bg-transparent outline-none focus:bg-white px-1 rounded"
                />
              </div>
              <div className="border-r border-gray-200 p-3 flex items-center">
                <span className="font-bold mr-2 text-gray-700">Microciclo</span>
                <input
                  type="text"
                  name="microciclo"
                  value={cabecalho.microciclo}
                  onChange={handleCabecalho}
                  className="flex-1 bg-transparent outline-none focus:bg-white px-1 rounded"
                />
              </div>
              <div className="border-r border-gray-200 p-3 flex items-center">
                <span className="font-bold mr-2 text-gray-700">Mesociclo</span>
                <input
                  type="text"
                  name="mesociclo"
                  value={cabecalho.mesociclo}
                  onChange={handleCabecalho}
                  className="flex-1 bg-transparent outline-none focus:bg-white px-1 rounded"
                />
              </div>
              <div className="p-3 flex items-center">
                <span className="font-bold mr-2 text-gray-700">Período</span>
                <input
                  type="text"
                  name="periodo"
                  value={cabecalho.periodo}
                  onChange={handleCabecalho}
                  className="flex-1 bg-transparent outline-none focus:bg-white px-1 rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 bg-white">
              <div className="border-r border-gray-200 p-3 flex items-center">
                <span className="font-bold mr-2 text-gray-700">Data</span>
                <input
                  type="date"
                  name="data"
                  value={cabecalho.data}
                  onChange={handleCabecalho}
                  className="flex-1 bg-transparent outline-none text-gray-600 focus:bg-blue-50 px-1 rounded"
                />
              </div>
              <div className="border-r border-gray-200 p-3 flex items-center">
                <span className="font-bold mr-2 text-gray-700">Hora</span>
                <input
                  type="time"
                  name="hora"
                  value={cabecalho.hora}
                  onChange={handleCabecalho}
                  className="flex-1 bg-transparent outline-none text-gray-600 focus:bg-blue-50 px-1 rounded"
                />
              </div>
              <div className="border-r border-gray-200 p-3 flex items-center">
                <span className="font-bold mr-2 text-gray-700">Clima</span>
                <input
                  type="text"
                  name="clima"
                  value={cabecalho.clima}
                  onChange={handleCabecalho}
                  className="flex-1 bg-transparent outline-none focus:bg-blue-50 px-1 rounded"
                />
              </div>
              <div className="p-3 flex items-center">
                <span className="font-bold mr-2 text-gray-700">Volume</span>
                <input
                  type="text"
                  name="volume"
                  value={cabecalho.volume}
                  onChange={handleCabecalho}
                  className="flex-1 bg-transparent outline-none focus:bg-blue-50 px-1 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MATERIAL E OBJETIVOS */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 bg-[#e9ecef] border-b border-gray-300 text-gray-600 font-bold text-base">
            <div className="p-3 border-r border-gray-300">Material</div>
            <div className="p-3 border-r border-gray-300">Objetivos Gerais</div>
            <div className="p-3">Objetivos Específicos</div>
          </div>
          <div className="grid grid-cols-3 bg-white text-sm">
            <div className="p-3 border-r border-gray-200">
              <textarea
                name="material"
                value={cabecalho.material}
                onChange={handleCabecalho}
                className="w-full h-24 bg-transparent outline-none resize-none focus:bg-blue-50 rounded p-1 text-gray-700"
              />
            </div>
            <div className="p-3 border-r border-gray-200">
              <textarea
                name="objetivosGerais"
                value={cabecalho.objetivosGerais}
                onChange={handleCabecalho}
                className="w-full h-24 bg-transparent outline-none resize-none focus:bg-blue-50 rounded p-1 text-gray-700"
              />
            </div>
            <div className="p-3">
              <textarea
                name="objetivosEspecificos"
                value={cabecalho.objetivosEspecificos}
                onChange={handleCabecalho}
                className="w-full h-24 bg-transparent outline-none resize-none focus:bg-blue-50 rounded p-1 text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* ATIVIDADES DA SESSÃO */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-[#e9ecef] border-b border-gray-300 px-4 py-3 font-bold text-gray-600 flex justify-between items-center">
            <span className="text-base">
              Atividades da Sessão ({atividades.length})
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="bg-orange-600 text-white px-3 py-1.5 text-xs font-bold rounded hover:bg-orange-700 transition-colors uppercase"
              >
                📚 BIBLIOTECA
              </button>
              <button
                onClick={() => setIsBoardOpen(true)}
                className="bg-gray-800 text-white px-3 py-1.5 text-xs font-bold rounded hover:bg-black transition-colors uppercase"
              >
                + CRIAR NOVO
              </button>
            </div>
          </div>

          <div className="p-6">
            {atividades.length === 0 ? (
              <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-sm">
                Nenhum exercício adicionado a este treino. Clique em <b>+ CRIAR NOVO</b> ou adicione da <b>BIBLIOTECA</b>.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {atividades.map((ativ, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white flex flex-col justify-between"
                  >
                    <div className="bg-[#e9ecef] border-b border-gray-300 px-3 py-2 font-bold text-gray-700 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <span>Exercício {idx + 1} {ativ.title ? `- ${ativ.title}` : ""}</span>
                      </div>
                      <button
                        onClick={() => removerAtividade(idx)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                        title="Remover exercício"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="w-full aspect-[1.5/1] relative bg-gray-900 flex items-center justify-center p-2">
                      <img
                        src={ativ.image}
                        alt="Tático"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="p-3 text-xs bg-gray-50 border-t border-gray-200 space-y-1">
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>⏱️ {ativ.time || "15 min"}</span>
                        <span>👥 {ativ.players || "Geral"}</span>
                        <span>📐 {ativ.space || "Meio Campo"}</span>
                      </div>
                      {ativ.specificObjective && (
                        <p className="text-gray-700 font-semibold line-clamp-1">
                          {ativ.specificObjective}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CAMADA OCULTA PARA EXPORTAR EM PDF */}
      <div className="absolute top-[-10000px] left-[-10000px] pointer-events-none">
        <div ref={exportRef} className="bg-white w-[210mm] min-h-[297mm] p-8 font-sans text-black">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <img src="/topo-logo.png" alt="CT 2B" className="h-14 w-auto object-contain" />
              <div>
                <h1 className="font-extrabold text-xl uppercase tracking-tight">CT 2B</h1>
                <p className="text-[10px] text-gray-500 font-bold">www.ct2b-app.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-bold text-gray-800">Plano de Treino</h2>
              <p className="text-3xl font-black mt-[-4px]">{cabecalho.numeroPlano}</p>
            </div>
          </div>

          <h3 className="font-extrabold text-lg border-b-2 border-black pb-1 mb-1">
            Plano de Treino
          </h3>

          <div className="text-[11px] mb-4 border border-black border-b-2">
            <div className="grid grid-cols-4 border-b border-black font-semibold text-center bg-gray-50">
              <div className="border-r border-black p-1 text-left">
                Nº Jogadores <span className="font-normal">{cabecalho.jogadores}</span>
              </div>
              <div className="border-r border-black p-1">
                Microciclo <span className="font-normal">{cabecalho.microciclo}</span>
              </div>
              <div className="border-r border-black p-1">
                Mesociclo <span className="font-normal">{cabecalho.mesociclo}</span>
              </div>
              <div className="p-1">
                Período <span className="font-normal">{cabecalho.periodo}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 font-semibold text-center">
              <div className="border-r border-black p-1 text-left">
                Data <span className="font-normal">{cabecalho.data}</span>
              </div>
              <div className="border-r border-black p-1">
                Hora <span className="font-normal">{cabecalho.hora}</span>
              </div>
              <div className="border-r border-black p-1">
                Clima <span className="font-normal">{cabecalho.clima}</span>
              </div>
              <div className="p-1">
                Volume <span className="font-normal">{cabecalho.volume}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b-2 border-black pb-2 mb-4">
            <div>
              <h4 className="font-bold text-sm mb-1">Material</h4>
              <p className="text-[10px] whitespace-pre-wrap leading-tight">{cabecalho.material}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Objetivos Gerais</h4>
              <p className="text-[10px] whitespace-pre-wrap leading-tight">{cabecalho.objetivosGerais}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Objetivos Específicos</h4>
              <p className="text-[10px] whitespace-pre-wrap leading-tight">{cabecalho.objetivosEspecificos}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            {atividades.map((ativ, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-2 font-bold text-sm border-b-[3px] border-black pb-1 mb-2">
                  <div className="w-4 h-4 bg-black rounded-full"></div>
                  Exercício {idx + 1}
                </div>
                <div className="w-full aspect-[4/5] bg-gray-800 relative border border-black mb-2 flex items-center justify-center overflow-hidden">
                  <img src={ativ.image} alt="Ex" className="w-full h-full object-contain" />
                </div>
                <div className="grid grid-cols-3 text-center border-b border-gray-300 pb-2 mb-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] bg-white border border-gray-300 rounded px-3 py-[2px] mb-[2px] font-bold">
                      {ativ.time}
                    </span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">Tempo</span>
                  </div>
                  <div className="flex flex-col items-center border-l border-r border-gray-300">
                    <span className="text-[10px] bg-white border border-gray-300 rounded px-3 py-[2px] mb-[2px] font-bold">
                      {ativ.players}
                    </span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">Número</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] bg-white border border-gray-300 rounded px-3 py-[2px] mb-[2px] font-bold">
                      {ativ.space}
                    </span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold">Espaço</span>
                  </div>
                </div>
                <div className="text-[10px] leading-tight">
                  <p className="font-extrabold mb-1">Objetivo(s) específico(s)</p>
                  <p className="mb-2">{ativ.specificObjective}</p>
                  <p className="font-extrabold mb-1">Descrição</p>
                  <p className="whitespace-pre-wrap">{ativ.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-2">
            <h3 className="font-extrabold text-lg border-b-2 border-black pb-1 mb-1">
              Observações/balanço
            </h3>
            <p className="text-[10px] uppercase">{cabecalho.observacoes}</p>
          </div>
        </div>
      </div>

      {isBoardOpen && (
        <QuadroTaticoModal
          onClose={() => setIsBoardOpen(false)}
          onSave={(nova) => {
            setAtividades([...atividades, nova]);
            setIsBoardOpen(false);
          }}
        />
      )}

      {isLibraryOpen && (
        <BibliotecaModal
          onClose={() => setIsLibraryOpen(false)}
          onSelect={(selecionada) => {
            setAtividades([...atividades, selecionada]);
            setIsLibraryOpen(false);
          }}
        />
      )}
    </div>
  );
}

// --- MODAL DO QUADRO TÁTICO ---
function QuadroTaticoModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (ativ: any) => void;
}) {
  const [titulo, setTitulo] = useState("Organização Defensiva");
  const [tempo, setTempo] = useState("15 min");
  const [jogadores, setJogadores] = useState("10+1");
  const [espaco, setEspaco] = useState("Meio Campo");
  const [objetivo, setObjetivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [modalidade, setModalidade] = useState<"Fut 7" | "Futsal">("Fut 7");
  const [corJogador, setCorJogador] = useState("#ef4444");
  const [menuItensAberto, setMenuItensAberto] = useState(false);

  const coresEquipa = ["#ef4444", "#3b82f6", "#eab308", "#ffffff", "#000000", "#22c55e"];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);

  const getFabric = () => {
    const f = require("fabric");
    return f.fabric || f.default || f;
  };

  const atualizarFundoCanvas = (canvasObj: any, tipo: "Fut 7" | "Futsal") => {
    if (!canvasObj) return;
    const fabric = getFabric();
    const isFutsal = tipo === "Futsal";
    const urlImagem = isFutsal ? "/quadra-futsal.png" : "/campo-fut7.png";

    canvasObj.getObjects().forEach((obj: any) => {
      if (obj.name === "fundoCampoImagem") canvasObj.remove(obj);
    });

    canvasObj.backgroundColor = isFutsal ? "#1e3a8a" : "#15803d";

    fabric.Image.fromURL(urlImagem, (img: any) => {
      if (img && img.width) {
        img.set({
          left: 0,
          top: 0,
          scaleX: canvasObj.width / img.width,
          scaleY: canvasObj.height / img.height,
          selectable: false,
          evented: false,
          name: "fundoCampoImagem",
        });

        canvasObj.add(img);
        if (typeof canvasObj.sendToBack === "function") {
          canvasObj.sendToBack(img);
        }
        canvasObj.renderAll();
      }
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined" && canvasRef.current && !fabricCanvas) {
      const fabric = getFabric();
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 533,
        selection: true,
      });
      atualizarFundoCanvas(initCanvas, modalidade);
      setFabricCanvas(initCanvas);
      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (fabricCanvas) {
      atualizarFundoCanvas(fabricCanvas, modalidade);
    }
  }, [modalidade]);

  const adicionarJogador = (texto: string) => {
    if (!fabricCanvas) return;
    const fabric = getFabric();
    const corTexto =
      corJogador === "#ffffff" || corJogador === "#eab308" ? "#000" : "#fff";
    const circulo = new fabric.Circle({
      radius: 14,
      fill: corJogador,
      stroke: "#fff",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
    });
    const letra = new fabric.Text(texto, {
      fontSize: 16,
      fill: corTexto,
      originX: "center",
      originY: "center",
      fontWeight: "bold",
    });
    const grupo = new fabric.Group([circulo, letra], {
      left: 400,
      top: 260,
      hasControls: true,
    });
    fabricCanvas.add(grupo);
    fabricCanvas.setActiveObject(grupo);
  };

  const adicionarIcone = (emoji: string, tamanho: number) => {
    if (!fabricCanvas) return;
    const fabric = getFabric();
    const icone = new fabric.Text(emoji, { fontSize: tamanho, left: 400, top: 260 });
    fabricCanvas.add(icone);
    fabricCanvas.setActiveObject(icone);
    setMenuItensAberto(false);
  };

  const limparQuadro = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      atualizarFundoCanvas(fabricCanvas, modalidade);
    }
  };

  const apagarSelecionado = () => {
    if (!fabricCanvas) return;
    const ativos = fabricCanvas.getActiveObjects();
    if (ativos.length) {
      fabricCanvas.discardActiveObject();
      ativos.forEach((obj: any) => fabricCanvas.remove(obj));
    }
  };

  const guardarAtividade = async () => {
    if (!fabricCanvas) return;
    setIsSaving(true);
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
    const imagemBase64 = fabricCanvas.toDataURL({
      format: "jpeg",
      quality: 0.9,
      multiplier: 1.2,
    });

    const novaAtiv = {
      title: titulo,
      time: tempo,
      players: jogadores,
      space: espaco,
      specificObjective: objetivo,
      description: descricao,
      image: imagemBase64,
    };

    try {
      await fetch("/api/exercicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaAtiv),
      });
      onSave(novaAtiv);
    } catch {
      onSave(novaAtiv);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col font-sans text-white">
      <div className="h-14 bg-[#1e1e1e] flex justify-between items-center px-4 border-b border-[#333] shadow-md">
        <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-white uppercase">
          CANCELAR
        </button>
        <div className="flex items-center gap-4 bg-black/30 p-1 rounded border border-[#444]">
          <button
            onClick={() => setModalidade("Fut 7")}
            className={`px-4 py-1 text-xs font-bold rounded ${
              modalidade === "Fut 7" ? "bg-green-700 text-white" : "text-gray-400"
            }`}
          >
            FUT 7
          </button>
          <button
            onClick={() => setModalidade("Futsal")}
            className={`px-4 py-1 text-xs font-bold rounded ${
              modalidade === "Futsal" ? "bg-blue-700 text-white" : "text-gray-400"
            }`}
          >
            FUTSAL
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="bg-transparent border-none text-center font-bold text-base outline-none w-64 text-gray-200"
          />
        </div>
        <button
          onClick={guardarAtividade}
          disabled={isSaving}
          className="text-xs font-bold bg-[#15803d] hover:bg-green-500 text-white px-4 py-2 rounded uppercase"
        >
          {isSaving ? "A GUARDAR..." : "GUARDAR NA BIBLIOTECA"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 bg-[#151515] relative flex items-center justify-center p-4">
          <div className="shadow-2xl border border-[#333] rounded overflow-hidden">
            <canvas ref={canvasRef} className="rounded" />
          </div>

          {menuItensAberto && (
            <div className="absolute bottom-4 right-1/4 bg-[#222] border border-[#444] rounded-xl p-4 shadow-2xl grid grid-cols-4 gap-3 z-50">
              <div className="col-span-4 text-[10px] font-bold text-gray-500 border-b border-[#333] pb-1 uppercase">
                Bolas & Cones
              </div>
              <button onClick={() => adicionarIcone("⚽", 24)} className="w-12 h-12 bg-[#333] hover:bg-[#444] rounded flex items-center justify-center text-2xl">⚽</button>
              <button onClick={() => adicionarIcone("🏐", 24)} className="w-12 h-12 bg-[#333] hover:bg-[#444] rounded flex items-center justify-center text-2xl">🏐</button>
              <button onClick={() => adicionarIcone("🔺", 32)} className="w-12 h-12 bg-[#333] hover:bg-[#444] rounded flex items-center justify-center text-3xl">🔺</button>
              <button onClick={() => adicionarIcone("🟡", 20)} className="w-12 h-12 bg-[#333] hover:bg-[#444] rounded flex items-center justify-center text-xl">🟡</button>
            </div>
          )}
        </div>

        <div className="w-80 bg-[#1c1c1c] border-l border-[#333] p-5 flex flex-col gap-3 overflow-y-auto text-xs">
          <h3 className="font-bold border-b border-[#333] pb-2 text-orange-500 text-sm">
            Propriedades
          </h3>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 font-bold block mb-1">⏱️ Tempo</label>
              <input
                type="text"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                className="w-full bg-[#111] border border-[#333] rounded p-2 text-gray-200 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 font-bold block mb-1">👥 Número</label>
              <input
                type="text"
                value={jogadores}
                onChange={(e) => setJogadores(e.target.value)}
                className="w-full bg-[#111] border border-[#333] rounded p-2 text-gray-200 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold block mb-1">📐 Espaço</label>
            <input
              type="text"
              value={espaco}
              onChange={(e) => setEspaco(e.target.value)}
              className="w-full bg-[#111] border border-[#333] rounded p-2 text-gray-200 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold block mb-1">🎯 Objetivo Específico</label>
            <textarea
              rows={3}
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full bg-[#111] border border-[#333] rounded p-2 text-gray-200 outline-none resize-none"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-[10px] text-gray-500 font-bold block mb-1">📝 Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full flex-1 min-h-[100px] bg-[#111] border border-[#333] rounded p-2 text-gray-200 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="h-16 bg-[#222] border-t border-[#333] flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-4 border-r border-[#444] pr-6">
          <div className="flex gap-1">
            {coresEquipa.map((cor) => (
              <div
                key={cor}
                onClick={() => setCorJogador(cor)}
                className={`w-5 h-5 rounded-full cursor-pointer border-2 ${
                  corJogador === cor ? "border-orange-500 scale-125" : "border-transparent"
                }`}
                style={{ backgroundColor: cor }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => adicionarJogador("A")}
              className="h-9 px-3 rounded bg-[#333] border border-[#555] font-bold text-xs"
            >
              + A
            </button>
            <button
              onClick={() => adicionarJogador("D")}
              className="h-9 px-3 rounded bg-[#333] border border-[#555] font-bold text-xs"
            >
              + D
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={() => setMenuItensAberto(!menuItensAberto)}
            className="h-10 px-4 rounded-lg bg-orange-600 text-white font-bold text-xs"
          >
            ⚽ Ícones
          </button>
        </div>

        <div className="flex items-center gap-2 pl-6 border-l border-[#444]">
          <button
            onClick={apagarSelecionado}
            className="h-9 px-3 rounded bg-[#333] text-red-400 font-bold text-xs"
          >
            Apagar Item
          </button>
          <button
            onClick={limparQuadro}
            className="h-9 px-3 rounded bg-[#333] text-gray-300 font-bold text-xs"
          >
            Limpar Campo
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MODAL DA BIBLIOTECA ---
function BibliotecaModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (ativ: any) => void;
}) {
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarBiblioteca() {
      try {
        const res = await fetch("/api/exercicios");
        if (res.ok) setExercicios(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    carregarBiblioteca();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-[#111] text-white w-full max-w-5xl h-[80vh] rounded-xl flex flex-col overflow-hidden border border-[#333] shadow-2xl">
        <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1a1a1a]">
          <h2 className="text-lg font-bold text-orange-500">
            📚 Biblioteca de Exercícios do CT 2B
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold bg-[#333] px-3 py-1 rounded text-xs"
          >
            FECHAR
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
          {loading ? (
            <p className="text-center text-gray-400 mt-10 text-xs">A carregar...</p>
          ) : exercicios.length === 0 ? (
            <p className="text-center text-gray-500 mt-20 text-xs">
              A biblioteca está vazia.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {exercicios.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#333] hover:border-orange-500 transition-colors flex flex-col shadow-lg"
                >
                  <div className="h-40 bg-[#000] p-2 border-b border-[#333]">
                    <img
                      src={ex.image}
                      alt={ex.title}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold mb-1 text-gray-100 text-sm">{ex.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                        {ex.specificObjective}
                      </p>
                    </div>
                    <button
                      onClick={() => onSelect(ex)}
                      className="mt-4 w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded text-xs transition-colors uppercase"
                    >
                      ADICIONAR AO TREINO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}