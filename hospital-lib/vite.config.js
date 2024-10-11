import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts', // Votre point d'entrée principal
      name: 'hospitalLib', // Nom de votre librairie
      fileName: (format) => `hospital-lib.${format}.js`, 
    },
    rollupOptions: {
      // Assurez-vous que les dépendances nécessaires sont incluses dans votre librairie
      external: ['@types/node', 'alsatian'], 
      output: {
        // Point d'entrée pour les types TypeScript
        exports: 'named', 
      },
    },
  },
  resolve: {
    // Configurez les alias si vous en utilisez dans votre projet
    alias: { 
      // Exemple : '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    // Ajoutez les plugins Vite nécessaires pour TypeScript
    // ...
  ],
  // Si vous utilisez un serveur de développement, configurez un proxy
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000', // Adresse de votre serveur
  //       changeOrigin: true,
  //     },
  //   },
  // },
});