"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Exercicio {
  id: string;
  titulo: string;
  categoria?: string;
  duracao?: number;
  descricao?: string;
}

function PlaneamentoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get("id");
  const dataParam = searchParams.get("data");

  const [titulo, setTitulo] = useState("");
  const [dataTreino, setDataTreino] = useState(dataParam || new Date().toISOString().split("T")[0]);
  const [categoria, setCategoria] = useState("SUB-11");
  const [objetivo, setObjetivo] = useState("");
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState<Exercicio[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (idParam) {
      // Carregar plano existente caso haja ID nos parâmetros
      fetch(`/api/planos/${idParam}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setTitulo(data.titulo || "");
            setDataTreino(data.data ? data.data.split("T")[0] : "");
            setCategoria(data.categoria || "SUB-11");
            setObjetivo(data.objetivo || "");
            setExerciciosSelecionados(data.exercicios || []);
          }
        })
        .catch(() => {});
    }
  }, [idParam]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setSucesso(false);

    try {
      const payload = {
        id: idParam || undefined,
        titulo: titulo || `Treino - ${categoria}`,
        data: dataTreino,
        categoria,
        objetivo,
        exercicios: exerciciosSelecionados,
      };

      const res = await fetch("/api/planos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSucesso(true);
        setTimeout(() => {
          router.push("/treinos");
        }, 1200);
      }
    } catch {
      alert("Erro ao salvar o planeamento de treino.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <Link
              href="/treinos"
              className="text-xs font-semibold text-orange-500 hover:text-orange-400 uppercase tracking-wider mb-1 inline-block"
            >
              ← Voltar aos Treinos
            </Link>
            <h1 className="text-2xl font-black text-white">Planeamento de Treino</h1>
            <p className="text-xs text-slate-400">
              Configure objetivos, metodologia e exercícios da sessão.
            </p>
          </div>
        </div>

        {sucesso && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold text-center">
            Planeamento salvo com sucesso! A redirecionar...
          </div>
        )}

        {/* Formulário Principal */}
        <form onSubmit={handleSalvar} className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500">
              Dados da Sessão
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Título do Treino
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Transição Ofensiva e Finalização"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Data da Sessão
                </label>
                <input
                  type="date"
                  required
                  value={dataTreino}
                  onChange={(e) => setDataTreino(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Categoria
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-orange-500 outline-none"
                >
                  <option value="SUB-7">Sub-7</option>
                  <option value="SUB-9">Sub-9</option>
                  <option value="SUB-10">Sub-10</option>
                  <option value="SUB-11">Sub-11</option>
                  <option value="SUB-13">Sub-13</option>
                  <option value="SUB-15">Sub-15</option>
                  <option value="GERAL">Geral</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Objetivo Principal do Treino
              </label>
              <textarea
                rows={3}
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                placeholder="Descreva o foco técnico, tático ou físico trabalhado..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Lista de Exercícios Adicionados */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500">
                Exercícios / Estrutura da Atividade ({exerciciosSelecionados.length})
              </h2>
              <button
                type="button"
                onClick={() => {
                  const novoExercicio: Exercicio = {
                    id: Math.random().toString(36).substring(7),
                    titulo: `Bloco ${exerciciosSelecionados.length + 1}`,
                    duracao: 15,
                    descricao: "",
                  };
                  setExerciciosSelecionados([...exerciciosSelecionados, novoExercicio]);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                + Adicionar Bloco
              </button>
            </div>

            {exerciciosSelecionados.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                Nenhum bloco de exercício adicionado. Clique no botão acima para montar a sessão.
              </div>
            ) : (
              <div className="space-y-3">
                {exerciciosSelecionados.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col md:flex-row gap-3 items-start md:items-center justify-between"
                  >
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.titulo}
                          placeholder="Nome da atividade"
                          onChange={(e) => {
                            const updated = [...exerciciosSelecionados];
                            updated[idx].titulo = e.target.value;
                            setExerciciosSelecionados(updated);
                          }}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-orange-500 outline-none flex-1"
                        />
                        <input
                          type="number"
                          value={item.duracao || ""}
                          placeholder="Minutos"
                          onChange={(e) => {
                            const updated = [...exerciciosSelecionados];
                            updated[idx].duracao = Number(e.target.value);
                            setExerciciosSelecionados(updated);
                          }}
                          className="w-20 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-orange-500 outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={item.descricao || ""}
                        placeholder="Orientações e regras práticas..."
                        onChange={(e) => {
                          const updated = [...exerciciosSelecionados];
                          updated[idx].descricao = e.target.value;
                          setExerciciosSelecionados(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setExerciciosSelecionados(
                          exerciciosSelecionados.filter((_, i) => i !== idx)
                        );
                      }}
                      className="text-xs text-rose-500 hover:text-rose-400 p-2"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/treinos"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={salvando}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white rounded-xl transition-colors shadow-lg shadow-orange-600/30 disabled:opacity-50"
            >
              {salvando ? "A salvar..." : "Salvar Planeamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// O componente exportado por defeito envolve a lógica no Suspense exigido pelo Next.js
export default function PlaneamentoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
          A carregar planeamento do treino...
        </div>
      }
    >
      <PlaneamentoContent />
    </Suspense>
  );
}