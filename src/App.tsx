import { Routes, Route, HashRouter } from "react-router-dom"; // HashRouter legge file:///dist/index.html#/, e serve per quando navighiamo tra le routes con Electron. Grazie a questo Electron puo' leggere il file path.join(process.cwd(), "dist", "index.html"). BrowserRouter e' utile solo per dev.
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeBuilder from "./pages/RecipeBuilder";
import "./App.css";
import RecipeList from "./components/RecipeList";
import RecipeDetail from "./components/RecipeDetail";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/recipe" element={<RecipeBuilder />} />
        <Route path="/show_recipes" element={<RecipeList />} />¨
        <Route path="/show_recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </HashRouter>
  );
}
