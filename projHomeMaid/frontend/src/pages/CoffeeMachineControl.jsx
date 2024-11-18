import GetBackButton from "../components/GetBackButton.jsx";
import EllipsisButton from "../components/EllipsisButton.jsx";
import CentralControl from "../components/CentralControl.jsx";
import DrinkOptions from "../components/DrinkOptions.jsx";
import Automatize from "../components/AutomatizeCoffe.jsx";

export default function CoffeeMachineControl() {
    return (
        <div
            className="relative flex flex-col items-center w-screen min-h-screen"
            style={{ backgroundColor: "#2C2A28" }} // Darker cohesive background
        >
            {/* Back Button */}
            <div className="absolute top-4 left-3 h-16 w-16">
                <GetBackButton />
            </div>

            {/* Three Dots Button */}
            <div className="absolute top-4 right-1 h-12 w-14">
                <EllipsisButton />
            </div>

            {/* Coffee Machine Title with Toggle */}
            <div className="mt-16 flex items-center justify-center">
                <div className="form-control w-60">
                    <label className="label cursor-pointer">
                        <span className="label-text text-2xl font-semibold text-white">
                            Coffee Machine
                        </span>
                        <input
                            type="checkbox"
                            className="toggle bg-gray-400 checked:bg-orange-500"
                            checked="checked"
                        />
                    </label>
                </div>
            </div>

            {/* Central Control */}
            <div className="mt-8">
                <CentralControl />
            </div>

            {/* Drink Options */}
            <div className="mt-8">
                <DrinkOptions />
            </div>

            {/* Automatize */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6">
                <div
                    className="w-full bg-[#383634] text-white p-4 rounded-lg shadow-md"
                    style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)" }} // Subtle shadow for depth
                >
                    <Automatize />
                </div>
            </div>
        </div>
    );
}
