import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeBuilder from "./pages/RecipeBuilder";
import "./App.css";
import RecipeList from "./components/RecipeList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/recipe" element={<RecipeBuilder />} />
        <Route path="/show_recipes" element={<RecipeList />} />
      </Routes>
    </BrowserRouter>
  );
}
