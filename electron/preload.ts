import { contextBridge, ipcRenderer } from "electron";
// import type { Material } from "../src/types/material"; // aggiungi la cartella shared in futuro, in modo che ts con manda errore
console.log("PRELOAD CARICATO 1");

// esponi API nel preload (IPC comunication)
contextBridge.exposeInMainWorld("electronAPI", {
  saveMaterials: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    materials: any[], // save materials on data folder
  ) => ipcRenderer.invoke("save-materials", materials),

  //-----------// diverse funzioni electron che eseguono diverse funzione come suggerisce il nome dell oggetto

  loadMaterials: () => ipcRenderer.invoke("load-materials"),
  // load saved material(cosi' il cliente non deve caricarli ogni volta che riapre l'app )
  // invoke("load-materials") invoca la funzione ipcMain.handle("load-materials",... definita nel main, che e' quella con il compito di leggere il file.json dove sono stati salvati i dati excell caricati
  // Dal frontend (RecipeContext.tsx) chiamiamo loadMaterials definita qui, e questa a sua volta invoca ipcMain.handle("load-materials",. La comunicazione tra questi viene tramite IPC
  // step 3 da fare -> ricompilare dist-electron

  //-----------// diverse funzioni electron che eseguono diverse funzione come suggerisce il nome dell oggetto

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveRecipe: (recipe: any[]) => ipcRenderer.invoke("save-recipe", recipe),

  // mostra le ricette
  loadRecipes: () => ipcRenderer.invoke("load-recipes"),

  // salva i settings (nord, sud, estero)
  loadSettings: () => ipcRenderer.invoke("load-settings"),

  // mostra i settings (nord, sud, estero)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveSettings: (settings: any) =>
    ipcRenderer.invoke("save-settings", settings),
});
