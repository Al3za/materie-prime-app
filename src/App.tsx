// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeBuilder from "./pages/RecipeBuilder";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
// import heroImg from "./assets/hero.png";
import "./App.css";
// import type { Material } from "./types/material";
// import type { CartItem } from "./types/cartItem";
// import UploadExcel from "./components/UploadExcel";
// import MaterialsTable from "./components/MaterialsTable";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/recipe" element={<RecipeBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

// function App() {
//   // const [count, setCount] = useState(0);
//   const [materials, setMaterials] = useState<Material[]>([]);
//   const [cart, setCart] = useState<CartItem[]>([]);

//   // console.log("materials app here =", materials);
//   return (
//     <div>
//       <h1>Componi ricetta</h1>
//       <UploadExcel setMaterials={setMaterials} />
//       {/*props usestate (UploadExcel file)  */}
//       {/* <MaterialsTable materials={materials} /> */}
//       <div style={{ marginTop: "20px" }}>
//         <MaterialsTable materials={materials} />
//       </div>
//     </div>
//   );
// }

// export default App;
