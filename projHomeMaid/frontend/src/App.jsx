import { Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Definir a rota para a homepage */}
      </Routes>
    </>
  )
}

export default App;
