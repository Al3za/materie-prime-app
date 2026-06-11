import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
// import heroImg from "./assets/hero.png";
import "./App.css";
import type { Material } from "./types/material";
import type { CartItem } from "./types/cartItem";
import UploadExcel from "./components/UploadExcel";

function App() {
  // const [count, setCount] = useState(0);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  console.log("materials app here =", materials);
  return (
    <div>
      <h1>Mandorle coast Tool</h1>
      <UploadExcel setMaterials={setMaterials} />{" "}
      {/*props usestate (UploadExcel file)  */}
    </div>
  );
}

export default App;
