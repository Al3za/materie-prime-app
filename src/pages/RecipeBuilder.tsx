// STEP 9 DI CHAT
// import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useRecipe, type CartaState } from "../context/RecipeContext"; // il context dove sono salvati i dati dei
import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import type { Material } from "../types/material";
import type { Recipe } from "../types/recipe";
import { parseWrapExcel } from "../lib/parseWraps";
import type { Wrap } from "../types/wrap";
// import type { TrasportiData } from "../types/settings";
// record selezionati
// import type { Material } from "../types/material";

export default function RecipeBuilder() {
  const navigate = useNavigate();

  const {
    selectedMaterials,
    setSelectedMaterials,
    percentages,
    setPercentages,
    extraCosts,
    setExtraCosts,
    trasporti,
    setTrasporti,
    kgMaterials,
    setKgMaterials,
    recipeMode,
    setRecipeMode,
    carta,
    setCarta,
    wrap,
    setWrap,
    editingRecipeId,
    setEditingRecipeId,
    recipeName,
    setRecipeName,
    removeMaterial,
  } = useRecipe();

  // const [recipeName, setRecipeName] = useState("");

  // Tiene traccia di locazione e costo scelto
  const locazione = async (zona: string, costo: number) => {
    const exist = trasporti.selected?.zona == zona;
    if (exist) {
      setTrasporti((prev) => ({
        ...prev,
        selected: {
          zona: "",
        },
      }));
    } else {
      // se non metti else non funziona
      setTrasporti((prev) => ({
        ...prev,
        selected: {
          zona,
          costo,
        },
      }));
    }
  };

  // const sele = async (zona: string, costo: number) => {}

  // Calcolare il totale Kg della ricetta
  // const totaleKg = Object.values(kgMaterials).reduce((acc, kg) => acc + kg, 0);
  const totaleKg = selectedMaterials.reduce(
    (acc, item) => acc + (kgMaterials[item.cod] || 0),
    0,
  );

  // Calcola costo totale materie prime (miscelazione)
  const totaleMateriePrime = selectedMaterials.reduce((acc, item) => {
    const percentualeDaUsare =
      recipeMode === "kg"
        ? totaleKg > 0
          ? ((kgMaterials[item.cod] || 0) / totaleKg) * 100
          : 0
        : percentages[item.cod] || 0;

    // const RoundPercentage = acc + (item.prezzoAcquisto * percentualeDaUsare) / 100; // aggiungi tofix(3)

    return acc + (item.prezzoAcquisto * percentualeDaUsare) / 100;
  }, 0);

  //Somma totale % per non sforare 100%
  const totalePercentuali = Object.values(percentages).reduce(
    (acc, value) => acc + value,
    0,
  );

  // console.log(totalePercentuali);

  // somma dei costi aggiuntivi, (costo lav, costo energia gas, costo trasporto)
  const totaleCostiAggiuntivi =
    extraCosts.lavorazione +
    extraCosts.energia +
    (trasporti.selected?.costo || 0);

  // Tot packaging
  const totalePackaging =
    (carta.selected?.costo ?? 0) + (wrap.selected?.costo ?? 0);

  // il totale tra materie prime e lavorazioni/trasporti
  const totaleFinale =
    totaleMateriePrime + totaleCostiAggiuntivi + totalePackaging;

  const DeleteSelected = (material_cod: string) => {
    if (!selectedMaterials.some((m) => m.cod === material_cod)) {
      toast.error("id not found");
      return;
    }

    removeMaterial(material_cod);
  };

  // pulisci il context on salva ricetta click
  const resetRecipe = () => {
    setSelectedMaterials([]);
    setRecipeName("");
    setPercentages({});
    setKgMaterials({});
    // setWrap({ options: [], selected: null });

    setWrap((prev) => ({
      ...prev,
      selected: null,
    }));

    setExtraCosts({
      lavorazione: 0,
      energia: 0,
    });

    // setTrasporti({
    //   prezzi: {
    //     nord: 100,
    //     sud: 50,
    //     estero: 200,
    //   },
    //   selected: null,
    // });

    setTrasporti((prev) => ({
      ...prev,
      selected: null,
    }));

    setCarta((prev) => ({
      ...prev,
      selected: null,
    }));

    // setCarta({
    //   formato: {
    //     "1000": 100,
    //     "500": 50,
    //     "250": 25,
    //     "200": 20,
    //   },
    //   selected: null,
    // });

    setRecipeMode("percentuale");
  };

  // FUNZIONE SALVATAGGIO RICETTA
  const handleSaveRecipe = async () => {
    console.log("carta.selected", carta.selected);
    if (recipeMode != "kg" && totalePercentuali != 100) {
      // toast.error("La somma delle percentuali supera il 100%");
      toast.error("La somma delle percentuali deve essere 100%");
      // setMessage("La somma delle percentuali supera il 100%");
      return;
    }

    if (!recipeName.trim()) {
      // alert("Inserisci nome ricetta");
      // setMessage("Inserisci nome ricetta");
      toast.error("Inserisci nome ricetta");

      return;
    }

    console.log("carta.selected", carta.selected);

    const recipe: Recipe = {
      // id: // l'id si crea nel server electron
      nome: recipeName,

      createdAt: new Date().toISOString(),

      recipeMode,
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

      totale: Number(totaleFinale.toFixed(2)),

      costoLavorazione: extraCosts.lavorazione,
      costoEnergia: extraCosts.energia,

      // salviamo i dati dentro l'object selected che ci serviranno per fare la duplica della ricetta
      trasporto: trasporti.selected,
      imballagio_carta: carta.selected,
      wrap: wrap.selected,
    };

    // const result = await window.electronAPI.saveRecipe(recipe);
    // se la context variabile e' stata popolata (button update in recipe list) allora faremo l'update by id
    // della ricetta salvata sul recipes.json

    if (editingRecipeId) {
      await window.electronAPI.updateRecipe(editingRecipeId, recipe);
      setEditingRecipeId(null);
      toast.success(`${recipeName} Aggiornata!`);
    } else {
      const result = await window.electronAPI.saveRecipe(recipe);
      if (!result.success) {
        toast.error(result.error ? result.error : "");
        return;
      }
      toast.success(`${recipeName} creata!`);
    }

    resetRecipe();

    navigate("/show_recipes");
  };

  // Ogni volta che l'utente modifica i dati di coso di trasport questi si salvano nel folder e vengono mostrati quando riapriamo la pagina:
  const updateTrasporto = (zona: string, costo: number) => {
    setTrasporti((prev) => ({
      ...prev,

      prezzi: {
        ...prev.prezzi,
        [zona]: costo,
      },
    }));
  };

  // update carta
  const updateCarta = async (
    formato: keyof CartaState["formato"],
    prezzo: number,
  ) => {
    console.log("prezzo", prezzo);
    const updated = {
      ...carta,

      formato: {
        ...carta.formato,

        [formato]: prezzo,
      },
      selected: {
        // formato_carta: formato,
        // aggiurniamo solo il prezzo
        costo: prezzo,
      },
    };

    setCarta(updated);

    // salviamo anche settings.json

    await window.electronAPI.saveSettings({
      carta: updated.formato,
    });
  };

  const [showTrasporti, setShowTrasporti] = useState<boolean>(false);
  const [showCarta, setShowCarta] = useState<boolean>(true);
  const [showWrap, setShowWrap] = useState<boolean>(false);

  // context persistent
  const updateKg = (cod: string, value: number) => {
    setKgMaterials((prev) => ({
      ...prev,
      [cod]: value,
    }));
  };

  function Handle_Carta(formato: string, costo: number): void {
    console.log("costo =", costo);
    // const exist = selectedCarta?.formato == formato;
    const exist = carta.selected?.formato_carta == formato;
    console.log(exist);

    if (exist) {
      setCarta((prev) => ({
        ...prev,
        selected: {
          formato_carta: "",
          // costo si azzera qui perche non definito
        },
      }));
    } else {
      setCarta((prev) => ({
        ...prev,
        selected: {
          formato_carta: formato,
          costo: costo,
        },
      }));
    }
  }

  function Handle_Wrap(item: Wrap) {
    const exists = wrap.selected?.cod === item.cod;

    if (exists) {
      setWrap((prev) => ({
        ...prev,
        selected: null,
      }));
    } else {
      setWrap((prev) => ({
        ...prev,
        selected: item,
      }));
    }
  }

  const handleWrapUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // carica il file con valigette
    const wraps = await parseWrapExcel(file);
    console.log("wraps here", wraps);

    setWrap({
      options: wraps,
      selected: null,
    });

    await window.electronAPI.saveWrap(wraps);
  };

  // Modifica prezzo del wrap selezionato
  function HandleWrapPrice(newPrice: number) {
    setWrap((prev) => ({
      ...prev,
      selected: {
        ...prev.selected!,
        costo: newPrice,
      },
    }));
  }

  return (
    <div>
      <h2>Ricetta</h2>
      <div>
        <input
          type="text"
          placeholder="Nome ricetta"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          style={{
            width: "350px",
            padding: "5px 7px",
            // borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        />
      </div>
      {recipeMode}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => [setKgMaterials({}), setRecipeMode("percentuale")]}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid #2563eb",
            cursor: "pointer",
            backgroundColor:
              recipeMode === "percentuale" ? "#2563eb" : "#dbeafe",
            color: recipeMode === "percentuale" ? "white" : "black",
          }}
        >
          Ricetta %
        </button>

        <button
          onClick={() => [setPercentages({}), setRecipeMode("kg")]}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid #2563eb",
            cursor: "pointer",
            backgroundColor: recipeMode === "kg" ? "#2563eb" : "#dbeafe",
            color: recipeMode === "kg" ? "white" : "black",
          }}
        >
          <strong>Ricetta Kg</strong>
        </button>
      </div>
      <h2>Miscelazione</h2>
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
          {recipeMode === "kg" && <col style={{ width: "120px" }} />}
          <col style={{ width: "160px" }} />
          <col style={{ width: "120px" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Elimina</th>
            <th>Codice</th>
            <th>Descrizione</th>
            <th>Prezzo</th>
            {recipeMode === "kg" && <th>Kg</th>}
            <th>{recipeMode === "kg" ? "Percentuale Kg" : "Percentuale"}</th>
            {/* <th>Percentuale</th> */}

            <th>Costo</th>
          </tr>
        </thead>

        <tbody>
          {selectedMaterials.length === 0 && (
            <tr>
              <td
                colSpan={recipeMode === "kg" ? 7 : 6}
                style={{ padding: "20px", textAlign: "center" }}
              >
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
                  {costoRiga.toFixed(2)}€
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr
            style={{
              backgroundColor: "#f8fafc",
              borderTop: "2px solid #d1d5db",
            }}
          >
            <td></td>
            <td></td>
            <td></td>
            <td></td>

            {recipeMode === "kg" && <td></td>}

            <td
              style={{
                padding: "12px",
                textAlign: "center",
                fontWeight: 700,
                color: totalePercentuali === 100 ? "#16a34a" : "#dc2626",
              }}
            >
              {totalePercentuali === 100 ? "✅" : "⚠️"}
              <br />
              {totalePercentuali}%
            </td>

            <td></td>
          </tr>
        </tfoot>
      </table>
      <div
        style={{
          display: "flex",
          color: "red",
          marginTop: "5px",
          alignItems: "flex-end",
          // width: "100%",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "40px",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: 0 }}>📦 Packaging</h3>

            {showWrap && (
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleWrapUpload}
              />
            )}
          </div>
          {/* <h3 style={{ marginTop: 0, display: "inline-flex" }}>Packaging</h3>{" "} */}

          <div style={{ marginBottom: "15px" }}>
            {/* BOTTONI packaging */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={() => [
                  showWrap && setShowWrap(false),
                  setShowCarta(!showCarta),
                ]}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #2563eb",
                  cursor: "pointer",
                  backgroundColor: showCarta ? "#2563eb" : "#dbeafe",
                  color: showCarta ? "white" : "black",
                }}
              >
                📄 Carta
              </button>
              <button
                onClick={() => [
                  showCarta && setShowCarta(false),
                  setShowWrap(!showWrap),
                ]}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #2563eb",
                  cursor: "pointer",
                  backgroundColor: showWrap ? "#2563eb" : "#dbeafe",
                  color: showWrap ? "white" : "black",
                }}
              >
                🎁 Wrap
              </button>
            </div>
          </div>
          {/*Inizio Carta (senza inputs) */}
          {showCarta && (
            <div>
              {/* Object.entries(wrap) Returns an array of key/values of the enumerable own properties of an object * */}
              {Object.entries(carta.formato).map(([formato, costo]) => {
                const formatoKey = formato as keyof CartaState["formato"];
                return (
                  <div
                    key={formato}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span>{formato}</span>

                    <input
                      type="number"
                      value={carta.formato[formatoKey]}
                      onChange={(e) =>
                        updateCarta(formatoKey, Number(e.target.value))
                      }
                    />
                    {carta.selected?.costo == costo ? (
                      <strong> € {costo} </strong>
                    ) : (
                      <span>€ {costo}</span>
                    )}

                    <button
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        backgroundColor:
                          carta.selected?.formato_carta === formato
                            ? "#22c55e"
                            : "white",
                        color:
                          carta.selected?.formato_carta === formato
                            ? "white"
                            : "black",
                      }}
                      onClick={() =>
                        Handle_Carta(formato, carta.formato[formatoKey])
                      }
                    >
                      Seleziona
                    </button>
                  </div>
                );
              })}
              {/* Mostrare la selezione corrente */}
              {/* trova bug qui  */}
              {carta.selected?.formato_carta && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    borderRadius: "6px",
                    backgroundColor: "#dcfce7",
                    border: "1px solid #22c55e",
                  }}
                >
                  ✅ Carta selezionata:{" "}
                  <strong>{carta.selected.formato_carta}</strong> (€{" "}
                  {carta.selected.costo})
                </div>
              )}
            </div>
          )}
          {/*Inizio wrap */}
          {showWrap && (
            <div>
              {/* inizio Mostra selezionato e input change costo */}
              <div>
                {wrap.selected?.formato_Wrap && (
                  <div
                    style={{
                      marginTop: "15px",
                      padding: "10px",
                      borderRadius: "6px",
                      backgroundColor: "#dcfce7",
                      border: "1px solid #22c55e",
                    }}
                  >
                    ✅ Wrap selezionato:
                    <strong>{wrap.selected?.formato_Wrap}</strong> (€{" "}
                    {wrap.selected?.costo})
                  </div>
                )}
                {/* Update input del costo dei wrap  */}
                {wrap.selected && (
                  <div
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <label>Modifica prezzo:</label>

                    <input
                      type="number"
                      value={wrap.selected.costo}
                      onChange={(e) => {
                        HandleWrapPrice(Number(e.target.value));
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                style={{
                  marginTop: "15px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  paddingRight: "6px",
                  scrollbarWidth: "thin",
                }}
              >
                {/* Object.entries(wrap) Returns an array of key/values of the enumerable own properties of an object */}
                {wrap.options.map((item) => (
                  <div
                    key={item.cod}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 70px 110px",
                      alignItems: "center",
                      gap: "15px",
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                    }}
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "space-between",
                    //   alignItems: "center",
                    //   padding: "10px",
                    //   borderBottom: "1px solid #eee",
                    // }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={`${item.formato_Wrap}`}
                    >
                      {item.formato_Wrap}
                    </span>

                    {wrap.selected?.costo == item.costo ? (
                      <strong
                        style={{
                          textAlign: "right",
                        }}
                      >
                        <span> € {item.costo}</span>
                      </strong>
                    ) : (
                      <span
                        style={{
                          textAlign: "right",
                        }}
                      >
                        {" "}
                        € {item.costo}
                      </span>
                    )}

                    <button
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        backgroundColor:
                          wrap.selected?.formato_Wrap === item.formato_Wrap
                            ? "#22c55e"
                            : "",
                        color:
                          wrap.selected?.formato_Wrap === item.formato_Wrap
                            ? "white"
                            : "black",
                      }}
                      onClick={() => Handle_Wrap(item)}
                    >
                      Seleziona
                    </button>
                  </div>
                ))}
                {/* Mostrare la selezione corrente */}
              </div>
            </div>
          )}
        </div>
        {/* RIEPILOGO */}
        {/*Inizio pannello Riepilogo */}
        <div
          style={{
            flex: "1",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fafafa",
            boxSizing: "border-box",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Riepilogo</h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "12px 0",
            }}
          >
            <strong>
              <span>Totale Miscelazione</span>
            </strong>
            <strong>€ {totaleMateriePrime.toFixed(2)}</strong>
          </div>

          <hr />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <strong>
              <span>Totale Packaging</span>
            </strong>
            <strong>€ {totalePackaging.toFixed(2)}</strong>
          </div>

          <hr />

          <div
            style={{
              display: "flex",
              // justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0",
            }}
          >
            <span style={{ width: "160px" }}> Costo Lavorazione</span>
            <input
              type="number"
              value={extraCosts.lavorazione}
              onChange={(e) =>
                setExtraCosts({
                  ...extraCosts,
                  lavorazione: Number(e.target.value),
                })
              }
              style={{
                width: "90px",
                padding: "6px",
                textAlign: "center",
              }}
            />
            <strong
              style={{
                marginLeft: "auto",
                width: "70px",
                textAlign: "right",
              }}
            >
              € {extraCosts.lavorazione}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              // justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0",
            }}
          >
            <span style={{ width: "160px" }}>Costo energia/gas</span>
            <input
              type="number"
              value={extraCosts.energia}
              onChange={(e) =>
                setExtraCosts({
                  ...extraCosts,
                  energia: Number(e.target.value),
                })
              }
              style={{
                width: "90px",
                padding: "6px",
                textAlign: "center",
              }}
            />
            <strong
              style={{
                marginLeft: "auto",
                width: "70px",
                textAlign: "right",
              }}
            >
              € {extraCosts.energia}
            </strong>
          </div>

          {/* INIZIO TRASPORTI */}

          <div
            style={{
              display: "flex",
              // justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              margin: "20px 0",
            }}
          >
            <span
              style={{
                width: "135px",
              }}
            >
              Costo trasporti
            </span>
            {/* <strong>€ {costoEnergia}</strong> */}

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
                  value={trasporti.prezzi.nord}
                  onChange={(e) =>
                    updateTrasporto("nord", Number(e.target.value))
                  } // fai in modo che quando si spunta nors, i dati si aggiornano automaticamente
                  style={{
                    width: "80px",
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      trasporti.selected?.zona === "Nord" ? "#dbeafe" : "white",
                  }}
                />

                <button
                  onClick={() => locazione("Nord", trasporti.prezzi.nord)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor:
                      trasporti.selected?.zona === "Nord" ? "#22c55e" : "white",
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
                  value={trasporti.prezzi?.sud}
                  onChange={(e) =>
                    updateTrasporto("sud", Number(e.target.value))
                  }
                  style={{
                    width: "80px",
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      trasporti.selected?.zona === "Sud" ? "#dbeafe" : "white",
                  }}
                />

                <button
                  onClick={() => locazione("Sud", trasporti.prezzi?.sud)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor:
                      trasporti.selected?.zona === "Sud" ? "#22c55e" : "white",
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
                  value={trasporti.prezzi.estero}
                  onChange={(e) =>
                    updateTrasporto("estero", Number(e.target.value))
                  }
                  style={{
                    width: "80px",
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      trasporti.selected?.zona === "Estero"
                        ? "#dbeafe"
                        : "white",
                  }}
                />

                <button
                  onClick={() => locazione("Estero", trasporti.prezzi.estero)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor:
                      trasporti.selected?.zona === "Estero"
                        ? "#22c55e"
                        : "white",
                  }}
                >
                  Seleziona
                </button>
              </div>
              {/*Fine Estero */}
            </div>
          )}

          {/* fine button trasporti  */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "12px 0",
            }}
          >
            <strong>
              <span>Totale costo Lav/Ener/Trasp</span>
            </strong>
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
          onClick={() => navigate("/")}
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
          {editingRecipeId ? "Aggiorna Ricetta" : "Salva Ricetta"}
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
      {/* <button onClick={CheckDuplicateRecipe}>Test Duplica</button> */}
      {/* <button onClick={() => navigate("/duplicate")}> duplicate</button> */}
    </div>
  );
}
