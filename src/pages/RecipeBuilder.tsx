// STEP 9 DI CHAT
// import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useRecipe } from "../context/RecipeContext"; // il context dove sono salvati i dati dei
import { useState } from "react";
// import type { Material } from "../types/material";
import type { Recipe } from "../types/recipe";
// record selezionati
// import type { Material } from "../types/material";

export default function RecipeBuilder() {
  // const { state } = useLocation(); // type Materials, (i record che abbiamo scelto da MtrialsTable) (prima di usare context)
  // const selected = state?.selected || []; // type Materials, (i record che abbiamo scelto da MtrialsTable) (prima di usare context)
  const navigate = useNavigate();
  // selectedMaterials e dove sono salvati i dati dei
  // record selezionati
  const {
    selectedMaterials,
    setSelectedMaterials,
    percentages,
    setPercentages,
  } = useRecipe();

  const [recipeName, setRecipeName] = useState("");

  // const [percentages, setPercentages] = useState<Record<string, number>>({}); // <Record<string, number>> serve a far capire a TypeScript che tipo di dati conterrà un oggetto dinamico
  // Record<K, V> è un tipo utility di TypeScript.

  // Calcola costo totale
  const totalCost = selectedMaterials.reduce((sum, item) => {
    const percentage = percentages[item.cod] || 0;

    const ingredientCost = (item.prezzoAcquisto * percentage) / 100;

    return sum + ingredientCost;
  }, 0);

  // funzione elimina materia
  const DeleteSelected = (material: any) => {
    console.log(material, typeof material);

    const exists = selectedMaterials.some((m) => m.cod === material); //true or false (all'inizio e false xke l'array selected e' vuoto e non trova m.cod)
    console.log("selectedMaterials", selectedMaterials);

    if (exists) {
      console.log(material, typeof material);
      console.log(exists, typeof exists, "exist");

      // se abbiamo selezionato erroneamente un record di materie, lo clicchiamo nuovamente e il .filter lo toglie dagli oggetti che abbiamo accumulato in selected
      setSelectedMaterials(selectedMaterials.filter((m) => m.cod !== material));
    } else {
      alert("id not found, retry");
    }
  };

  // FUNZIONE SALVATAGGIO RICETTA
  const handleSaveRecipe = async () => {
    if (!recipeName.trim()) {
      // alert("Inserisci nome ricetta");
      console.log("Inserisci nome ricetta");
      return;
    }

    console.log("save recipe clicked");

    const recipe: Recipe = {
      // id: crypto.randomUUID(), // l 'id si crea nel server electron

      nome: recipeName,

      createdAt: new Date().toISOString(),

      items: selectedMaterials.map((item) => ({
        cod: item.cod,
        descrizione: item.descrizione,
        prezzoAcquisto: item.prezzoAcquisto,
        percentuale: percentages[item.cod] || 0,
        costo: Number(
          ((item.prezzoAcquisto * (percentages[item.cod] || 0)) / 100).toFixed(
            2,
          ),
        ), // fallo diventare number
      })),

      totale: Number(totalCost.toFixed(2)),
    };

    console.log(recipe);
    const result = await window.electronAPI.saveRecipe(recipe);

    console.log("Ricetta salvata:", result);
  };

  return (
    <div>
      <h2>Ricetta</h2>
      <div>
        <input
          type="text"
          placeholder="Nome ricetta"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
        />
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "50px",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "90px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "160px" }} />
          <col style={{ width: "120px" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Azione</th>
            <th>Codice</th>
            <th>Descrizione</th>
            <th>Prezzo</th>
            <th>Percentuale</th>
            <th>Costo</th>
          </tr>
        </thead>

        <tbody>
          {selectedMaterials.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "20px", textAlign: "center" }}>
                Nessun materiale selezionato
              </td>
            </tr>
          )}
          {selectedMaterials.map((item: any) => (
            <tr key={item.cod}>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => DeleteSelected(item.cod)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {item.cod}
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={item.descrizione}
                >
                  {item.descrizione}
                </div>
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                {Number(item.prezzoAcquisto).toFixed(2)} €
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <input
                  type="number"
                  value={percentages[item.cod] ?? ""}
                  onChange={(e) => {
                    setPercentages({
                      ...percentages,
                      [item.cod]: Number(e.target.value),
                    });
                  }}
                  style={{
                    width: "80px",
                    padding: "4px",
                    textAlign: "center",
                  }}
                />{" "}
                %
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {(
                  (item.prezzoAcquisto * (percentages[item.cod] || 0)) /
                  100
                ).toFixed(2)}{" "}
                €
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          border: "2px solid #2563eb",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        Totale Ricetta: {totalCost.toFixed(2)} €
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/create")}
      >
        Aggiungi a Ricetta
      </button>
      <button onClick={handleSaveRecipe}>Salva Ricetta</button>
    </div>
  );
}
