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
console.log("Electron avviato");
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
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
// Funzione saveMaterials
electron_1.ipcMain.handle("save-materials", async (_, materials) => {
    const filePath = path_1.default.join(dataFolder, "materials.json");
    fs_1.default.writeFileSync(filePath, JSON.stringify(materials, null, 2), "utf-8");
    console.log("materials.json salvato");
    return true;
});
