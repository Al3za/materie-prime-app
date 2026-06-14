import { StrictMode } from "react";
import { RecipeProvider } from "./context/RecipeContext.tsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*wrappiamo l'app nel context in modo da poter condividere dati in tutti i file/componenti dell'app */}
    <RecipeProvider>
      <App />
    </RecipeProvider>
  </StrictMode>,
);
