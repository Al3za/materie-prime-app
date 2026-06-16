import { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    const load = async () => {
      // Comunicando tramite IPC con electron, chiamiamo la fun loadMaterials nel preload.ts, che a sual volta
      // invoca "load-materials", per vedere se c'e' il file.json nella cartella "data" che sono la copia dei
      // file che abbiamo salvato in locale durante l'upload del file excell. Se  il json file esiste usiamo quello
      // altrimenti si deve caricare un nuovo file (questo serve a fare in modo che lo user carichi il file excell solo 1 volta)
      const savedMaterials = await window.electronAPI.loadMaterials();

      if (savedMaterials.length > 0) {
        setMaterials(savedMaterials);
      }
    };

    load();
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        materials,
        setMaterials,
        selectedMaterials,
        setSelectedMaterials,
        percentages,
        setPercentages,
      }} // le variabili contenenti i dati dei materiali del file xcell caricato e le percentuali inserite sulle materie selezionate,
      //  che passiamo in tutte le componenti delle app e sono persistenti alla navigazione grazie a RecipeContext.Providerr
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
