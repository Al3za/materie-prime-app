import { createContext, useContext, useEffect, useState } from "react";

import type { Material } from "../types/material";
import type { Wrap } from "../types/wrap";

type TransportState = {
  prezzi: {
    nord: number;
    sud: number;
    estero: number;
  };
  selected: CostOption | null;
};

export type CartaState = {
  formato: {
    "1000": number;
    "500": number;
    "250": number;
    "200": number;
  };
  selected: CostOption | null;
};

// type WrapState = {
//   options: Record<string, number>;
//   selected: CostOption | null;
// };

type WrapState = {
  options: Wrap[];
  selected: Wrap | null;
};

type ExtraCostsState = {
  lavorazione: number;
  energia: number;
};

// type RecipeMode = "percentuale" | "kg"; (dedicato)
type RecipeMode = "percentuale" | "kg";

// type comune
type CostOption = {
  formato_carta?: string;
  formato_Wrap?: string;
  costo?: number;
  zona?: string;
};

interface RecipeContextType {
  materials: Material[]; // type dei dati che andranno ad accumularsi in questo contenitore
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>; // Type della funzione di react, in modo che Ts non da' error

  selectedMaterials: Material[];
  setSelectedMaterials: React.Dispatch<React.SetStateAction<Material[]>>;

  removeMaterial: (cod: string) => void;

  addMaterial: (material: Material) => void;

  percentages: Record<string, number>; // per l'input dinamico delle percentuali

  setPercentages: React.Dispatch<React.SetStateAction<Record<string, number>>>;

  kgMaterials: Record<string, number>;

  setKgMaterials: React.Dispatch<React.SetStateAction<Record<string, number>>>;

  recipeMode: RecipeMode;

  setRecipeMode: React.Dispatch<React.SetStateAction<RecipeMode>>;

  extraCosts: ExtraCostsState;
  setExtraCosts: React.Dispatch<React.SetStateAction<ExtraCostsState>>;

  trasporti: TransportState;
  setTrasporti: React.Dispatch<React.SetStateAction<TransportState>>;

  carta: CartaState;
  setCarta: React.Dispatch<React.SetStateAction<CartaState>>;

  wrap: WrapState;
  setWrap: React.Dispatch<React.SetStateAction<WrapState>>;

  editingRecipeId: string | null;

  setEditingRecipeId: React.Dispatch<React.SetStateAction<string | null>>;

  recipeName: string;
  setRecipeName: React.Dispatch<React.SetStateAction<string>>;
}

// il context che va' nel provider
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// children e' l'intera app, wrapped in RecipeProvider nel file main.ts (per poter passare i dati in modo ersistente tra i componenti)
export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [recipeName, setRecipeName] = useState("");

  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [percentages, setPercentages] = useState<Record<string, number>>({});

  const [extraCosts, setExtraCosts] = useState<ExtraCostsState>({
    lavorazione: 0,
    energia: 0,
  });
  const [trasporti, setTrasporti] = useState<TransportState>({
    prezzi: {
      nord: 100,
      sud: 50,
      estero: 200,
    },
    selected: null as CostOption | null,
  });
  const [kgMaterials, setKgMaterials] = useState<Record<string, number>>({});
  const [recipeMode, setRecipeMode] = useState<RecipeMode>(
    "percentuale", // defauult
  );
  // Formato e prezzo di default (cambiabile) carta
  const [carta, setCarta] = useState<CartaState>({
    formato: {
      "1000": 0,
      "500": 0,
      "250": 0,
      "200": 0,
    },
    selected: null as CostOption | null,
  });

  const [wrap, setWrap] = useState<WrapState>({
    options: [],
    selected: null,
  });

  // serve per inserire il file.json caricato e passarlo nelle var context in tutta l'app
  useEffect(() => {
    const load = async () => {
      // Comunicando tramite IPC con electron, chiamiamo la fun loadMaterials nel preload.ts, che a sual volta
      // invoca "load-materials", per vedere se c'e' il file.json nella cartella "data" che sono la copia dei
      // file che abbiamo salvato in locale durante l'upload del file excell. Se  il json file esiste usiamo quello
      // altrimenti si deve caricare un nuovo file (questo serve a fare in modo che lo user carichi il file excell solo 1 volta)
      const savedMaterials = await window.electronAPI.loadMaterials();
      const saved = await window.electronAPI.loadWrap();
      const settingsCarta = await window.electronAPI.loadSettings();

      // Materials
      if (savedMaterials.length > 0) {
        setMaterials(savedMaterials);
      }

      // Wraps
      if (saved.length > 0) {
        setWrap({
          options: saved,
          selected: null,
        });
      }

      if (settingsCarta.carta) {
        setCarta((prev) => ({
          ...prev,

          formato: settingsCarta.carta, // i dati degli ultimi cambiamenti

          selected: prev.selected, // null quando riaapri l app
        }));
      }
    };

    load();
  }, []);

  const addMaterial = (material: Material) => {
    const exists = selectedMaterials.some((m) => m.cod === material.cod);

    if (!exists) {
      setSelectedMaterials([...selectedMaterials, material]);
    }
  };

  const removeMaterial = (cod: string) => {
    setSelectedMaterials((prev) => prev.filter((m) => m.cod !== cod));

    setPercentages((prev) => {
      const updated = { ...prev };
      delete updated[cod];
      return updated;
    });

    setKgMaterials((prev) => {
      const updated = { ...prev };
      delete updated[cod];
      return updated;
    });
  };

  return (
    <RecipeContext.Provider
      value={{
        materials,
        setMaterials,
        selectedMaterials,
        setSelectedMaterials,
        percentages,
        setPercentages,
        kgMaterials,
        setKgMaterials,
        recipeMode,
        setRecipeMode,
        extraCosts,
        setExtraCosts,
        trasporti,
        setTrasporti,
        carta,
        setCarta,
        wrap,
        setWrap,
        editingRecipeId,
        setEditingRecipeId,
        recipeName,
        setRecipeName,
        addMaterial,
        removeMaterial,
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
