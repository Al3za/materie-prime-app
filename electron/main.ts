// Esegue main.ts.
// Ha accesso al filesystem, finestre, menu, notifiche, ecc.
// Usa API Electron come BrowserWindow, app, dialog.

import { app, BrowserWindow, ipcMain } from "electron"; // ipcMain = comunicazione Ipc tra componenti electron (main - render - preload)
import fs from "fs";
import path from "path";

console.log("Electron avviato");
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

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

// Funzione saveMaterials
ipcMain.handle("save-materials", async (_, materials) => {
  const filePath = path.join(dataFolder, "materials.json");

  fs.writeFileSync(filePath, JSON.stringify(materials, null, 2), "utf-8");

  console.log("materials.json salvato");

  return true;
});

ipcMain.handle("load-materials", async () => {
  const filePath = path.join(dataFolder, "materials.json");

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(content);
});
