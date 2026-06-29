import type { Material } from "./material";
import type { Recipe } from "./recipe";
import type { SettingsData } from "./settings";
import type { Wrap } from "./wrap";
export {};
interface SaveRecipeResult {
  success: boolean;
  error?: string;
}

declare global {
  interface Window {
    electronAPI: {
      loadMaterials(): Promise<Material[]>; // senza promise, l'await non serve

      saveMaterials: (materials: Material[]) => Promise<boolean>;

      saveRecipe: (recipe: Recipe) => Promise<SaveRecipeResult>;

      loadRecipes(): Promise<Recipe[]>;

      loadSettings(): Promise<SettingsData>;

      saveSettings(trasporti: SettingsData): Promise<boolean>;

      updateRecipe: (recipeId: string, recipe: Recipe) => Promise<boolean>;

      deleteRecipe: (recipeId: string) => Promise<boolean>;

      saveWrap: (wraps: Wrap[]) => Promise<boolean>;

      loadWrap: () => Promise<Wrap[]>;
    };
  }
}
