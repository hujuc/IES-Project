import { Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <>
      <Routes>
          <Route path="/signUp" element={<SignUp />} />

          {/* Rota para Login */}
          <Route path="/login" element={<Login />} />

          {/* Rota para a HomePage  */}
          <Route path="/homePage/:houseId" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App;
