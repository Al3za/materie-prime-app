import { useState } from "react";

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
          onChange={(e) => setGlobalFilter(e.target.value)}
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
      {/* <input
        type="text"
        placeholder="Cerca prodotto..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      /> */}
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
