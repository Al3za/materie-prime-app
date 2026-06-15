import { createContext, useContext, useState } from "react";

import type { Material } from "../types/material";

interface RecipeContextType {
  materials: Material[]; // type dei dati che andranno ad accumularsi in questo contenitore
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>; // Type della funzione di react, in modo che Ts non da' error
  selectedMaterials: Material[];
  setSelectedMaterials: React.Dispatch<React.SetStateAction<Material[]>>;

  percentages: Record<string, number>; // per l'input dinamico delle percentuali

  setPercentages: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// children e' l'intera app, wrapped in RecipeProvider nel file main.ts (per poter passare i dati in modo ersistente tra i componenti)
export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [percentages, setPercentages] = useState<Record<string, number>>({});

  return (
    <RecipeContext.Provider
      value={{
        materials,
        setMaterials,
        selectedMaterials,
        setSelectedMaterials,
        percentages,
        setPercentages,
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
