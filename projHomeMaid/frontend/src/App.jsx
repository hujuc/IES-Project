import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import Home from "./pages/Home.jsx";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Definir a rota para a homepage */}
      </Routes>
    </>
  )
}

export default App;
