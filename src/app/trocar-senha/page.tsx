"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function TrocarSenhaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const usuarioParam = searchParams.get("usuario") || "";

  const [usuario, setUsuario] = useState(usuarioParam);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (novaSenha !== confirmarSenha) {
      setErro("A nova palavra-passe e a confirmação não coincidem.");
      return;
    }

    if (novaSenha.length < 4) {
      setErro("A nova palavra-passe deve ter pelo menos 4 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch("/api/auth/trocar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario,
          senhaAtual,
          novaSenha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao alterar a palavra-passe.");
        setCarregando(false);
        return;
      }

      setSucesso(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setErro("Falha de ligação ao servidor.");
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-600/20 border border-orange-500/40 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-600/10">
            <span className="text-2xl font-black text-orange-500">2B</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Alterar Palavra-passe</h1>
          <p className="text-xs text-slate-400 mt-1">
            Atualize as suas credenciais de acesso ao CT 2B
          </p>
        </div>

        {erro && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-semibold">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-semibold">
            Palavra-passe atualizada com sucesso! A redirecionar para o login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Utilizador
            </label>
            <input
              type="text"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="ex: professor ou arthur"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Palavra-passe Atual
            </label>
            <input
              type="password"
              required
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Nova Palavra-passe
            </label>
            <input
              type="password"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Confirmar Nova Palavra-passe
            </label>
            <input
              type="password"
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={carregando || sucesso}
            className="w-full mt-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30 disabled:opacity-50"
          >
            {carregando ? "A atualizar..." : "Gravar Nova Palavra-passe"}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Voltar ao Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TrocarSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
          A carregar...
        </div>
      }
    >
      <TrocarSenhaContent />
    </Suspense>
  );
}