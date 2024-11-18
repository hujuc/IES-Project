import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Welcome.jsx";
import Welcome from "./pages/Welcome.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Definir a rota para a homepage */}
      </Routes>
    </>
  )
}

export default App;
