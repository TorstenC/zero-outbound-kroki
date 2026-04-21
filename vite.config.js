// vite.config.js
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  // plugins: [solid()],
  plugins: [solidPlugin()],
  
  // WICHTIG für GitHub Pages (Repository-Name)
  base: '/zero-outbound-kroki/', 

  build: {
    target: 'esnext',
    // Wir bauen direkt in den /docs Ordner für GitHub Pages
    outDir: 'docs',
    // Stellt sicher, dass der Ordner vor dem Build geleert wird
    emptyOutDir: true,
  },
});