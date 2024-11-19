import { Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import AirConditionerControl from "./pages/AirConditionerControl.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AirConditionerControl />} />
      </Routes>
    </>
  )
}

export default App;
