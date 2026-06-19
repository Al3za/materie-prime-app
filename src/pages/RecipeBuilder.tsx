// STEP 9 DI CHAT
// import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useRecipe } from "../context/RecipeContext"; // il context dove sono salvati i dati dei
import { useEffect, useState } from "react";
// import type { Material } from "../types/material";
import type { Recipe } from "../types/recipe";
// import type { TrasportiData } from "../types/settings";
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
    costoLavorazione,
    setCostoLavorazione,
    costoEnergia,
    setCostoEnergia,
    trasporti,
    setTrasporti,
    selectedTransport,
    setSelectedTransport,
    kgMaterials,
    setKgMaterials,
    recipeMode,
    setRecipeMode,
  } = useRecipe();

  const [recipeName, setRecipeName] = useState("");
  const [message, setMessage] = useState("");

  // Tiene traccia di locazione e costo scelto
  const locazione = async (zona: string, costo: number) => {
    setSelectedTransport({
      zona,
      costo,
    });
    console.log("trasporto selezionato", {
      zona,
      costo,
    });
  };

  // Calcolare il totale Kg della ricetta
  // const totaleKg = Object.values(kgMaterials).reduce((acc, kg) => acc + kg, 0);
  // console.log(totaleKg);
  const totaleKg = selectedMaterials.reduce(
    (acc, item) => acc + (kgMaterials[item.cod] || 0),
    0,
  );

  // Calcola costo totale materie prime
  const totaleMateriePrime = selectedMaterials.reduce((acc, item) => {
    const percentualeDaUsare =
      recipeMode === "kg"
        ? totaleKg > 0
          ? ((kgMaterials[item.cod] || 0) / totaleKg) * 100
          : 0
        : percentages[item.cod] || 0;

    return acc + (item.prezzoAcquisto * percentualeDaUsare) / 100;
  }, 0);

  //Somma totale % per non sforare 100%

  const totalePercentuali = Object.values(percentages).reduce(
    (acc, value) => acc + value,
    0,
  );

  // somma dei costi aggiuntivi
  const totaleCostiAggiuntivi =
    costoLavorazione + costoEnergia + (selectedTransport?.costo || 0);

  // il totale tra materie prime e lavorazioni/trasporti
  const totaleFinale = totaleMateriePrime + totaleCostiAggiuntivi;

  const DeleteSelected = (material: string) => {
    const exists = selectedMaterials.some((m) => m.cod === material);

    if (!exists) {
      console.log("id not found, retry");
      return;
    }

    // Rimuove dalla lista materiali
    setSelectedMaterials(selectedMaterials.filter((m) => m.cod !== material));

    // Rimuove la percentuale associata
    setPercentages((prev) => {
      const updated = { ...prev };

      delete updated[material];

      return updated;
    });

    // Rimuove i kg associati
    setKgMaterials((prev) => {
      const updated = { ...prev };

      delete updated[material];

      return updated;
    });
  };

  // FUNZIONE SALVATAGGIO RICETTA
  const handleSaveRecipe = async () => {
    if (totalePercentuali > 100) {
      console.error("La somma delle percentuali supera il 100%");
      setMessage("La somma delle percentuali supera il 100%");
      return;
    }

    if (!recipeName.trim()) {
      // alert("Inserisci nome ricetta");
      setMessage("Inserisci nome ricetta");

      return;
    }
    setMessage(`${recipeName} creata!`);

    console.log("save recipe clicked");

    const recipe: Recipe = {
      // id: // l 'id si crea nel server electron
      // mode: recipeMode? "kg":"percentuale",
      nome: recipeName,

      createdAt: new Date().toISOString(),

      items: selectedMaterials.map((item) => {
        const percentualeDaUsare =
          recipeMode === "kg"
            ? totaleKg > 0
              ? ((kgMaterials[item.cod] || 0) / totaleKg) * 100
              : 0
            : percentages[item.cod] || 0;

        return {
          cod: item.cod,
          descrizione: item.descrizione,
          prezzoAcquisto: item.prezzoAcquisto,
          kg: recipeMode === "kg" ? kgMaterials[item.cod] || 0 : null,
          // percentuale: percentages[item.cod] || 0,
          percentuale: Number(percentualeDaUsare.toFixed(2)),
          costo: Number(
            ((item.prezzoAcquisto * percentualeDaUsare) / 100).toFixed(2),
          ),
        };
      }),

      totale: Number(totaleMateriePrime.toFixed(2)),

      costoLavorazione,
      costoEnergia,
      trasporto: selectedTransport,
    };

    console.log(recipe);
    const result = await window.electronAPI.saveRecipe(recipe);

    console.log("Ricetta salvata:", result);
  };

  // Caricamento automatico con i piu' recenti dei settings data (Nord, Sud, Estero) quando si carica la pagina
  useEffect(() => {
    const load = async () => {
      const settings = await window.electronAPI.loadSettings();
      console.log(settings.trasporti);

      setTrasporti(settings.trasporti);
    };

    load();
  }, []);

  // Ogni volta che l'utente modifica i dati di coso di trasport questi si salvano nel folder e vengono mostrati quando riapriamo la pagina:
  const updateTrasporto = (zona: string, value: number) => {
    // zona: keyof typeof trasporti
    const updated = {
      ...trasporti,
      [zona]: value,
    };

    setTrasporti(updated);

    window.electronAPI.saveSettings({
      trasporti: updated,
    });
  };

  const [showTrasporti, setShowTrasporti] = useState<boolean>(false);

  // context persistent
  const updateKg = (cod: string, value: number) => {
    setKgMaterials((prev) => ({
      ...prev,
      [cod]: value,
    }));
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
      {message && <p>{message}</p>}
      {recipeMode}
      <div>
        <button
          onClick={() => [setKgMaterials({}), setRecipeMode("percentuale")]}
        >
          Ricetta %
        </button>

        <button onClick={() => [setPercentages({}), setRecipeMode("kg")]}>
          Ricetta Kg
        </button>
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
            {recipeMode === "kg" && <th>Kg</th>}
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
          {selectedMaterials.map((item: any) => {
            // calcola la percentuale del kg del singolo record / totale kg di tutti i records
            const percentualeKg =
              totaleKg > 0
                ? ((kgMaterials[item.cod] || 0) / totaleKg) * 100
                : 0;

            // a seconda del button % o KG mostriamo il corretto calcolo per fare l'operazione che c'e' nella col. "costo"
            const percentualeDaUsare =
              recipeMode === "kg" ? percentualeKg : percentages[item.cod] || 0;

            const costoRiga = (item.prezzoAcquisto * percentualeDaUsare) / 100;

            return (
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
                      border: "1px solid #ef4444",
                      backgroundColor: "#fee2e2",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fecaca")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fee2e2")
                    }
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
                {/* Kg inputs qui */}
                {recipeMode === "kg" && (
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                      textAlign: "center",
                    }}
                  >
                    <input
                      type="number"
                      value={kgMaterials[item.cod] || 0}
                      onChange={(e) =>
                        updateKg(item.cod, Number(e.target.value))
                      }
                      style={{
                        width: "80px",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />
                  </td>
                )}

                {recipeMode === "kg" ? (
                  <td>{percentualeKg.toFixed(2)}%</td>
                ) : (
                  // hgor
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
                )}
                {/* fine percentuale  */}
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {costoRiga}
                  {/* {(
                    (item.prezzoAcquisto * (percentages[item.cod] || 0)) /
                    100
                  ).toFixed(2)}{" "} */}
                  €
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "40px",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {/* COSTI AGGIUNTIVI */}
        {/*Inizio pannello costi agg */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fafafa",
            boxSizing: "border-box",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Costi aggiuntivi</h3>

          <div style={{ marginBottom: "15px" }}>
            <label>Costo lavorazione (€)</label>{" "}
            {/* Probabilmente anche questi devono essere salvati su file.json ed essere pers in chiusura app */}
            <input
              type="number"
              value={costoLavorazione}
              onChange={(e) => setCostoLavorazione(Number(e.target.value))}
              style={{
                marginLeft: "10px",
                width: "100px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Costo energia/gas (€)</label>

            <input
              type="number"
              value={costoEnergia}
              onChange={(e) => setCostoEnergia(Number(e.target.value))}
              style={{
                marginLeft: "10px",
                width: "100px",
              }}
            />
          </div>

          <div>
            <button
              onClick={() => setShowTrasporti(!showTrasporti)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #0ea5e9",
                backgroundColor: "#e0f2fe",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#bae6fd")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#e0f2fe")
              }
            >
              🚚 Configura Trasporti
            </button>
          </div>

          {showTrasporti && (
            <div
              style={{
                marginTop: "20px",
                marginLeft: "115px",
              }}
            >
              {/*inizio Nord */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <label
                  style={{
                    width: "60px",
                    fontWeight: 500,
                  }}
                >
                  Nord
                </label>

                <input
                  type="number"
                  value={trasporti.nord}
                  onChange={(e) =>
                    updateTrasporto("nord", Number(e.target.value))
                  }
                  style={{
                    width: "80px",
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      selectedTransport?.zona === "Nord" ? "#dbeafe" : "white",
                  }}
                />

                <button
                  onClick={() => locazione("Nord", trasporti.nord)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor:
                      selectedTransport?.zona === "Nord" ? "#22c55e" : "white",
                    color:
                      selectedTransport?.zona === "Nord" ? "white" : "black",
                  }}
                >
                  Seleziona
                </button>
              </div>
              {/*Fine Nord */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <label
                  style={{
                    width: "60px",
                    fontWeight: 500,
                  }}
                >
                  Sud
                </label>

                <input
                  type="number"
                  value={trasporti.sud}
                  onChange={(e) =>
                    updateTrasporto("sud", Number(e.target.value))
                  }
                  style={{
                    width: "80px",
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      selectedTransport?.zona === "Sud" ? "#dbeafe" : "white",
                  }}
                />

                <button
                  onClick={() => locazione("Sud", trasporti.sud)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor:
                      selectedTransport?.zona === "Sud" ? "#22c55e" : "white",
                    color:
                      selectedTransport?.zona === "Sud" ? "white" : "black",
                  }}
                >
                  Seleziona
                </button>
              </div>

              {/*Fine Sud */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <label
                  style={{
                    width: "60px",
                    fontWeight: 500,
                  }}
                >
                  Estero
                </label>

                <input
                  type="number"
                  value={trasporti.estero}
                  onChange={(e) =>
                    updateTrasporto("estero", Number(e.target.value))
                  }
                  style={{
                    width: "80px",
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      selectedTransport?.zona === "Estero"
                        ? "#dbeafe"
                        : "white",
                  }}
                />

                <button
                  onClick={() => locazione("Estero", trasporti.estero)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor:
                      selectedTransport?.zona === "Estero"
                        ? "#22c55e"
                        : "white",
                    color:
                      selectedTransport?.zona === "Estero" ? "white" : "black",
                  }}
                >
                  Seleziona
                </button>
              </div>
              {/*Fine Estero */}
            </div>
          )}
        </div>

        {/* RIEPILOGO */}
        {/*Inizio pannello Riepilogo */}
        <div
          style={{
            // width: "320px",
            flex: "1",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            // backgroundColor: "#fff",
            backgroundColor: "#fafafa",
            boxSizing: "border-box",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Riepilogo</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span>Materie Prime</span>
            <strong>€ {totaleMateriePrime.toFixed(2)}</strong>
          </div>

          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "12px 0",
            }}
          >
            <span>Costi Aggiuntivi</span>
            <strong>€ {totaleCostiAggiuntivi.toFixed(2)}</strong>
          </div>

          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <span>Totale Ricetta</span>
            <span>€ {totaleFinale.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button
          style={{
            marginRight: "10px",
            marginTop: "20px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #f59e0b",
            backgroundColor: "#fef3c7",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#fde68a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#fef3c7")
          }
          onClick={() => navigate("/create")}
        >
          Aggiungi a Ricetta
        </button>
        <button
          style={{
            marginRight: "10px",
            marginTop: "20px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #22c55e",
            backgroundColor: "#dcfce7",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#bbf7d0")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#dcfce7")
          }
          onClick={handleSaveRecipe}
        >
          Salva Ricetta
        </button>
        <button
          style={{
            marginRight: "10px",
            marginTop: "20px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #2563eb",
            backgroundColor: "#dbeafe",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#bfdbfe")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#dbeafe")
          }
          onClick={() => navigate("/show_recipes")}
        >
          Mostra ricette
        </button>
      </div>
    </div>
  );
}
