import { Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import HomePage from "./pages/HomePage.jsx";
import AirConditionerControl from "./pages/AirConditionerControl.jsx";

function App() {
  return (
    <>
      <Routes>
          <Route path="/airconditionercontrol" element={<AirConditionerControl />} />
      </Routes>
    </>
  )
}

export default App;
