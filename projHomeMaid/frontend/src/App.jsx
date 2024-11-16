import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/global/NavBar.jsx";
import Welcome from "./pages/Welcome.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
      </Routes>
    </>
  )
}

export default App;
