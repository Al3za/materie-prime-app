// import type { SettingsData } from "./settings";
export interface RecipeItem {
  cod: string;
  descrizione: string;
  prezzoAcquisto: number;
  percentuale: number;
  costo: number;
}

export interface Recipe {
  id?: string;
  nome: string;
  createdAt: string;
  items: RecipeItem[];
  totale: number;
  costoLavorazione?: number;
  costoEnergia: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trasporto: any;
  // trasporto: SettingsData;
}
