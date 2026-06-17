// Automatizziamo; Definiamo questo file in package.json in  "build:electron" in modo che quando si fa' il build per compilare i file main e preload in js,
// Si genera un package.json dedicato per questi file compilati, con "type":"common js" che risolvera' l'error dell main package.json al root folder che ha
// il "type":"module"(ESM). Il problema nasce perche' il "type":"module" del package.json vede tutti i file .js presenti nel progetto come ESM,
// ma a noi i file compilati nel folder dist-electron/main e preload.js ci servono in commonjs e quindi con "type":"commonjs", perche' senno' Electron lancia un errore.
// Creando un Package.json dedicato per questi file compilati, risolviamo il problema
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "dist-electron");

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

fs.writeFileSync(
  path.join(dist, "package.json"),
  JSON.stringify(
    {
      main: "main.js",
      type: "commonjs",
    },
    null,
    2,
  ),
);

console.log("Electron package.json creato");
