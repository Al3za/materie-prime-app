// Esegue main.ts.
// Ha accesso al filesystem, finestre, menu, notifiche, ecc.
// Usa API Electron come BrowserWindow, app, dialog.

import { app, BrowserWindow, ipcMain } from "electron"; // ipcMain = comunicazione Ipc tra componenti electron (main - render - preload)
import fs from "fs";
import path from "path";

// Creiamo la cartella data
const dataFolder = path.join(process.cwd(), "data"); // crea la cartella data al root level del progetto

if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
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

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  createWindow();

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
  const filePath = path.join(dataFolder, "materials.json");

  fs.writeFileSync(filePath, JSON.stringify(materials, null, 2), "utf-8");

  console.log("materials.json salvato");

  return true;
});

// Funzione load-materials (Da file locale)
ipcMain.handle("load-materials", async () => {
  const filePath = path.join(dataFolder, "materials.json"); // dove sono salvati i dati in .json quando abbiamo caricato il file excell
  console.log("func hit");
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(content);
});

// funzione Salva ricetta (In file locale)
ipcMain.handle("save-recipe", async (_, recipe) => {
  // in _, recipe c'e l'object con i dati della ricetta
  const filePath = path.join(dataFolder, "recipes.json");

  let recipes = [];

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");

    recipes = JSON.parse(content);
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

  return true;
});

// load all recipes
ipcMain.handle("load-recipes", async () => {
  const filePath = path.join(dataFolder, "recipes.json");

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(content);
});
