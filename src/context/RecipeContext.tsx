import { createContext, useContext, useEffect, useState } from "react";

import type { Material } from "../types/material";

interface RecipeContextType {
  materials: Material[]; // type dei dati che andranno ad accumularsi in questo contenitore
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>; // Type della funzione di react, in modo che Ts non da' error
  selectedMaterials: Material[];
  setSelectedMaterials: React.Dispatch<React.SetStateAction<Material[]>>;

  percentages: Record<string, number>; // per l'input dinamico delle percentuali

  setPercentages: React.Dispatch<React.SetStateAction<Record<string, number>>>;

  costoLavorazione: number; // per l'input dinamico delle percentuali

  setCostoLavorazione: React.Dispatch<React.SetStateAction<number>>;

  costoEnergia: number; // per l'input dinamico delle percentuali

  setCostoEnergia: React.Dispatch<React.SetStateAction<number>>;

  trasporti: {
    nord: number;
    sud: number;
    estero: number;
  };

  setTrasporti: React.Dispatch<
    React.SetStateAction<{
      nord: number;
      sud: number;
      estero: number;
    }>
  >;
  selectedTransport: SelectedTransport | null;

  setSelectedTransport: React.Dispatch<
    React.SetStateAction<SelectedTransport | null>
  >;

  kgMaterials: Record<string, number>;

  setKgMaterials: React.Dispatch<React.SetStateAction<Record<string, number>>>;

  recipeMode: RecipeMode;

  setRecipeMode: React.Dispatch<React.SetStateAction<RecipeMode>>;

  carta: {
    "1000": number;
    "500": number;
    "250": number;
    "200": number;
  };

  setCarta: React.Dispatch<
    React.SetStateAction<{
      "1000": number;
      "500": number;
      "250": number;
      "200": number;
    }>
  >;

  selectedCarta: SelectedCarta | null;

  setSelectedCarta: React.Dispatch<React.SetStateAction<SelectedCarta | null>>;

  wrap: {
    "valigetta 2x6 opaco bianco": number;
    "valigetta 3x4 opaco nero": number;
    "valigetta 3x8 opaco verde": number;
  };

  setWrap: React.Dispatch<
    React.SetStateAction<{
      "valigetta 2x6 opaco bianco": number;
      "valigetta 3x4 opaco nero": number;
      "valigetta 3x8 opaco verde": number;
    }>
  >;

  selectedWrap: SelectedWrap | null;

  setSelectedWrap: React.Dispatch<React.SetStateAction<SelectedWrap | null>>;
}

// type dedicato per la persistenza dei traspirti selezionati
type SelectedTransport = {
  zona?: string;
  costo?: number;
};

// type RecipeMode = "percentuale" | "kg"; (dedicato)
type RecipeMode = "percentuale" | "kg";

// packaging carta
type SelectedCarta = {
  formato: string;
  costo: number;
};

// packaging wrap
type SelectedWrap = {
  nome: string;
  costo: number;
};

// type comune
type CostOption = {
  nome: string;
  costo: number;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// children e' l'intera app, wrapped in RecipeProvider nel file main.ts (per poter passare i dati in modo ersistente tra i componenti)
export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [costoLavorazione, setCostoLavorazione] = useState(0);
  const [costoEnergia, setCostoEnergia] = useState(0);
  // const [costoTrasporto, setCostoTrasporto] = useState(0);
  const [trasporti, setTrasporti] = useState({
    nord: 0,
    sud: 0,
    estero: 0,
  });
  const [selectedTransport, setSelectedTransport] =
    useState<SelectedTransport | null>(null);

  const [kgMaterials, setKgMaterials] = useState<Record<string, number>>({});
  const [recipeMode, setRecipeMode] = useState<RecipeMode>(
    "percentuale", // defauult
  );

  // Formato e prezzo di default (cambiabile) carta
  const [carta, setCarta] = useState({
    "1000": 10,
    "500": 5,
    "250": 2,
    "200": 1,
  });

  const [selectedCarta, setSelectedCarta] = useState<SelectedCarta | null>(
    null,
  );

  // Formato e prezzo di default (cambiabile) wrap. Se  il cliente vorra' modificarli in futuro, allora converrà spostarli in settings.json
  // come avevamo fatto per trasporti e packaging.
  const [wrap, setWrap] = useState({
    "valigetta 2x6 opaco bianco": 15,
    "valigetta 3x4 opaco nero": 20,
    "valigetta 3x8 opaco verde": 30,
  });

  const [selectedWrap, setSelectedWrap] = useState<SelectedWrap | null>(null);

  // serve per inserire il file.json caricato e passarlo nelle var context in tutta l'app
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
        costoLavorazione,
        setCostoLavorazione,
        costoEnergia,
        setCostoEnergia,
        trasporti,
        setTrasporti,
        selectedTransport,
        setSelectedTransport,
        kgMaterials,
        setKgMaterials,
        recipeMode,
        setRecipeMode,
        carta,
        setCarta,
        selectedCarta,
        setSelectedCarta,
        wrap,
        setWrap,
        selectedWrap,
        setSelectedWrap,
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
