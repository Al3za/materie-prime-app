// Esegue main.ts.
// Ha accesso al filesystem, finestre, menu, notifiche, ecc.
// Usa API Electron come BrowserWindow, app, dialog.

import { app, BrowserWindow, ipcMain } from "electron"; // ipcMain = comunicazione Ipc tra componenti electron (main - render - preload)
import fs from "fs";
import path from "path";

// Creiamo la cartella data
// const dataFolder = path.join(process.cwd(), "data"); // crea la cartella data al root level del progetto
// const dataFolder = path.join(
//   app.getPath("userData"), // app.getPath e importante perche trova trovano i giusti path in production, dopo aver creati il file "Mandorle Cost Tool".exe con electron-build, e li trova anche nel path del PC altri user, quelli che scaricano questo file.exe per usare l'app
//   "data",
// );

// "Dammi la cartella ufficiale (compatibile coni il tuo pc e quello di ogni pc degli user) dove l'app può salvare dati permanenti.". C:\Users\Ale\AppData\Roaming\Mandorle Cost Tool. Questa cartella viene salvata nel file system dello user
function getDataFolder() {
  if (!app.isPackaged) {
    console.log("hit dev");
    // durante sviluppo, vediamo i dati salvati qui in vs code
    return path.join(process.cwd(), "data");
  }
  // in produzione i dati vengono salvati nel pc in un path legermente diverso che non vediamo in qui in VsCode
  return path.join(app.getPath("userData"), "data");
}

// Evita che ci sia un message error quando l'utente apre l'ap la prima volta e non ha ancora il folder "data"
function ensureDataFolder() {
  const dataFolder = getDataFolder();
  console.log("Data folder:", dataFolder);
  if (!fs.existsSync(dataFolder)) {
    console.log("Creating folder...");
    fs.mkdirSync(dataFolder, { recursive: true }); //fs.mkdirSync(dataFolder) crea la cartella data, se non c'e'
    // { recursive: true } crea il percorso definito in datafolder, perche a volte node cerca di creare il folder data su una path che e' piu' corto dell originale, con / in meno
  }
}

// function createWindow =  descrizioni della pagina che mostrano il layout dell'app:
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // trova e legge preload.js in questo file path (__dirname)
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    console.log("isPackaged confirm =", app.isPackaged); // lo vediamo nel log quando abbiamo creato file.exe
    win.loadFile(
      path.join(app.getAppPath(), "dist", "index.html"), // getAppPath e importante perche si trovano i giusti path in production,
      //  dopo aver creati il file "Mandorle Cost Tool".exe con electron-build, e li trova anche nel path del PC altri user, quelli che scaricano questo file.exe per usare l'app

      // app.isPackaged ritorna false quando startiamo l'app in dev, e True quando stai eseguendo l'app generata da Electron Builder (.exe).
      // win.loadFile(path.join(process.cwd(), "dist", "index.html")); // electron lo usa dopo il build e punta alla cartella dist
    );
  } else {
    console.log("is(not)Packaged confirm =", app.isPackaged);
    win.loadURL("http://localhost:5173"); // electron lo usa in dev mode: nmp run electron:dev
  }
}

