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
// const dataFolder = path.join(process.cwd(), "data"); // crea la cartella data al root level del progetto
// const dataFolder = path.join(
//   app.getPath("userData"), // app.getPath e importante perche trova trovano i giusti path in production, dopo aver creati il file "Mandorle Cost Tool".exe con electron-build, e li trova anche nel path del PC altri user, quelli che scaricano questo file.exe per usare l'app
//   "data",
// );
// "Dammi la cartella ufficiale (compatibile coni il tuo pc e quello di ogni pc degli user) dove l'app può salvare dati permanenti.". C:\Users\Ale\AppData\Roaming\Mandorle Cost Tool. Questa cartella viene salvata nel file system dello user
function getDataFolder() {
    if (!electron_1.app.isPackaged) {
        console.log("hit dev");
        // durante sviluppo, vediamo i dati salvati qui in vs code
        return path_1.default.join(process.cwd(), "data");
    }
    // in produzione i dati vengono salvati nel pc in un path legermente diverso che non vediamo in qui in VsCode
    return path_1.default.join(electron_1.app.getPath("userData"), "data");
}
// Evita che ci sia un message error quando l'utente apre l'ap la prima volta e non ha ancora il folder "data"
function ensureDataFolder() {
    const dataFolder = getDataFolder();
    console.log("Data folder:", dataFolder);
    if (!fs_1.default.existsSync(dataFolder)) {
        console.log("Creating folder...");
        fs_1.default.mkdirSync(dataFolder, { recursive: true }); //fs.mkdirSync(dataFolder) crea la cartella data, se non c'e'
        // { recursive: true } crea il percorso definito in datafolder, perche a volte node cerca di creare il folder data su una path che e' piu' corto dell originale, con / in meno
    }
}
// if (!fs.existsSync(dataFolder)) {
//   fs.mkdirSync(dataFolder, { recursive: true });
// }
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
    if (electron_1.app.isPackaged) {
        console.log("isPackaged confirm =", electron_1.app.isPackaged);
        win.loadFile(path_1.default.join(electron_1.app.getAppPath(), "dist", "index.html"));
    }
    else {
        console.log("is(not)Packaged confirm =", electron_1.app.isPackaged);
        win.loadURL("http://localhost:5173"); // electron lo usa in dev mode: nmp run electron:dev
    }
}
//"Esegui questo codice solo quando Electron è completamente inizializzato." Cioe' mostra il window con l'interfaccia dell'app quando l'app e' pronta all uso
electron_1.app.whenReady().then(() => {
    ensureDataFolder();
    console.log("opening folder...");
    createWindow(); // apre la inestra
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
    // const filePath = path.join(dataFolder, "materials.json");
    const filePath = path_1.default.join(getDataFolder(), "materials.json");
    fs_1.default.writeFileSync(filePath, JSON.stringify(materials, null, 2), "utf-8");
    console.log("materials.json salvato");
    return true;
});
// Funzione load-materials (Da file locale)
electron_1.ipcMain.handle("load-materials", async () => {
    // const filePath = path.join(dataFolder, "materials.json"); // dove sono salvati i dati in .json quando abbiamo caricato il file excell
    const filePath = path_1.default.join(getDataFolder(), "materials.json"); // dove sono salvati i dati in .json quando abbiamo caricato il file excell
    console.log("func hit");
    if (!fs_1.default.existsSync(filePath)) {
        return [];
    }
    const content = fs_1.default.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
});
// funzione Salva ricetta (In file locale) (ricorda di aggiungere una funzione che ti avverte se la ricetta ha lo stesso nome di un altra. poi magari fai scegliere se sovrascrivere. poi possiamo anche inserire il delete recept)
electron_1.ipcMain.handle("save-recipe", async (_, recipe) => {
    // in _, recipe c'e l'object con i dati della ricetta
    const filePath = path_1.default.join(getDataFolder(), "recipes.json");
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
// load all recipes
electron_1.ipcMain.handle("load-recipes", async () => {
    const filePath = path_1.default.join(getDataFolder(), "recipes.json");
    if (!fs_1.default.existsSync(filePath)) {
        return [];
    }
    const content = fs_1.default.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
});
// Save settings data (nord, sud, estero)
electron_1.ipcMain.handle("save-settings", async (_, settings) => {
    const filePath = path_1.default.join(getDataFolder(), "settings.json");
    fs_1.default.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
    console.log("settings salvati =", settings);
    return true;
});
// load settings data (nord, sud, estero)
electron_1.ipcMain.handle("load-settings", async () => {
    const filePath = path_1.default.join(getDataFolder(), "settings.json");
    if (!fs_1.default.existsSync(filePath)) {
        return {
            trasporti: {
                nord: 0,
                sud: 0,
                estero: 0,
            },
        };
    }
    return JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
});
