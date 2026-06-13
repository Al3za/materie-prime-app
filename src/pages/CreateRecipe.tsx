// Qui mettiamo quello che hai già fatto:

// Upload Excel
// + TanStack Table
// + checkbox
import { useState } from "react";
import type { Material } from "../types/material";
// import type { CartItem } from "../types/cartItem";
import UploadExcel from "../components/UploadExcel";
import MaterialsTable from "../components/MaterialsTable";

function CreateRecipe() {
  // const [count, setCount] = useState(0);
  const [materials, setMaterials] = useState<Material[]>([]);
  //   const [selected, setSelected] = useState<Material[]>([]); // per selezionare le materie per le ricette
  //   const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <div>
      <h1>Componi ricetta</h1>
      <UploadExcel setMaterials={setMaterials} />{" "}
      {/*Con uqesto "useState prop" passiamo i dati di upload da questo componente (UploadExcel) al componente sotto (MaterialsTable), senza bisogno di creare uno UseContext    */}
      {/*props usestate (UploadExcel file)  */}
      {/* <MaterialsTable materials={materials} /> */}
      <div style={{ marginTop: "20px" }}>
        <MaterialsTable materials={materials} />
      </div>
    </div>
  );
}

export default CreateRecipe;