//"Esegui questo codice solo quando Electron è completamente inizializzato." Cioe' mostra il window con l'interfaccia dell'app quando l'app e' pronta all uso
app.whenReady().then(() => {
  ensureDataFolder();
  console.log("opening folder...");
  // console.log("UserData path data:", app.getPath("userData"));
  createWindow(); // apre la inestra

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Funzione saveMaterials (in file locale)
ipcMain.handle("save-materials", async (_, materials) => {
  // Assicura che il data folder/ esista prima di scrivere
  ensureDataFolder();
  const filePath = path.join(getDataFolder(), "materials.json");

  fs.writeFileSync(filePath, JSON.stringify(materials, null, 2), "utf-8");

  console.log("materials.json salvato");

  return true;
});

// Funzione load-materials (Da file locale)
ipcMain.handle("load-materials", async () => {
  // Assicura che il data folder/ esista prima di scrivere
  ensureDataFolder();
  const filePath = path.join(getDataFolder(), "materials.json"); // dove sono salvati i dati in .json quando abbiamo caricato il file excell
  console.log("func hit");
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(content);
});

// save valigette

ipcMain.handle("save-wrap", async (_, wraps) => {
  // Assicura che il data folder/ esista prima di scrivere
  ensureDataFolder();
  const filePath = path.join(getDataFolder(), "wrap.json");

  fs.writeFileSync(filePath, JSON.stringify(wraps, null, 2), "utf-8");

  return true;
});

// load valigette salvate

ipcMain.handle("load-wrap", async () => {
  ensureDataFolder();
  const filePath = path.join(getDataFolder(), "wrap.json");

  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(data);
});

// funzione Salva ricetta (In file locale) (ricorda di aggiungere una funzione che ti avverte se la ricetta ha lo stesso nome di un altra. poi magari fai scegliere se sovrascrivere. poi possiamo anche inserire il delete recept)
ipcMain.handle("save-recipe", async (_, recipe) => {
  // in _, recipe c'e l'object con i dati della ricetta
  // Assicura che il data folder/ esista prima di scrivere
  ensureDataFolder();
  const filePath = path.join(getDataFolder(), "recipes.json");

  let recipes = [];

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");

    recipes = JSON.parse(content);
  }

  // controlla che non esiste gia' una ricetta con nome uguale
  const recipeExists = recipes.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) =>
      r.nome.trim().toLowerCase() === recipe.nome.trim().toLowerCase(),
  );

  if (recipeExists) {
    return {
      success: false,
      error: "Nome ricetta già esistente",
    };
  }

  // creiamo id personalizzato (R0001, R0002) adattivo in base la lunghezza del file recipes.json
  let nextId = "R0001";

  if (recipes.length > 0) {
    const lastRecipe = recipes[recipes.length - 1];

    const lastNumber = Number(lastRecipe.id.replace("R", ""));

    nextId = "R" + String(lastNumber + 1).padStart(4, "0");
  }

  recipe.id = nextId; // id personalizzato

  recipes.push(recipe);

  fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2), "utf-8");

  console.log("Ricetta salvata");

  return { success: true };
});

// UPDATE recipe
ipcMain.handle("update-recipe", async (_, recipeId, updatedRecipe) => {
  // Assicura che il data folder/ esista prima di scrivere
  ensureDataFolder();
  const filePath = path.join(getDataFolder(), "recipes.json");
  console.log("rec id =", recipeId);
  if (!fs.existsSync(filePath)) {
    return false;
  }

  // prendiamo le recette dal file .json
  const recipes = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // troviamo la ricetta con l'id passato dal frontend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedRecipes = recipes.map((recipe: any) =>
    // recipe.id === recipeId ? updatedRecipe : recipe,
    recipe.id === recipeId
      ? {
          ...updatedRecipe,
          id: recipeId,
        }
      : recipe,
  );
  console.log("updatedRecipes", updatedRecipes);
  // inseriamo nuovamente nel file .json la ricetta updatata
  fs.writeFileSync(filePath, JSON.stringify(updatedRecipes, null, 2));

  return true;
});

// Delete
ipcMain.handle("delete-recipe", async (_, recipeId) => {
  // Assicura che il data folder/ esista prima di scrivere
  ensureDataFolder();
  const filePath = path.join(getDataFolder(), "recipes.json");

  if (!fs.existsSync(filePath)) return false;

  const recipes = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const filtered = recipes.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => r.id !== recipeId,
  );

  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));

  return true;
});

// load all recipes
ipcMain.handle("load-recipes", async () => {
  // Assicura che il data folder/ esista prima di scrivere
  ensureDataFolder();
  try {
    const filePath = path.join(getDataFolder(), "recipes.json");

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const content = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(content);
  } catch (error) {
    // aggiunti recentemente try catch. Eliminali se danno problemi
    console.error("Errore load-recipes:", error);
    return [];
  }
});

// Save settings data (la carta con prezzo eventualmente cambiato)
ipcMain.handle("save-settings", async (_, settings) => {
  // Assicura che il data folder/ esista prima di scrivere
  ensureDataFolder();
  const filePath = path.join(getDataFolder(), "settings.json");

  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");

  console.log("settings salvati =", settings);

  return true;
});

// load settings data (nord, sud, estero) // not used anymore
ipcMain.handle("load-settings", async () => {
  // Assicura che il data folder/ esista prima di scrivere
  ensureDataFolder();
  const filePath = path.join(getDataFolder(), "settings.json");

  // i dati che il cliente vede se non esiste il file json. Poi quando li aggiorna vede i file definiti nel return
  if (!fs.existsSync(filePath)) {
    // default value se non esiste ancora il filejson
    return {
      carta: {
        "1000": 10,
        "500": 5,
        "250": 2.5,
        "200": 2,
      },
      // selected: null,
    };
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
});
