import { contextBridge, ipcRenderer } from "electron";
// import type { Material } from "../src/types/material";
console.log("PRELOAD CARICATO 1");
contextBridge.exposeInMainWorld("electronAPI", {
  saveMaterials: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    materials: any[], // save materials on data folder
  ) => ipcRenderer.invoke("save-materials", materials),

  loadMaterials: () => ipcRenderer.invoke("load-materials"), // load saved material(cosi' il cliente non deve caricarli ogni volta che riapre l'app )
});

// step 3 da fare -> ricompilare dist-electron
