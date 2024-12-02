import { Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Help from "./pages/Help.jsx";
import CoffeeMachineControl from "./pages/CoffeeMachineControl.jsx";
import AirConditionerControl from "./pages/AirConditionerControl.jsx";
import ClockControl from "./pages/ClockControl.jsx";
import LightBulbControl from "./pages/LightBulbControl.jsx";
import ShutterControl from "./pages/ShutterControl.jsx";

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

          <Route path="/airConditioner/:deviceId" element={<AirConditionerControl />} />

          <Route path="/clock/:deviceId" element={<ClockControl />} />

          <Route path="/lamp/:deviceId" element={<LightBulbControl />} />

          <Route path="/shutter/:deviceId" element={<ShutterControl />} />

          <Route path="/shutter/:deviceId" element={<ShutterControl />} />



      </Routes>
    </>
  )
}

export default App;
