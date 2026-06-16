"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// import type { Material } from "../src/types/material";
console.log("PRELOAD CARICATO");
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveMaterials: (materials) => electron_1.ipcRenderer.invoke("save-materials", materials),
});
