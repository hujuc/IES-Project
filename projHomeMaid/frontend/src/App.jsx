import { Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import HomePage from "./pages/HomePage.jsx";
import Welcome from "./pages/Welcome.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Help from "./pages/Help.jsx";

function App() {
  return (
    <>
      <Routes>
          {/* Rota inicial */}
          <Route path="/" element={<Welcome />} />

          {/* Rota para o AboutUs  */}
          <Route path="/aboutUs" element={<AboutUs />} />

          {/* Rota para o Help  */}
          <Route path="/help" element={<Help />} />

          {/* Rota para signUp */}
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
