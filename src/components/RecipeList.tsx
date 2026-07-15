import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types/recipe";
import { useRecipe } from "../context/RecipeContext";
// import { useNavigate } from "react-router-dom";

export default function RecipeList() {
  const {
    setEditingRecipeId,
    editingRecipeId,
    duplicateRecipeId,
    setDuplicateRecipeId,
    setSelectedMaterials,
    selectedMaterials,
    setPercentages,
    setKgMaterials,
    setRecipeMode,
    setExtraCosts,
    setTrasporti,
    setCarta,
    setWrap,
    setRecipeName,
  } = useRecipe();

  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const loadRecipeIntoBuilder = (recipe: any) => {
    // RIPOPOLIAMO I DATI CONTEXT CON GLI STESSI DATI DELLA DUPLICA O UPDATE DELLA RICETTA

    console.log("recipe here", recipe);

    // materiali
    const materials = recipe.items.map((item: any) => ({
      cod: item.cod,
      descrizione: item.descrizione,
      prezzoAcquisto: item.prezzoAcquisto,
    }));
    // console.log("materials here", materials);

    setSelectedMaterials(materials);

    // Percentuali
    // console.log("recipe.RecipeMode", recipe.RecipeMode);
    if (recipe.recipeMode == "percentuale") {
      console.log("hit restoredPercentages");
      const restoredPercentages: Record<string, number> = {};

      recipe.items.forEach((item: any) => {
        restoredPercentages[item.cod] = item.percentuale;
      });

      setPercentages(restoredPercentages);
    }
    // KG .
    console.log("hit restoredKg");
    const restoredKg: Record<string, number> = {};

    recipe.items.forEach((item: any) => {
      restoredKg[item.cod] = item.kg || 0;
    });

    setKgMaterials(restoredKg);

    //Modalità
    setRecipeMode(
      Object.values(restoredKg).some((kg) => kg > 0) ? "kg" : "percentuale",
    );

    // Costi
    setExtraCosts({
      lavorazione: recipe.costoLavorazione || 0,

      energia: recipe.costoEnergia || 0,
    });

    // Trasporto
    setTrasporti((prev) => ({
      ...prev,

      selected: recipe.trasporto
        ? {
            zona: recipe.trasporto.zona,
            costo: recipe.trasporto.costo,
          }
        : null,
    }));

    // Carta
    setCarta((prev) => ({
      // forse devi aggiustare il costo value on update controlla
      ...prev,

      selected: recipe.imballagio_carta
        ? {
            formato_carta: recipe.imballagio_carta.formato_carta,
            costo: recipe.imballagio_carta.costo,
          }
        : null,
    }));

    setWrap((prev) => ({
      ...prev,
      selected: recipe.wrap
        ? {
            cod: recipe.wrap?.cod,
            formato_Wrap: recipe.wrap?.formato_Wrap,
            costo: recipe.wrap?.costo,
          }
        : null,
    }));
  };

  const loadRecipes = () => {
    const load = async () => {
      const data = await window.electronAPI.loadRecipes();
      console.log();

      setRecipes(data);
    };

    load();
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  // pulisci i dati dei contexts se clicchiamo su updates per sbaglio e vogliamo uscire dalla modalita' update
  const resetRecipeList = () => {
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

    setTrasporti((prev) => ({
      ...prev,
      selected: null,
    }));

    setCarta((prev) => ({
      ...prev,
      selected: null,
    }));

    setWrap((prev) => ({
      ...prev,
      selected: null,
    }));

    setRecipeMode("percentuale");
  };

  const openRecipeBuilder = (recipe: any, mode: "update" | "duplicate") => {
    // queste due le azzeriamo nel caso un utente inizia a scrivere input % o peso per una nuova ricetta, poi va' su recipeList e decide di modificare o duplicare una ricetta gia esistente.
    // senza questo azzeramento, ci sarebbero le % dei materiali che aveva scritto prima ancora in corso. (solo per questo caso, altrimenti i dati di context si sovrascrivono quando clicchiamo su update o duplicate)
    setPercentages({});
    setKgMaterials({});

    // dopo aver popolato i context della ricetta cliccata, vediamo se l'utente ha cliccato 'update'
    // (mode === "update"), e popoliamo anche setEditingRecipeId e setRecipeName context:
    if (mode === "update") {
      setDuplicateRecipeId(null);
      const updateExist = editingRecipeId == recipe.id;
      if (updateExist) {
        setEditingRecipeId(null); // la mettiamo qui' solo xke piu' comunicativo, poteva anche stare in resetRecipeList
        resetRecipeList(); // pulisci il context e' esci da modalita' update
        return;
      }
      setEditingRecipeId(recipe.id);
      setRecipeName(recipe.nome);
    } else {
      // in questo else arriviamo se abbiamo cliccato duplicate:
      setEditingRecipeId(null);
      const duplicateExist = duplicateRecipeId == recipe.id;
      if (duplicateExist) {
        setDuplicateRecipeId(null); // la mettiamo qui' solo xke piu' comunicativo, poteva anche stare in resetRecipeList
        resetRecipeList(); // pulisci il context e' esci da modalita' update
        return;
      }
      setEditingRecipeId(null); // per sicurezza in caso setEditingRecipeId non fosse stato resettato
      setRecipeName("");
      setDuplicateRecipeId(recipe.id);
    }

    // carrica i dati context con i dati della ricetta selezionata cliccando su 'update' o 'duplica'
    loadRecipeIntoBuilder(recipe);

    navigate("/recipe");
  };

  // delete
  const handleDelete = async (recipeId: string) => {
    // const confirmed = window.confirm(
    //   "Eliminare Ricetta?\n\nQuesta azione e' irreversibile.",
    // );
    // if (!confirmed) return;

    const confirmed = await window.electronAPI.confirmDeleteRecipe();

    console.log(confirmed);
    if (!confirmed) return;

    setEditingRecipeId(null);
    setDuplicateRecipeId(null);
    resetRecipeList();
    ////
    await window.electronAPI.deleteRecipe(recipeId);
    loadRecipes();
  };

  return (
    <div>
      <h2>Ricette salvate</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              Delete
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              ID
            </th>

            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              Nome
            </th>

            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              Data Creazione
            </th>

            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              Dettagli
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              Update
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              Duplicate
            </th>
          </tr>
        </thead>

        <tbody>
          {recipes.map((recipe) => (
            <tr
              key={recipe.id}
              style={{
                cursor: "pointer",
              }}
            >
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => handleDelete(recipe.id ? recipe.id : "")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fee2e2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  Delete
                </button>
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {recipe.id}
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={recipe.nome}
              >
                {recipe.nome}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                {new Date(recipe.createdAt).toLocaleDateString("it-IT")}
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => navigate(`/show_recipes/${recipe.id}`)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#bbf7d0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  Apri
                </button>
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => openRecipeBuilder(recipe, "update")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor:
                      editingRecipeId == recipe.id ? "#bbf7d0" : "",
                  }}
                  onMouseEnter={(e) =>
                    editingRecipeId == recipe.id
                      ? ""
                      : (e.currentTarget.style.backgroundColor = "#bbf7d0")
                  }
                  onMouseLeave={(e) =>
                    editingRecipeId == recipe.id
                      ? ""
                      : (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  update
                </button>
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => openRecipeBuilder(recipe, "duplicate")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor:
                      duplicateRecipeId == recipe.id ? "#bbf7d0" : "",
                  }}
                  onMouseEnter={(e) =>
                    duplicateRecipeId == recipe.id
                      ? ""
                      : (e.currentTarget.style.backgroundColor = "#bbf7d0")
                  }
                  onMouseLeave={(e) =>
                    duplicateRecipeId == recipe.id
                      ? ""
                      : (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  Duplicate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#22c55e")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = " #FFFFFF")
        }
        // onClick={() => navigate("/recipe")}
        onClick={() =>
          selectedMaterials.length ? navigate("/recipe") : navigate("/")
        }
      >
        {editingRecipeId
          ? "Aggiorna Ricetta"
          : duplicateRecipeId
            ? "Duplica Ricetta"
            : "➕ Crea Ricetta"}{" "}
        {/* ➕ Crea Ricetta */}
      </button>
    </div>
  );
}
