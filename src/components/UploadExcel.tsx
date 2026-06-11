// Carica file
// ↓
// parseExcel()
// ↓
// setMaterials()

// Questo componente è abbastanza semplice: serve a far scegliere un file Excel all'utente, leggerlo
// tramite parseExcel() e salvare i dati nello stato del componente padre.

// Importa la funzione che legge il file Excel e lo converte in un array di Material
import { parseExcel } from "../lib/parseExcel";
import type { Material } from "../types/material";

// Definisce le proprietà che il componente riceve
interface UploadExcelProps {
  // setMaterials è la funzione di React generata da:
  // const [materials, setMaterials] = useState<Material[]>([]); inn scr/App.tsx
  //   Permette al componente di aggiornare lo stato del componente padre.
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>; // definiamo l'interfaccia cos'i' ts non da' errors
}

// Componente React che riceve setMaterials come prop.
export default function UploadExcel({ setMaterials }: UploadExcelProps) {
  // Funzione chiamata quando l'utente seleziona un file, (quando cambia lo stato di handleFileUpload )
  const handleFileUpload = async (
    // event contiene informazioni sull'input HTML.
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // Recupera il primo file selezionato.

    const file = event.target.files?.[0]; // nome del file, non dello sheet del file

    if (!file) return;

    const materials = await parseExcel(file); // chiama la fun parseExcell
    // una volta finito il parsing del file excell, passiamo i dati formato array allo useEffect setMaterials,
    // che e' il props del file App.tsx, cosi vedremo i dati nel main page

    setMaterials(materials); // mostriamo in App.tsx i dati del file caricato ricavati su parseExcell.ts
  };

  return <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />; // handleFileUpload = la fun all inizio, che accoglie il file excell grezzo,
  // invoca parserExcell per fare parsing e data cleaning, e fa' il rendering di questi dati sulla main page App,tsx
}
