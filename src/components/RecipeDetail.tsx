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
      console.log();
      setRecipes(data);
    };

    load();
  }, []);

  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) {
    return <div>Ricetta non trovata</div>;
  }

  console.log(recipe, "check");

  console.log("check", recipe.trasporto);
  console.log("check formato", recipe.imballagio_carta); // trova imballaggio carta > 0

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px 40px",
          alignItems: "center",
        }}
      >
        <div>
          <strong>ID:</strong> {recipe.id}
        </div>

        {/* <div>
          <strong>ID:</strong> {}
        </div> */}

        <div>
          <strong>Data:</strong>{" "}
          {new Date(recipe.createdAt).toLocaleDateString("it-IT")}
        </div>

        <div>
          <strong>Totale Ricetta:</strong> €{Number(recipe.totale).toFixed(2)}
        </div>

        <div>
          <strong>Costo lavorazione:</strong> €{recipe.costoLavorazione ?? 0}
        </div>

        <div>
          <strong>Costo energia/gas:</strong> €{recipe.costoEnergia ?? 0}
        </div>

        <div>
          <strong>Zona:</strong> {recipe.trasporto?.zona ?? "-"}
        </div>

        <div>
          <strong>Costo trasporto:</strong> €{recipe.trasporto?.costo ?? 0}
        </div>
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
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#22c55e")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#FFFFFF")
        }
        onClick={() => navigate("/show_recipes")}
      >
        {" "}
        Mostra Ricette{" "}
      </button>
    </div>
  );
}
