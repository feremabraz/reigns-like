import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
