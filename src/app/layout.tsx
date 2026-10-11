import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarPrincipal from "../components/layout/Navbar"; // <-- AQUI: "Navbar" com N maiúsculo!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CT 2B - Gestão Esportiva",
  description: "Plataforma de gestão do Centro de Treinamento 2B - Desenvolvido por AB Labs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen flex flex-col`}>
        
        {/* CABEÇALHO SEPARADO: Controla a sua própria visibilidade */}
        <NavbarPrincipal />

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* RODAPÉ AB LABS */}
        <footer className="bg-gray-900 border-t border-gray-800 p-6 text-center mt-auto">
          <p className="text-sm text-gray-500 font-medium">
            Desenvolvido por <span className="text-orange-500 font-bold tracking-wider">AB Labs</span>
          </p>
        </footer>

      </body>
    </html>
  );
}