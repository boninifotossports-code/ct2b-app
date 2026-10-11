"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TrocarSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usuarioId = searchParams.get("id");
  const usuarioNome = searchParams.get("user");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/trocar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, novaSenha }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao atualizar senha.");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setErro("Falha de conexão.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-4xl">🔐</span>
          <h2 className="text-xl font-black text-white mt-3">Primeiro Acesso Detectado</h2>
          <p className="text-xs text-gray-400 mt-1">
            Olá, <span className="text-orange-500 font-bold">{usuarioNome}</span>. Por segurança, redefina sua senha inicial antes de continuar.
          </p>
        </div>

        {erro && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Digite sua nova senha"
              className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirme a nova senha"
              className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Senha e Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}