import { Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<SignUp />} />

          {/* Rota para Login */}
          <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App;
