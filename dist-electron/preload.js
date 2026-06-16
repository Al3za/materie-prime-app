"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// import type { Material } from "../src/types/material"; // aggiungi la cartella shared in futuro, in modo che ts con manda errore
console.log("PRELOAD CARICATO 1");
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    saveMaterials: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    materials) => electron_1.ipcRenderer.invoke("save-materials", materials),
    //-----------// diversi oggetti che eseguono diverse funzione come suggerisce il nome dell oggetto
    loadMaterials: () => electron_1.ipcRenderer.invoke("load-materials"), // load saved material(cosi' il cliente non deve caricarli ogni volta che riapre l'app )
}); // invoke("load-materials") invoca la funzione ipcMain.handle("load-materials",... definita nel main, che e' quella con il compito di leggere il file.json dove sono stati salvati i dati excell caricati
// Dal frontend (RecipeContext.tsx) chiamiamo loadMaterials definita qui, e questa a sua volta invoca ipcMain.handle("load-materials",. La comunicazione tra questi viene tramite IPC
// step 3 da fare -> ricompilare dist-electron
