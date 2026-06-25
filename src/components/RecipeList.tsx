import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types/recipe";
import { useRecipe } from "../context/RecipeContext";
// import { useNavigate } from "react-router-dom";

export default function RecipeList() {
  const {
    setEditingRecipeId,
    setSelectedMaterials,
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

  useEffect(() => {
    const load = async () => {
      const data = await window.electronAPI.loadRecipes();
      console.log();

      setRecipes(data);
    };

    load();
  }, []);

  const updateRecipe = (recipe: any) => {
    setEditingRecipeId(recipe.id);
    setRecipeName(recipe.nome);
    // console.log(recipe.nome);
    // ripopoliamo il context const con i dati della ricetta da modificare
    const materials = recipe.items.map((item: any) => ({
      nome: item.nome,
      cod: item.cod,
      descrizione: item.descrizione,
      prezzoAcquisto: item.prezzoAcquisto,
    }));

    setSelectedMaterials(materials);

    const restoredPercentages: Record<string, number> = {};

    recipe.items.forEach((item: any) => {
      restoredPercentages[item.cod] = item.percentuale;
    });

    setPercentages(restoredPercentages);

    const restoredKg: Record<string, number> = {};

    recipe.items.forEach((item: any) => {
      restoredKg[item.cod] = item.kg || 0;
    });

    setKgMaterials(restoredKg);

    setRecipeMode(
      Object.values(restoredKg).some((kg) => kg > 0) ? "kg" : "percentuale",
    );

    setExtraCosts({
      lavorazione: recipe.costoLavorazione || 0,

      energia: recipe.costoEnergia || 0,
    });

    setTrasporti((prev) => ({
      ...prev,
      selected: recipe.trasporto || null,
    }));

    setCarta((prev) => ({
      ...prev,
      selected: recipe.imballagio_carta || null,
    }));

    setWrap((prev) => ({
      ...prev,
      selected: recipe.wrap || null,
    }));

    // navigiamo in recipeBuilder per aggiungere ulteriori materiali
    navigate("/recipe"); // recipeBuilder
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
                  onClick={() => "crea delete button"}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#bbf7d0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fee2e2")
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
                    (e.currentTarget.style.backgroundColor = "#fee2e2")
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
                  onClick={() => updateRecipe(recipe)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#bbf7d0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fee2e2")
                  }
                >
                  update
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
        onClick={() => navigate("/recipe")}
      >
        ➕ Crea Ricetta
      </button>
    </div>
  );
}
