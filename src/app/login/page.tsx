"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Falha na autenticação.");
        setLoading(false);
        return;
      }

      localStorage.setItem("ct2b_user", JSON.stringify(data));

      // Se for o primeiro acesso, redireciona compulsoriamente para troca de senha
      if (data.primeiroAcesso) {
        router.push(`/trocar-senha?id=${data.id}&user=${data.usuario}`);
        return;
      }

      // Redirecionamento por perfil
      if (data.role === "PROFESSOR") {
        router.push("/");
      } else if (data.role === "RESPONSAVEL") {
        router.push("/portal-pais");
      } else {
        router.push("/");
      }
    } catch {
      setErro("Falha de conexão com o servidor. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 flex items-center justify-center mb-4">
            <img
              src="/topo-logo.png"
              alt="Centro de Desenvolvimento de Futebol e Futsal"
              className="h-full w-auto object-contain drop-shadow-md"
            />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center">
            Plataforma Integrada de Gestão
          </p>
        </div>

        {erro && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Nome de Usuário
            </label>
            <input
              type="text"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none transition-all placeholder-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none transition-all placeholder-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-orange-600/20 disabled:opacity-50 mt-2"
          >
            {loading ? "Entrando..." : "Acessar Plataforma"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800/80 text-center">
          <p className="text-[11px] text-gray-500">
            Acesso exclusivo para comissão técnica e responsáveis cadastrados.
          </p>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-gray-600 font-medium">
        Desenvolvido por <span className="text-orange-500 font-bold">AB Labs</span>
      </footer>
    </div>
  );
}