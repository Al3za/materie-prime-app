import type { Material } from "../types/material"; // type perche usato solo in development

interface MaterialsTableProps {
  materials: Material[];
}

function excelDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(1899, 11, 30);
  return new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
}

export default function MaterialsTable({ materials }: MaterialsTableProps) {
  return (
    <table border={1}>
      <thead>
        <tr>
          <th>Data</th>
          <th>Cod</th>
          <th>Descrizione</th>
          <th>Prezzo</th>
          <th>Fornitore</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((material) => (
          <tr key={material.cod}>
            <td>
              {" "}
              {excelDateToJSDate(material.data).toLocaleDateString("it-IT")}
            </td>
            <td>{material.cod}</td>
            <td>{material.descrizione}</td>
            <td>{material.prezzoAcquisto}</td>
            <td>{material.fornitore}</td>
          </tr>
        ))}
      </tbody>{" "}
      {"hallo"}
    </table>
  );
}
