import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Esta linha obriga a ler toda a pasta src
  ],
  theme: {
    extend: {
      colors: {
        ct2b: {
          bg: '#080a0f',
          surface: '#11141c',
          border: '#1f2533',
          card: '#161a24',
          orange: '#FF5E00',
          'orange-hover': '#e05300',
          blue: '#2563eb', 
          text: '#f1f5f9',
          muted: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
};

export default config;