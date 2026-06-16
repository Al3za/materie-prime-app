import type { Material } from "./material";
export {};

declare global {
  interface Window {
    electronAPI: {
      loadMaterials(): Promise<Material[]>; // senza promise, l'await non serve

      saveMaterials: (materials: Material[]) => Promise<boolean>;
    };
  }
}
