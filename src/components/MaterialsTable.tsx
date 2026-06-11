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
    <div>
      <input
        type="text"
        placeholder="Cerca prodotto..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
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
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </div>
  );
}
