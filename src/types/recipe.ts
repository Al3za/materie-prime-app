export interface RecipeItem {
  cod: string;
  descrizione: string;
  prezzoAcquisto: number;
  percentuale: number;
}

export interface Recipe {
  // id: string;
  nome: string;
  createdAt: string;
  items: RecipeItem[];
  totale: number;
}
