import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import Home from "./pages/Home.jsx";
import AirConditionerControl from "./pages/AirConditionerControl.jsx";
import CoffeeMachineControl from "./pages/CoffeeMachineControl.jsx";

function App() {
  return (
    // <>
    //   <NavBar />
    //   <Routes>
    //     <Route path="/" element={<Home />} /> {/* Definir a rota para a homepage */}
    //   </Routes>
    // </>

      <>
        <AirConditionerControl />
      </>
  )
}

export default App;
