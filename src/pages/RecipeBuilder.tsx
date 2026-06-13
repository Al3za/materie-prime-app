import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function RecipeBuilder() {
  const { state } = useLocation();
  const selected = state?.selected || []; // type Materials, (i record che abbiamo scelto da MtrialsTable)

  const [percentages, setPercentages] = useState<Record<string, number>>({}); // <Record<string, number>> serve a far capire a TypeScript che tipo di dati conterrà un oggetto dinamico

  return (
    <div>
      <h2>Ricetta</h2>

      {selected.map((item: any) => (
        <div key={item.cod}>
          <span>{item.descrizione}</span>

          <input
            type="number"
            value={percentages[item.cod] || 0}
            onChange={(e) => {
              setPercentages({
                ...percentages,
                [item.cod]: Number(e.target.value),
              });
            }}
          />

          <span>
            {(item.prezzoAcquisto * (percentages[item.cod] || 0)) / 100}
          </span>
        </div>
      ))}
    </div>
  );
}
