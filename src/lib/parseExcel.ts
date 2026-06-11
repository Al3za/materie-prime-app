// Questa funzione dovrà:

// Excel
// ↓
// Material[]

import * as XLSX from "xlsx";
import type { Material } from "../types/material";

// function excelDateToJSDate(serial: number): Date {
//   const excelEpoch = new Date(1899, 11, 30);

//   return new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
// }

// function parseItalianDate(dateString: string): Date {
//   console.log("check data", dateString);
//   console.log("check data type", typeof dateString);
//   const [day, month, year] = dateString.split("/");

//   return new Date(Number(year), Number(month) - 1, Number(day));
// }

export function parseExcel(file: File): Promise<Material[]> {
  return new Promise((resolve) => {
    const reader = new FileReader(); // crea lettore file
    console.log("parser excell hit 1");
    reader.onload = (e) => {
      const data = e.target?.result; // contenuto del file letto

      console.log("parseExcell 1", data);

      const workbook = XLSX.read(data, { type: "array" }); // parsing Excel

      console.log("parseExcell workbook", workbook);

      const sheet = workbook.Sheets[workbook.SheetNames[0]]; // primo foglio (il primo sheet)
      console.log("parseExcell sheet", sheet);

      const json = XLSX.utils.sheet_to_json(sheet); // converti in JSON
      console.log("parseExcell json", json);

      // Mappa le colonne che ci servono
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const materials: Material[] = (json as any[]).map((row) => ({
        data: row["Data"],
        cod: row["Cod"],
        categoria: row["Categoria"],
        descrizione: row["Prodotto"],
        prezzoAcquisto: row["Prezzo"],
        fornitore: row["Cliente"],
      }));

      console.log("parseExcell materials", materials);

      const latestMaterials = new Map<string, Material>();

      for (const material of materials) {
        const existing = latestMaterials.get(material.cod);
        console.log("parseExcell loop materials", material);

        if (!existing) {
          console.log("material cod exist =", material.cod);
          console.log("latestMaterials before existing", latestMaterials);
          latestMaterials.set(material.cod, material); // qui i cod. uguali vengono sovrascritti dall'ultimo
          console.log("latestMaterials after existing", latestMaterials);
          continue;
        }

        // console.log("DATA:", material.data);
        // console.log("TIPO:", typeof material.data); libreria xlsx sta restituendo 46148 che e' una codifica xcell che equivale alla data della colonna data che noi vediamo in stringa
        // quindi non c'e' bisogno convertirlo in data classica per fare la comparazione che ci filtra l'ultimo prodotto con data piu' recente
        // ma ci bastera' confrontare queste date con formato xcell che sono le stesse di quelle normali della colonna data (01/05/2026....) ma in formato excell

        const currentDate = Number(material.data);

        const existingDate = Number(existing.data);

        if (currentDate > existingDate) {
          latestMaterials.set(material.cod, material);
        }
      }

      const uniqueMaterials = Array.from(latestMaterials.values());
      console.log("uniqueMaterials testing", uniqueMaterials);

      resolve(uniqueMaterials); // ritorna dati tipizzati
    }; // finisce reader.onload

    reader.readAsArrayBuffer(file); // avvia lettura del file
  });
}

/// commenti specifici nel file .txt:
