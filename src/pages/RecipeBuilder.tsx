// STEP 9 DI CHAT
// import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipe } from "../context/RecipeContext"; // il context dove sono salvati i dati dei
// record selezionati

export default function RecipeBuilder() {
  // const { state } = useLocation(); // type Materials, (i record che abbiamo scelto da MtrialsTable) (prima di usare context)
  // const selected = state?.selected || []; // type Materials, (i record che abbiamo scelto da MtrialsTable) (prima di usare context)
  const navigate = useNavigate();
  // selectedMaterials e dove sono salvati i dati dei
  // record selezionati
  const { selectedMaterials } = useRecipe();

  const [percentages, setPercentages] = useState<Record<string, number>>({}); // <Record<string, number>> serve a far capire a TypeScript che tipo di dati conterrà un oggetto dinamico

  return (
    <div>
      <h2>Ricetta</h2>
      {selectedMaterials.map((item: any) => (
        <div key={item.cod}>
          <span>{item.descrizione}</span>
          <input
            type="number"
            value={percentages[item.cod] ?? ""} // l'utente vedo il field % vuoto
            onChange={(e) => {
              setPercentages({
                ...percentages,
                [item.cod]: Number(e.target.value),
              });
            }}
          />
          <span>%</span> {/*Mostra simbolo % all utente */}
          <span>
            Costo: {(item.prezzoAcquisto * (percentages[item.cod] || 0)) / 100}
          </span>
          €
        </div>
      ))}
      <button onClick={() => navigate("/create")}>Crea Ricetta</button>
    </div>
  );
}
