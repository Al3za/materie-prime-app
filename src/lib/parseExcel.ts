// Questa funzione dovrà:

// Excel
// ↓
// Material[]

import * as XLSX from "xlsx";
import type { Material } from "../types/material";

export function parseExcel(file: File): Promise<Material[]> {
  return new Promise((resolve) => {
    const reader = new FileReader(); // crea lettore file
    reader.onload = (e) => {
      // funzione asyncrona che legge i file excelle e fa' i parsing
      const data = e.target?.result; // contenuto del file letto

      const workbook = XLSX.read(data, { type: "array" }); // parsing Excel -> sheets name, author name (alessandro calabro), nodified date... e altri metadati del file caricato

      const sheet = workbook.Sheets[workbook.SheetNames[0]]; //il primo sheet del  primo foglio  (il log mostra solo strani metadati)

      const json = XLSX.utils.sheet_to_json(sheet); // converti in JSON. Un array tutti i dati caricati come nel file,

      // Mappa le colonne che ci servono e i dati annessi
      // Un array dei dati caricati come nel file simile a quello json sopra ma solo con i dati delle colonne descritte in row
      // (ancora ci sono dati duplicati, sotto provvediamo a eliminare doppioni)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const materials: Material[] = (json as any[]).map((row) => ({
        data: row["Data"], // importante che le colonne row corrispondano col file caricato
        cod: row["Cod."],
        categoria: row["Categoria"],
        descrizione: row["Prodotto"],
        prezzoAcquisto: row["Prezzo"],
        fornitore: row["Cliente / Fornitore"],
      }));

      const latestMaterials = new Map<string, Material>();

      for (const material of materials) {
        const existing = latestMaterials.get(material.cod); // get

        if (!existing) {
          latestMaterials.set(material.cod, material); // e.s {002,"zucchero",10, agrosan} // qui i cod. uguali vengono sovrascritti dall'ultimo
          continue;
        }

        // console.log("DATA:", material.data);
        // console.log("TIPO:", typeof material.data); libreria xlsx sta restituendo 46148 che e' una codifica xcell che equivale alla data della colonna data che noi vediamo in stringa
        // quindi non c'e' bisogno convertirlo in data classica per fare la comparazione che ci filtra l'ultimo prodotto con data piu' recente
        // ma ci bastera' confrontare queste date con formato xcell che sono le stesse di quelle normali della colonna data (01/05/2026....) ma in formato excell

        const currentDate = Number(material.data);

        const existingDate = Number(existing.data);

        // se ci sono 2 date uguali per stesso prodotto usiamo solo il prod, price, client ecc.. piu' recente
        if (currentDate > existingDate) {
          latestMaterials.set(material.cod, material);
        }
      }

      const uniqueMaterials = Array.from(latestMaterials.values()); // trasforma il Map(dict) in un array

      resolve(uniqueMaterials); // ritorna dati tipizzati in formato array
    }; // finisce reader.onload

    reader.readAsArrayBuffer(file); // avvia lettura del file
  });
}

/// commenti specifici nel file .txt:
