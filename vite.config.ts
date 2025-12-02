import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O nome do repositório DEVE ser o mesmo usado no GitHub Pages...
// Altere 'registro-producao' se o nome do seu repositório for diferente.
const repoName = 'teste-apontamento-online2'; 

// Define a base path:
// Se estiver em produção (após o build), usa /<repoName>/ (necessário para GH Pages)
// Caso contrário, usa / (para desenvolvimento local)
const base = process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/';

export default defineConfig({
  plugins: [react()],
  // Define o caminho base para carregar corretamente os assets
  base: base,
  build: {
    // Garante que o output seja colocado na pasta 'dist'
    outDir: 'dist',
    sourcemap: false,
  },
});
