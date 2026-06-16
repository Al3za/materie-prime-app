import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipe } from "../context/RecipeContext";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";

import type { Material } from "../types/material";

// PROPS
interface MaterialsTableProps {
  materials: Material[];
}

export default function MaterialsTable({ materials }: MaterialsTableProps) {
  // const [selected, setSelected] = useState<Material[]>([]);

  const { selectedMaterials, setSelectedMaterials } = useRecipe();

  // quando clicchiamo su qualunque oggetto del record (cod:002, oppore  Zucchero ecc.. l'intero
  //  oggetto (record) viene salvato dentro la variabile
  // Quindi tutti i record che clicchiamo vengono salvati in un ogetto e passati nel file
  //  "recipeBuilder" tramite il props definito a fine fil => navigate(/recipe), state: { selected }.
  //  (selected contiene la lista di materie selezionate)
  const handleSelect = (material: Material) => {
    // in material(nel props sopra) passiamo tutto il record cliccato {cod:004, decrizione:acido E300 ecc..}
    const exists = selectedMaterials.some((m) => m.cod === material.cod); //true or false (all'inizio e false xke l'array selected e' vuoto e non trova m.cod)

    if (exists) {
      // se abbiamo selezionato erroneamente un record di materie, lo clicchiamo nuovamente e il .filter lo toglie dagli oggetti che abbiamo accumulato in selected
      setSelectedMaterials(
        selectedMaterials.filter((m) => m.cod !== material.cod),
      );
    } else {
      setSelectedMaterials([...selectedMaterials, material]); // aggiungi il record cliccato in selected. Con la sintassi ...selected, si accumulano piu' record cliccati, fungendo da accumulatore
    }
  };

  const columns: ColumnDef<Material>[] = [
    {
      accessorKey: "cod",
      header: "Cod",
    },
    {
      accessorKey: "descrizione",
      header: "Descrizione",
    },
    {
      accessorKey: "prezzoAcquisto",
      header: "Prezzo",
    },
    {
      accessorKey: "fornitore",
      header: "Fornitore",
    },
    {
      accessorKey: "data",
      header: "Data",
      cell: ({ row }) => {
        // funzione per trasformare data formato excell in una stringa
        const serial = row.original.data;

        const excelEpoch = new Date(1899, 11, 30);

        const date = new Date(excelEpoch.getTime() + serial * 86400000);

        return date.toLocaleDateString("it-IT");
      },
    },
  ];

  // il filtro non incide nel context xke e' locale, lo usiamo solo in questa pagina. Se il filtro
  // incidesse sul Context potrebbe essere un problema, perche il context farebbe il filtro
  // dati su tutte le pagine che condividono il context(cioe' fare update su piu' pagine).
  // Ma questo filtro e' locale, perche fa' filtro solo sui dati di questo componente(MaterialTable)
  //  in locale(const [globalFilter, setGlobalFilter] = useState("") appartiene a questo componente ).
  // il context preserva nella ram i dati caricati dal file xcell, e i record selezionati che
  // passiamo tra i componenti. utile per data sharing durante le "sessioni", cioe' fino a quando si tiene l'app accesa
  // 2000 rows data non sono per niente un problema da avere sulla ram per un pc modernp
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: materials,

    columns,
    state: {
      globalFilter,
    },

    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    getSortedRowModel: getSortedRowModel(),
  });

  const navigate = useNavigate();

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ marginBottom: "20px" }}>
        {/*Cosa fare per search input Quando i dati crescono: 
        1) quando i dati superano i 3000, usa
        useDeferredValue per filtrare. (aspetta 300 mlsec prima di filtrare, xke
        attualmete filtra ad ogni lettera che clicckiamo). 
        2) usa paginazione.
        queste tecniche sono inbuild in TanStack, ask chatGpt*/}
        <input
          type="text"
          placeholder="🔍 Cerca prodotto..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)} // usiamo setGlobalFilter, il filter nativo di TanStack
          style={{
            width: "300px",
            padding: "10px 14px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "20px",
            marginTop: "30 px",
          }}
        />
      </div>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            // in material passiamto tutto il record cliccato {cod:004, decrizione:acido E300, fornitore ecc..}
            const material = row.original; // row.original e' una funzione inbuild di TanStack

            // il m.cod === al material(row.originale).code, cambia di colore se questa condizione corrisponde quando clicchiamo su un record
            const isSelected = selectedMaterials.some(
              (m) => m.cod === material.cod,
            ); // all'inizio e false xke selected e' un arrai vuoto []. Serve per capire quale row e stato cliccato
            // per cambiare colore

            // questo serve solo a cambiare il colore quando selezioniamo o diselezioniamo il record

            return (
              <tr
                key={row.id}
                onClick={() => handleSelect(material)} // material e tutto il record (tutta la linea dati)
                style={{
                  backgroundColor: isSelected ? "#dbeafe" : "white", // cambia colore se selezioni e disselezioni
                  cursor: "pointer",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={() => {
          navigate("/recipe"); // i dati vivono nel context, quindi ci basta solo navigare tra le
          // pagine senza passare props (esempio sotto)
        }}
      >
        Mostra Ricetta
      </button>
      {/* <button
        onClick={() => {
          navigate("/recipe", {
            state: { selected },
          }); // i dati vivono nel context, quindi ci basta solo navigare tra le pagine senza passare props
        }}
      >
        Mostra Ricetta
      </button> */}
    </div>
  );
}
