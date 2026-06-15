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
  const { selectedMaterials, percentages, setPercentages } = useRecipe();

  // const [percentages, setPercentages] = useState<Record<string, number>>({}); // <Record<string, number>> serve a far capire a TypeScript che tipo di dati conterrà un oggetto dinamico
  // Record<K, V> è un tipo utility di TypeScript.

  const totalCost = selectedMaterials.reduce((sum, item) => {
    const percentage = percentages[item.cod] || 0;

    const ingredientCost = (item.prezzoAcquisto * percentage) / 100;

    return sum + ingredientCost;
  }, 0);

  return (
    <div>
      <h2>Ricetta</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Codice
            </th>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Descrizione
            </th>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Prezzo Acquisto
            </th>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Percentuale
            </th>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Costo
            </th>
          </tr>
        </thead>

        <tbody>
          {selectedMaterials.map((item: any) => (
            <tr key={item.cod}>
              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                {item.cod}
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  maxWidth: "80px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={item.descrizione} // Passando il mouse si vede il testo completo grazie a title.
              >
                {item.descrizione}
              </td>

              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                {item.prezzoAcquisto} €
              </td>

              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
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
                  }}
                />{" "}
                %
              </td>

              <td>
                {(
                  (item.prezzoAcquisto * (percentages[item.cod] || 0)) /
                  100
                ).toFixed(2)}
                €
              </td>
            </tr>
          ))}

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
            <h2>Totale Ricetta: {totalCost.toFixed(2)} €</h2>
          </div>
        </tbody>
      </table>

      <button
        style={{
          marginTop: "20px",
        }}
        onClick={() => navigate("/create")}
      >
        Aggiungi a Ricetta
      </button>
    </div>
  );
  // return (
  //   <div>
  //     <h2>Ricetta</h2>
  //     {selectedMaterials.map((item: any) => (
  //       <div key={item.cod}>
  //         <span>{item.cod}</span>
  //         <span>{item.descrizione}</span>
  //         <span>{item.prezzoAcquisto}</span>
  //         <input
  //           type="number"
  //           value={percentages[item.cod] ?? ""} // l'utente vedo il field % vuoto
  //           onChange={(e) => {
  //             setPercentages({
  //               ...percentages,
  //               [item.cod]: Number(e.target.value),
  //             });
  //           }}
  //         />
  //         <span>%</span> {/*Mostra simbolo % all utente */}
  //         <span>
  //           Costo: {(item.prezzoAcquisto * (percentages[item.cod] || 0)) / 100}
  //         </span>
  //         €
  //       </div>
  //     ))}
  //     <button onClick={() => navigate("/create")}>Aggiungi a Ricetta</button>
  //   </div>
  // );
}
