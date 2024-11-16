import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/global/NavBar.jsx";
import Welcome from "./pages/Welcome.jsx";

function App() {
  return (
    <>
      <Routes>
<<<<<<< Updated upstream
        <Route path="/" element={<Welcome />} />
=======
        <Route path="/" element={<Welcome />} /> {/* Definir a rota para a homepage */}
>>>>>>> Stashed changes
      </Routes>
    </>
  )
}

export default App;
