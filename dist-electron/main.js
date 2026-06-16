"use strict";
// Esegue main.ts.
// Ha accesso al filesystem, finestre, menu, notifiche, ecc.
// Usa API Electron come BrowserWindow, app, dialog.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron"); // ipcMain = comunicazione Ipc tra componenti electron (main - render - preload)
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Creiamo la cartella data
const dataFolder = path_1.default.join(process.cwd(), "data"); // crea la cartella data al root level del progetto
if (!fs_1.default.existsSync(dataFolder)) {
    fs_1.default.mkdirSync(dataFolder);
}
// function createWindow =  descrizioni della pagina che mostrano il layout dell'app:
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"), // trova e legge preload.js in questo file path (__dirname)
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.loadURL("http://localhost:5173");
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
// Funzione saveMaterials (in file locale)
electron_1.ipcMain.handle("save-materials", async (_, materials) => {
    const filePath = path_1.default.join(dataFolder, "materials.json");
    fs_1.default.writeFileSync(filePath, JSON.stringify(materials, null, 2), "utf-8");
    console.log("materials.json salvato");
    return true;
});
// Funzione load-materials (Da file locale)
electron_1.ipcMain.handle("load-materials", async () => {
    const filePath = path_1.default.join(dataFolder, "materials.json"); // dove sono salvati i dati in .json quando abbiamo caricato il file excell
    console.log("func hit");
    if (!fs_1.default.existsSync(filePath)) {
        return [];
    }
    const content = fs_1.default.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
});
// funzione Salva ricetta (In file locale)
electron_1.ipcMain.handle("save-recipe", async (_, recipe) => {
    // in _, recipe c'e l'object con i dati della ricetta
    const filePath = path_1.default.join(dataFolder, "recipes.json");
    let recipes = [];
    if (fs_1.default.existsSync(filePath)) {
        const content = fs_1.default.readFileSync(filePath, "utf-8");
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
    fs_1.default.writeFileSync(filePath, JSON.stringify(recipes, null, 2), "utf-8");
    console.log("Ricetta salvata");
    return true;
});
// funzione calcola lunghezza file recipes.json e per creare id : R0001, R0002 ecc...
