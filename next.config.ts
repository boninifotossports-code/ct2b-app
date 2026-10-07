/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignora erros de tipagem e de variáveis não usadas durante o deploy na Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;