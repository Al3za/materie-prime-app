import { createContext, useContext, useState } from "react";

import type { Material } from "../types/material";

interface RecipeContextType {
  materials: Material[]; // type dei dati che andranno ad accumularsi in questo contenitore
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>; // Type della funzione di react, in modo che Ts non da' error
  selectedMaterials: Material[];
  setSelectedMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  return (
    <RecipeContext.Provider
      value={{
        materials,
        setMaterials,
        selectedMaterials,
        setSelectedMaterials,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error("useRecipe deve essere usato dentro RecipeProvider");
  }

  return context;
}
