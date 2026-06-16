import { useParams } from "react-router-dom";
import type { Recipe } from "../types/recipe";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await window.electronAPI.loadRecipes();

      setRecipes(data);
    };

    load();
  }, []);

  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) {
    return <div>Ricetta non trovata</div>;
  }

  return (
    <div>
      <h2>{recipe.nome}</h2>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
        }}
      >
        <p>
          <strong>ID:</strong> {recipe.id}
        </p>

        <p>
          <strong>Data:</strong>{" "}
          {new Date(recipe.createdAt).toLocaleDateString("it-IT")}
        </p>

        <p>
          <strong>Totale:</strong> € {Number(recipe.totale).toFixed(2)}
        </p>
      </div>

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
              Codice
            </th>

            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              Descrizione
            </th>

            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              %
            </th>

            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "center",
              }}
            >
              Costo €
            </th>
          </tr>
        </thead>

        <tbody>
          {recipe.items.map((item) => (
            <tr key={item.cod}>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                {item.cod}
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={item.descrizione}
              >
                {item.descrizione}
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                {item.percentuale}%
              </td>

              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                € {Number(item.costo).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        style={{
          marginRight: "10px",
          marginTop: "20px",
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/create")}
      >
        {" "}
        Lista Materiali{" "}
      </button>
    </div>
  );
}
