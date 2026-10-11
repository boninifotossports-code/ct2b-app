"use client";

import { useEffect, useState } from "react";

export default function CadastrosPage() {
  const [abaAtiva, setAbaAtiva] = useState<"atletas" | "usuarios">("atletas");
  const [loading, setLoading] = useState(true);

  // Dados da Base de Dados
  const [atletas, setAtletas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // Formulário: Atleta
  const [nomeAtleta, setNomeAtleta] = useState("");
  const [nascimentoFormatado, setNascimentoFormatado] = useState("");
  const [categoriaAtleta, setCategoriaAtleta] = useState("Sub-9");
  const [posicaoAtleta, setPosicaoAtleta] = useState("");
  const [salvandoAtleta, setSalvandoAtleta] = useState(false);

  // Formulário: Utilizador
  const [nomeUser, setNomeUser] = useState("");
  const [usuarioUser, setUsuarioUser] = useState("");
  const [senhaUser, setSenhaUser] = useState("");
  const [telefoneUser, setTelefoneUser] = useState("");
  const [roleUser, setRoleUser] = useState("RESPONSAVEL");
  const [atletasSelecionados, setAtletasSelecionados] = useState<string[]>([]);
  const [salvandoUser, setSalvandoUser] = useState(false);

  // Notificações
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const listaCategorias = [
    "Sub-6", "Sub-7", "Sub-8", "Sub-9", "Sub-10",
    "Sub-11", "Sub-12", "Sub-13", "Sub-14", "Sub-15",
    "Sub-16", "Sub-17"
  ];

  const carregarTudo = async () => {
    try {
      setLoading(true);
      const [resAtletas, resUsuarios] = await Promise.all([
        fetch("/api/atletas"),
        fetch("/api/usuarios"),
      ]);

      if (resAtletas.ok) {
        const dataAtletas = await resAtletas.json();
        setAtletas(dataAtletas);
      }

      if (resUsuarios.ok) {
        const dataUsuarios = await resUsuarios.json();
        setUsuarios(dataUsuarios.usuarios || []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTudo();
  }, []);

  // Máscara DD/MM/AAAA e cálculo dinâmico da Categoria
  const handleDataNascimentoChange = (valor: string) => {
    // Permite apenas dígitos
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 8);

    let formatado = apenasNumeros;
    if (apenasNumeros.length > 2 && apenasNumeros.length <= 4) {
      formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    } else if (apenasNumeros.length > 4) {
      formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
    }
    setNascimentoFormatado(formatado);

    // Quando o ano estiver completo (8 dígitos inseridos)
    if (apenasNumeros.length === 8) {
      const anoNasc = parseInt(apenasNumeros.slice(4, 8), 10);
      const anoAtual = new Date().getFullYear();
      const idadeDesportiva = anoAtual - anoNasc;

      if (idadeDesportiva <= 6) {
        setCategoriaAtleta("Sub-6");
      } else if (idadeDesportiva >= 17) {
        setCategoriaAtleta("Sub-17");
      } else {
        setCategoriaAtleta(`Sub-${idadeDesportiva}`);
      }
    }
  };

  // Submeter Novo Atleta
  const handleCadastrarAtleta = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem({ tipo: "", texto: "" });
    setSalvandoAtleta(true);

    try {
      const res = await fetch("/api/atletas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeCompleto: nomeAtleta,
          categoria: categoriaAtleta,
          posicao: posicaoAtleta,
          dataNascimento: nascimentoFormatado,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMensagem({ tipo: "erro", texto: data.error || "Erro ao salvar atleta." });
        setSalvandoAtleta(false);
        return;
      }

      setMensagem({ tipo: "sucesso", texto: "Atleta cadastrado com sucesso!" });
      setNomeAtleta("");
      setNascimentoFormatado("");
      setPosicaoAtleta("");
      carregarTudo();
    } catch {
      setMensagem({ tipo: "erro", texto: "Falha de comunicação com o servidor." });
    } finally {
      setSalvandoAtleta(false);
    }
  };

  // Submeter Novo Utilizador
  const handleCadastrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem({ tipo: "", texto: "" });
    setSalvandoUser(true);

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeUser,
          usuario: usuarioUser,
          senhaInicial: senhaUser,
          telefone: telefoneUser,
          role: roleUser,
          atletasIds: roleUser === "RESPONSAVEL" ? atletasSelecionados : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMensagem({ tipo: "erro", texto: data.error || "Erro ao cadastrar utilizador." });
        setSalvandoUser(false);
        return;
      }

      setMensagem({ tipo: "sucesso", texto: "Utilizador cadastrado com sucesso!" });
      setNomeUser("");
      setUsuarioUser("");
      setSenhaUser("");
      setTelefoneUser("");
      setAtletasSelecionados([]);
      carregarTudo();
    } catch {
      setMensagem({ tipo: "erro", texto: "Falha de comunicação com o servidor." });
    } finally {
      setSalvandoUser(false);
    }
  };

  const toggleAtletaSelecao = (id: string) => {
    setAtletasSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Título Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Central de Cadastros</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestão técnica de atletas da base e controlo de acessos por perfil.
          </p>
        </div>

        {/* Abas */}
        <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-xl self-start">
          <button
            onClick={() => {
              setAbaAtiva("atletas");
              setMensagem({ tipo: "", texto: "" });
            }}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              abaAtiva === "atletas"
                ? "bg-orange-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ⚽ Atletas ({atletas.length})
          </button>
          <button
            onClick={() => {
              setAbaAtiva("usuarios");
              setMensagem({ tipo: "", texto: "" });
            }}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              abaAtiva === "usuarios"
                ? "bg-orange-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            👥 Utilizadores & Acessos ({usuarios.length})
          </button>
        </div>
      </div>

      {/* Alertas */}
      {mensagem.texto && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold text-center border ${
            mensagem.tipo === "sucesso"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 1: GESTÃO DE ATLETAS */}
      {/* ======================================================== */}
      {abaAtiva === "atletas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Novo Atleta */}
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 border-l-4 border-orange-500 pl-3">
              Cadastrar Novo Atleta
            </h2>

            <form onSubmit={handleCadastrarAtleta} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={nomeAtleta}
                  onChange={(e) => setNomeAtleta(e.target.value)}
                  placeholder="Ex: Enzo Gabriel França Gomes"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Data de Nascimento (DD/MM/AAAA)
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={nascimentoFormatado}
                  onChange={(e) => handleDataNascimentoChange(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none placeholder-gray-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Categoria
                  </label>
                  <select
                    value={categoriaAtleta}
                    onChange={(e) => setCategoriaAtleta(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                  >
                    {listaCategorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    Calculada automaticamente
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Posição em Campo / Quadra
                  </label>
                  <input
                    type="text"
                    value={posicaoAtleta}
                    onChange={(e) => setPosicaoAtleta(e.target.value)}
                    placeholder="Ex: Goleiro, Fixo, Ala"
                    className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none placeholder-gray-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={salvandoAtleta}
                className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-2"
              >
                {salvandoAtleta ? "A guardar..." : "Registar Atleta"}
              </button>
            </form>
          </div>

          {/* Lista de Atletas */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-white border-l-4 border-orange-500 pl-3">
              Atletas Registados ({atletas.length})
            </h2>

            {loading ? (
              <div className="p-8 text-center text-gray-500">A carregar atletas...</div>
            ) : atletas.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center text-gray-500">
                Nenhum atleta cadastrado ainda.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {atletas.map((atleta) => (
                  <div
                    key={atleta.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow hover:border-gray-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          {atleta.categoria}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {atleta.posicao || "Posição não definida"}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base">⚽ {atleta.nomeCompleto}</h3>
                      {atleta.dataNascimento && (
                        <p className="text-xs text-gray-500 mt-1">
                          Nascimento: <span className="font-mono text-gray-400">{atleta.dataNascimento}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Responsável:</span>
                      {atleta.responsavel ? (
                        <span className="text-green-400 font-semibold">
                          👤 {atleta.responsavel.nome} ({atleta.responsavel.usuario})
                        </span>
                      ) : (
                        <span className="text-yellow-500 font-semibold italic text-[11px]">
                          Sem responsável vinculado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: UTILIZADORES & ACESSOS */}
      {/* ======================================================== */}
      {abaAtiva === "usuarios" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 border-l-4 border-orange-500 pl-3">
              Novo Acesso & Senha Provisória
            </h2>

            <form onSubmit={handleCadastrarUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Nome do Utilizador
                </label>
                <input
                  type="text"
                  required
                  value={nomeUser}
                  onChange={(e) => setNomeUser(e.target.value)}
                  placeholder="Ex: Carlos Gomes"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Nome de Utilizador (Login Único)
                </label>
                <input
                  type="text"
                  required
                  value={usuarioUser}
                  onChange={(e) => setUsuarioUser(e.target.value)}
                  placeholder="Ex: pai.carlos"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Senha Provisória
                </label>
                <input
                  type="text"
                  required
                  value={senhaUser}
                  onChange={(e) => setSenhaUser(e.target.value)}
                  placeholder="Ex: 123456"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                />
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  Será obrigado a alterar na tela de 1º acesso.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={telefoneUser}
                  onChange={(e) => setTelefoneUser(e.target.value)}
                  placeholder="(21) 99999-9999"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Nível de Acesso
                </label>
                <select
                  value={roleUser}
                  onChange={(e) => setRoleUser(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none"
                >
                  <option value="RESPONSAVEL">Responsável / Pai</option>
                  <option value="PROFESSOR">Professor / Comissão Técnica</option>
                </select>
              </div>

              {roleUser === "RESPONSAVEL" && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Vincular Atleta(s) a este Responsável
                  </label>
                  {atletas.length === 0 ? (
                    <p className="text-xs text-yellow-500 italic p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                      Cadastre atletas primeiro na aba ao lado para vincular aqui.
                    </p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1 bg-gray-950 border border-gray-800 p-2 rounded-xl">
                      {atletas.map((atleta) => (
                        <label
                          key={atleta.id}
                          className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-900 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={atletasSelecionados.includes(atleta.id)}
                            onChange={() => toggleAtletaSelecao(atleta.id)}
                            className="accent-orange-500"
                          />
                          <span className="text-gray-200">{atleta.nomeCompleto}</span>
                          <span className="text-[10px] text-gray-500 ml-auto uppercase font-bold">
                            {atleta.categoria}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={salvandoUser}
                className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-2"
              >
                {salvandoUser ? "A registar..." : "Registar Utilizador"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-white border-l-4 border-orange-500 pl-3">
              Contas com Acesso Ativo ({usuarios.length})
            </h2>

            {usuarios.map((u) => (
              <div
                key={u.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow hover:border-gray-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        u.role === "PROFESSOR"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      }`}
                    >
                      {u.role}
                    </span>
                    {u.primeiroAcesso && (
                      <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Aguardando 1º Acesso
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base">{u.nome}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Login: <span className="text-gray-200 font-mono font-semibold">{u.usuario}</span>
                  </p>
                  {u.telefone && <p className="text-xs text-gray-500 mt-0.5">📞 {u.telefone}</p>}
                </div>

                {u.role === "RESPONSAVEL" && (
                  <div className="mt-4 pt-3 border-t border-gray-800">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Filhos / Atletas Vinculados:</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {u.atletas && u.atletas.length > 0 ? (
                        u.atletas.map((at: any) => (
                          <span
                            key={at.id}
                            className="bg-gray-800 text-gray-200 text-[11px] px-2 py-0.5 rounded-lg border border-gray-700 font-medium"
                          >
                            ⚽ {at.nomeCompleto}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-600 italic">Nenhum atleta vinculado</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}