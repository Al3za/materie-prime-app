import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types/recipe";

export default function RecipeList() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await window.electronAPI.loadRecipes();

      setRecipes(data);
    };

    load();
  }, []);

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
              Totale €
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
                  fontWeight: 600,
                }}
              >
                {Number(recipe.totale).toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/recipe")}
      >
        ➕ Crea Ricetta
      </button>
    </div>
  );
}
