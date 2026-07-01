import { useParams } from "react-router-dom";
// import type { Recipe } from "../types/recipe";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<any[]>([]);

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

  return (
    <>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#f9fafb",
            padding: "25px",
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              margin: "0 0 25px 0",
              textAlign: "center",
            }}
          >
            📄 {recipe.nome}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "15px",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #eee",
              }}
            >
              <div style={{ color: "#666", fontSize: "14px" }}>ID</div>
              <strong>{recipe.id}</strong>
            </div>

            <div
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #eee",
              }}
            >
              <div style={{ color: "#666", fontSize: "14px" }}>Data</div>
              <strong>
                {new Date(recipe.createdAt).toLocaleDateString("it-IT")}
              </strong>
            </div>

            <div
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #eee",
              }}
            >
              <div style={{ color: "#666", fontSize: "14px" }}>Modalità</div>
              <strong>{recipe.recipeMode}</strong>
            </div>

            <div
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #eee",
              }}
            >
              <div style={{ color: "#666", fontSize: "14px" }}>
                Totale Ricetta
              </div>
              <strong>€ {Number(recipe.totale).toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* COSTI + PACKAGING */}

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
            alignItems: "stretch",
          }}
        >
          {/* COSTI */}

          <div
            style={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: "12px",
              background: "#fafafa",
              padding: "20px",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              💰 Costi
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                rowGap: "18px",
                alignItems: "center",
              }}
            >
              <span>Costo Miscelazione</span>
              <strong>€ {recipe.costoMiscelazione}</strong>

              <span>Costo lavorazione</span>
              <strong>€ {recipe.costoLavorazione}</strong>

              <span>Costo energia / gas</span>
              <strong>€ {recipe.costoEnergia}</strong>

              <span>Zona trasporto</span>
              <strong>{recipe.trasporto?.zona ?? "-"}</strong>

              <span>Costo trasporto</span>
              <strong>€ {recipe.trasporto?.costo ?? 0}</strong>
            </div>
          </div>

          {/* PACKAGING */}

          <div
            style={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: "12px",
              background: "#fafafa",
              padding: "20px",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              📦 Packaging
            </h3>

            {/* CARTA */}

            {recipe.imballagio_carta && (
              <>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "12px",
                    color: "#2563eb",
                  }}
                >
                  📄 Carta
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span>Formato</span>
                  <strong>{recipe.imballagio_carta.formato_carta}</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "18px",
                  }}
                >
                  <span>Costo</span>
                  <strong>€ {recipe.imballagio_carta.costo}</strong>
                </div>
              </>
            )}

            {/* WRAP */}

            {recipe.wrap && (
              <>
                <hr style={{ margin: "15px 0" }} />

                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "12px",
                    color: "#16a34a",
                  }}
                >
                  🎁 Wrap
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span>Formato</span>
                  <strong>{recipe.wrap.formato_Wrap}</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Costo</span>
                  <strong>€ {recipe.wrap.costo}</strong>
                </div>
              </>
            )}
          </div>
        </div>

        {/* TABELLA */}

        <h3
          style={{
            marginBottom: "15px",
            marginTop: "50px",
          }}
        >
          Miscelazione
        </h3>

        {/* QUI INCOLLA LA TUA TABELLA */}

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          {" "}
          <thead>
            {" "}
            <tr>
              {" "}
              <th
                style={{
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "center",
                }}
              >
                {" "}
                Codice{" "}
              </th>{" "}
              <th
                style={{
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "center",
                }}
              >
                {" "}
                Descrizione{" "}
              </th>{" "}
              {recipe.recipeMode === "kg" && (
                <th
                  style={{
                    padding: "12px",
                    borderBottom: "2px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  Kg{" "}
                </th>
              )}
              {/* {recipe.recipeMode === "kg" && <th>Kg</th>} */}
              <th
                style={{
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "center",
                }}
              >
                {" "}
                %{" "}
              </th>{" "}
              <th
                style={{
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "center",
                }}
              >
                {" "}
                Costo €{" "}
              </th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>
            {" "}
            {recipe.items.map((item: any) => (
              <tr key={item.cod}>
                {" "}
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  {item.cod}{" "}
                </td>{" "}
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
                  {" "}
                  {item.descrizione}{" "}
                </td>{" "}
                {recipe.recipeMode === "kg" && (
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                      textAlign: "center",
                    }}
                  >
                    {item.kg}
                  </td>
                )}
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  {item.percentuale}%{" "}
                </td>{" "}
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {" "}
                  € {Number(item.costo).toFixed(2)}{" "}
                </td>{" "}
              </tr>
            ))}{" "}
          </tbody>{" "}
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
    </>
  );
}
