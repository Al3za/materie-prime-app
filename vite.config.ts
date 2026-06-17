import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // fa in modo che il file index.html generato durante il build, e contenente /assest dentro  <script type="module" crossorigin src="/assets/index-BSG1ckFz.js"></script> e <link rel="stylesheet" crossorigin href="/assets/index-D64VDMd1.css"> vengano letto sia in dev locale http://localhost:5173, che quando usiamo electron puro, cioe' quando electron cerca i file con sinstassi pc: file:///...
  plugins: [react()],
});

// // https://vite.dev/config/ (questo blocco funziona in dev)
// export default defineConfig({
//   plugins: [react()],
// })
