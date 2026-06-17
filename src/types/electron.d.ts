import type { Material } from "./material";
import type { Recipe } from "./recipe";
export {};

declare global {
  interface Window {
    electronAPI: {
      loadMaterials(): Promise<Material[]>; // senza promise, l'await non serve

      saveMaterials: (materials: Material[]) => Promise<boolean>;

      saveRecipe: (recipe: Recipe) => Promise<boolean>;

      loadRecipes(): Promise<Recipe[]>;

      loadSettings(): Promise<settings[]>;
    };
  }
}
