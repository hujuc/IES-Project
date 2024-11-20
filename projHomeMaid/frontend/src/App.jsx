import { Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";

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

          <Route path="/coffeemachine/:deviceId" element={<CoffeeMachineControl />} />

      </Routes>
    </>
  )
}

export default App;
