import * as XLSX from "xlsx";
import type { Wrap } from "../types/wrap";

export function parseWrapExcel(file: File): Promise<Wrap[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;

      const workbook = XLSX.read(data, {
        type: "array",
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(sheet);
      console.log("Check json", json);

      const wraps: Wrap[] =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (json as any[]).map((row) => ({
          cod: row["cod"],

          formato_Wrap: row["formato_Wrap"],

          costo: Number(row["costo"]),

          // prezzoOriginale: Number(row["Prezzo"]),
        }));

      resolve(wraps);
    };

    reader.readAsArrayBuffer(file);
  });
}
