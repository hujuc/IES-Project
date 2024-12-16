import { Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Help from "./pages/Help.jsx";
import CoffeeMachineControl from "./pages/automations/CoffeeMachineControl.jsx";
import AirConditionerControl from "./pages/automations/AirConditionerControl.jsx";
import ClockControl from "./pages/automations/ClockControl.jsx";
import LampControl from "./pages/automations/LampControl.jsx";
import ShutterControl from "./pages/automations/ShutterControl.jsx";
import TVControl from "./pages/automations/TVControl.jsx";
import StereoControl from "./pages/automations/StereoControl.jsx";
import HeatedFloorsControl from "./pages/automations/HeatedFloorsControl.jsx";
import WashingMachineControl from "./pages/automations/WashingMachinaControl.jsx";
import DryerMachineControl from "./pages/automations/DryerMachineControl.jsx";
import EditProfile from "./pages/editProfile/EditProfile.jsx";

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

                <Route path="/coffeeMachine/:deviceId" element={<CoffeeMachineControl />} />

                <Route path="/airConditioner/:deviceId" element={<AirConditionerControl />} />

                <Route path="/clock/:deviceId" element={<ClockControl />} />

                <Route path="/lamp/:deviceId" element={<LampControl />} />

                <Route path="/shutter/:deviceId" element={<ShutterControl />} />

                <Route path="/shutter/:deviceId" element={<ShutterControl />} />

                <Route path="/television/:deviceId" element={<TVControl />} />

                <Route path="/shutter/:deviceId" element={<ShutterControl />} />

                <Route path="/television/:deviceId" element={<TVControl />} />

                <Route path="/stereo/:deviceId" element={<StereoControl />} />

                <Route path="/heatedFloor/:deviceId" element={<HeatedFloorsControl />} />

                <Route path="/washingMachine/:deviceId" element={<WashingMachineControl />} />

                <Route path="/dryerMachine/:deviceId" element={<DryerMachineControl />} />

                <Route path="/edit-profile/:houseId" element={<EditProfile />} />

            </Routes>
        </>
    )
}

export default App;