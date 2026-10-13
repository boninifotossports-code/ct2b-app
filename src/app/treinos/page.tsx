"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      // Lê cookie ou sessão salva
      const match = document.cookie.match(new RegExp("(^| )ct2b_session=([^;]+)"));
      if (match) {
        const session = JSON.parse(decodeURIComponent(match[2]));
        const role = (session.role || "").toUpperCase();
        if (role === "ADMIN" || role === "PROFESSOR" || role === "TREINADOR" || role === "COORDENADOR") {
          router.replace("/dashboard");
          return;
        } else {
          router.replace("/portal-pais");
          return;
        }
      }
    } catch {
      // Se falhar o parse, manda pro login
    }
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">
      Carregando CT 2B...
    </div>
  );
}