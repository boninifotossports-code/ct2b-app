"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  Sparkles,
} from "lucide-react";

interface UsuarioItem {
  id: string;
  nome: string;
  usuario: string;
  role: string;
  telefone?: string;
  ativo?: boolean;
}

interface AtletaItem {
  id: string;
  nome: string;
  categoria?: string;
  posicao?: string;
}

export default function AtletasECadastrosPage() {
  const [abaAtiva, setAbaAtiva] = useState<"usuarios" | "atletas">("usuarios");

  // Listagens
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [atletas, setAtletas] = useState<AtletaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  // Formulário de Utilizador
  const [nomeUsuario, setNomeUsuario] = useState("Breno Henrique");
  const [loginUsuario, setLoginUsuario] = useState("breno");
  const [senhaProvisoria, setSenhaProvisoria] = useState("123456789");
  const [telefoneUsuario, setTelefoneUsuario] = useState("21999999999");
  const [perfilUsuario, setPerfilUsuario] = useState("PROFESSOR");
  const [salvandoUsuario, setSalvandoUsuario] = useState(false);

  // Formulário de Atleta
  const [nomeAtleta, setNomeAtleta] = useState("");
  const [categoriaAtleta, setCategoriaAtleta] = useState("Sub-9");
  const [posicaoAtleta, setPosicaoAtleta] = useState("Goleiro");
  const [salvandoAtleta, setSalvandoAtleta] = useState(false);

  // Chamadas usando rotas relativas
  const carregarDados = async () => {
    try {
      setCarregando(true);
      setMensagemErro("");

      const [resUsuarios, resAtletas] = await Promise.all([
        fetch("/api/usuarios"),
        fetch("/api/atletas"),
      ]);

      if (resUsuarios.ok) {
        const dadosU = await resUsuarios.json();
        setUsuarios(Array.isArray(dadosU) ? dadosU : []);
      }

      if (resAtletas.ok) {
        const dadosA = await resAtletas.json();
        setAtletas(Array.isArray(dadosA) ? dadosA : []);
      }
    } catch {
      setMensagemErro("Falha de comunicação com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCriarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemSucesso("");
    setMensagemErro("");
    setSalvandoUsuario(true);

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeUsuario,
          usuario: loginUsuario.toLowerCase().trim(),
          senha: senhaProvisoria,
          role: perfilUsuario,
          telefone: telefoneUsuario,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensagemErro(data.error || "Não foi possível registar o utilizador.");
        setSalvandoUsuario(false);
        return;
      }

      setMensagemSucesso(`Utilizador "${loginUsuario}" criado com sucesso!`);
      setNomeUsuario("");
      setLoginUsuario("");
      setSenhaProvisoria("");
      setTelefoneUsuario("");
      carregarDados();
    } catch {
      setMensagemErro("Erro ao comunicar com a API de utilizadores.");
    } finally {
      setSalvandoUsuario(false);
    }
  };

  const handleCriarAtleta = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemSucesso("");
    setMensagemErro("");
    setSalvandoAtleta(true);

    try {
      const res = await fetch("/api/atletas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeAtleta,
          categoria: categoriaAtleta,
          posicao: posicaoAtleta,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensagemErro(data.error || "Não foi possível registar o atleta.");
        setSalvandoAtleta(false);
        return;
      }

      setMensagemSucesso(`Atleta "${nomeAtleta}" registado com sucesso!`);
      setNomeAtleta("");
      carregarDados();
    } catch {
      setMensagemErro("Erro ao comunicar com a API de atletas.");
    } finally {
      setSalvandoAtleta(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Cabeçalho */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Central de Cadastros
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Gestão técnica de atletas da base e controlo de acessos por perfil.
            </p>
          </div>

          {/* Abas Alternadoras */}
          <div className="flex items-center gap-2 bg-[#0d1424] p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => {
                setAbaAtiva("atletas");
                setMensagemSucesso("");
                setMensagemErro("");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                abaAtiva === "atletas"
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Atletas ({atletas.length})</span>
            </button>

            <button
              onClick={() => {
                setAbaAtiva("usuarios");
                setMensagemSucesso("");
                setMensagemErro("");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                abaAtiva === "usuarios"
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Utilizadores & Acessos ({usuarios.length})</span>
            </button>
          </div>
        </section>

        {/* Notificações */}
        {mensagemSucesso && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{mensagemSucesso}</span>
          </div>
        )}

        {mensagemErro && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{mensagemErro}</span>
          </div>
        )}

        {/* ──────────────── Secção: Utilizadores ──────────────── */}
        {abaAtiva === "usuarios" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#0d1424] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Novo Acesso & Senha Provisória
                </h2>
              </div>

              <form onSubmit={handleCriarUsuario} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nome do Utilizador
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={nomeUsuario}
                      onChange={(e) => setNomeUsuario(e.target.value)}
                      placeholder="Ex: Breno Henrique"
                      className="w-full pl-10 pr-4 py-3 bg-[#070b14] border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nome de Utilizador (Login Único)
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUsuario}
                    onChange={(e) => setLoginUsuario(e.target.value)}
                    placeholder="Ex: breno"
                    className="w-full px-4 py-3 bg-[#070b14] border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Senha Provisória
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={senhaProvisoria}
                      onChange={(e) => setSenhaProvisoria(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#070b14] border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>
                  <span className="block text-[10px] text-slate-500 mt-1">
                    Será obrigado a alterar na tela de 1º acesso.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={telefoneUsuario}
                      onChange={(e) => setTelefoneUsuario(e.target.value)}
                      placeholder="21999999999"
                      className="w-full pl-10 pr-4 py-3 bg-[#070b14] border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nível de Acesso
                  </label>
                  <select
                    value={perfilUsuario}
                    onChange={(e) => setPerfilUsuario(e.target.value)}
                    className="w-full px-4 py-3 bg-[#070b14] border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="PROFESSOR">Professor / Comissão Técnica</option>
                    <option value="ADMIN">Administrador (Total)</option>
                    <option value="COORDENADOR">Coordenador</option>
                    <option value="RESPONSAVEL">Responsável / Pais</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={salvandoUsuario}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{salvandoUsuario ? "A gravar..." : "Criar Acesso"}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Contas com Acesso Ativo ({usuarios.length})
                </h2>
              </div>

              {carregando ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#0d1424] rounded-3xl border border-slate-800">
                  A carregar dados...
                </div>
              ) : usuarios.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#0d1424] rounded-3xl border border-slate-800">
                  Nenhum utilizador registado além do administrador.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {usuarios.map((u) => (
                    <div
                      key={u.id}
                      className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{u.nome}</span>
                          <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-500/20">
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">
                          @{u.usuario}
                        </div>
                        {u.telefone && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {u.telefone}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────────────── Secção: Atletas ──────────────── */}
        {abaAtiva === "atletas" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#0d1424] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Registar Novo Atleta
                </h2>
              </div>

              <form onSubmit={handleCriarAtleta} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nome Completo do Aluno
                  </label>
                  <input
                    type="text"
                    required
                    value={nomeAtleta}
                    onChange={(e) => setNomeAtleta(e.target.value)}
                    placeholder="Ex: Enzo Gabriel"
                    className="w-full px-4 py-3 bg-[#070b14] border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={categoriaAtleta}
                    onChange={(e) => setCategoriaAtleta(e.target.value)}
                    className="w-full px-4 py-3 bg-[#070b14] border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="Sub-7">Sub-7</option>
                    <option value="Sub-9">Sub-9</option>
                    <option value="Sub-10">Sub-10</option>
                    <option value="Sub-11">Sub-11</option>
                    <option value="Sub-13">Sub-13</option>
                    <option value="Sub-15">Sub-15</option>
                    <option value="Adulto / Fut 7">Adulto / Fut 7</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Posição
                  </label>
                  <select
                    value={posicaoAtleta}
                    onChange={(e) => setPosicaoAtleta(e.target.value)}
                    className="w-full px-4 py-3 bg-[#070b14] border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="Goleiro">Goleiro</option>
                    <option value="Fixo / Zagueiro">Fixo / Zagueiro</option>
                    <option value="Ala Direita">Ala Direita</option>
                    <option value="Ala Esquerda">Ala Esquerda</option>
                    <option value="Meio-Campo">Meio-Campo</option>
                    <option value="Pivô / Atacante">Pivô / Atacante</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={salvandoAtleta}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{salvandoAtleta ? "A registar..." : "Registar Atleta"}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Elenco de Atletas ({atletas.length})
                </h2>
              </div>

              {carregando ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#0d1424] rounded-3xl border border-slate-800">
                  A carregar lista de atletas...
                </div>
              ) : atletas.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#0d1424] rounded-3xl border border-slate-800">
                  Nenhum atleta registado de momento.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {atletas.map((atleta) => (
                    <div
                      key={atleta.id}
                      className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">
                          {atleta.nome}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                            {atleta.categoria || "Geral"}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span>{atleta.posicao || "Polivalente"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}