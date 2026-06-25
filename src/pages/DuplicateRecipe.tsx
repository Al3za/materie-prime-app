import { useEffect, useState } from "react";
import { useRecipe } from "../context/RecipeContext";
import { useNavigate } from "react-router-dom";

// componente DuplicateRecipe
export default function DuplicateRecipe() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const navigate = useNavigate();

  // i dati context persistent a navigate page
  const {
    setSelectedMaterials,
    setPercentages,
    setKgMaterials,
    setRecipeMode,

    setExtraCosts,
    setTrasporti,
    setCarta,
    setWrap,
  } = useRecipe();

  const duplicateRecipe = () => {
    const recipe = recipes.find((r) => r.nome === selectedRecipe);
    console.log("recipe found", recipe);

    if (!recipe) return;
    // ricostruisci materiali
    const materials = recipe.items.map((item: any) => ({
      cod: item.cod,
      descrizione: item.descrizione,
      prezzoAcquisto: item.prezzoAcquisto,
    }));

    setSelectedMaterials(materials);

    // ricostruiamo percentage %
    const restoredPercentages: Record<string, number> = {};

    recipe.items.forEach((item: any) => {
      restoredPercentages[item.cod] = item.percentuale;
    });

    setPercentages(restoredPercentages);

    // Ricostruire kg
    const restoredKg: Record<string, number> = {};

    recipe.items.forEach((item: any) => {
      restoredKg[item.cod] = item.kg || 0;
    });

    setKgMaterials(restoredKg);

    setRecipeMode(
      Object.values(restoredKg).some((kg) => kg > 0) ? "kg" : "percentuale",
    );

    // costi lavorazione e trasporti
    setExtraCosts({
      lavorazione: recipe.costoLavorazione || 0,
      energia: recipe.costoEnergia || 0,
    });

    setTrasporti((prev) => ({
      ...prev,
      selected: recipe.trasporto || null,
    }));

    // carta
    setCarta((prev) => ({
      ...prev,
      selected: recipe.imballagio_carta || null,
    }));

    // wrap
    setWrap((prev) => ({
      ...prev,
      selected: recipe.wrap || null,
    }));

    console.log("Ricetta caricata", recipe);
  };

  useEffect(() => {
    const load = async () => {
      const data = await window.electronAPI.loadRecipes();

      console.log("recipes loaded", data);

      setRecipes(data);
    };

    load();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Duplica Ricetta</h2>

      <select
        value={selectedRecipe}
        onChange={(e) => setSelectedRecipe(e.target.value)}
      >
        <option value="">Seleziona una ricetta</option>

        {recipes.map((recipe) => (
          <option key={recipe.nome} value={recipe.nome}>
            {recipe.nome}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "20px" }}>
        Ricetta selezionata:
        <strong> {selectedRecipe || "Nessuna"}</strong>
      </div>
      <button onClick={duplicateRecipe} disabled={!selectedRecipe}>
        Duplica
      </button>
      {/* <button onClick={CheckDuplicateRecipe}>Test Duplica</button> */}
      <button onClick={() => navigate("/recipe")} disabled={!selectedRecipe}>
        Aggiungi
      </button>
    </div>
  );
}
