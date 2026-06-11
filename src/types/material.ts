// Definizione tipi

export interface Material {
  data: string; // per trovare il record più recente
  cod: string;
  categoria: string; //potrebbe servirci in futuro per filtrare (non la usiamo al momento per MVP)
  descrizione: string;
  prezzoAcquisto: number;
  fornitore: string;
}
