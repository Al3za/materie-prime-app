// usa type quando importi un interface, xke e usata solo a compile time
import type { Material } from "./material";

export interface CartItem extends Material {
  percentuale: number; // estende l'interfaccia Material aggiungendo percentuale
}
