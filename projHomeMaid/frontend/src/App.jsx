import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import Home from "./pages/Home.jsx";
import AirConditionerControl from "./pages/AirConditionerControl.jsx";
import CoffeeMachineControl from "./pages/CoffeeMachineControl.jsx";
import ClockControl from "./pages/ClockControl.jsx";

function App() {
  return (
    // <>
    //   <NavBar />
    //   <Routes>
    //     <Route path="/" element={<Home />} /> {/* Definir a rota para a homepage */}
    //   </Routes>
    // </>

      <>
        <ClockControl />
      </>
  )
}

export default App;
