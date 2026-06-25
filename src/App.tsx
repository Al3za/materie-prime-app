import { Routes, Route, HashRouter } from "react-router-dom"; // HashRouter legge file:///dist/index.html#/, e serve per quando navighiamo tra le routes con Electron. Grazie a questo Electron puo' leggere il file path.join(process.cwd(), "dist", "index.html"). BrowserRouter e' utile solo per dev.
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeBuilder from "./pages/RecipeBuilder";
import "./App.css";
import RecipeList from "./components/RecipeList";
import RecipeDetail from "./components/RecipeDetail";
import { Toaster } from "react-hot-toast";
import DuplicateRecipe from "./pages/DuplicateRecipe";

export default function App() {
  return (
    <>
      <Toaster />
      <HashRouter>
        {" "}
        {/* HashRouter serve in modo che l'app desktop costruita con electron trova i giusti path anche quando l'app gira su altri pc, e evita error tipo 'route not found' o pagina bianca dell'app */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/duplicate" element={<DuplicateRecipe />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/recipe" element={<RecipeBuilder />} />
          <Route path="/show_recipes" element={<RecipeList />} />¨
          <Route path="/show_recipes/:id" element={<RecipeDetail />} />
        </Routes>
      </HashRouter>
    </>
  );
}

// "dist-electron/main.js", in main del package.json principale
