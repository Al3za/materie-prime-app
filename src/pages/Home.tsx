import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Recipe System</h1>

      <button onClick={() => navigate("/create")}>Crea Ricetta</button>

      <button>Duplica Ricetta</button>
    </div>
  );
}
