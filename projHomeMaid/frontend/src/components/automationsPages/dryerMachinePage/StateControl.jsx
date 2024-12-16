import React from "react";
import dryerOnIcon from "../../../assets/automationsPages/devices/dryer/dryerAut.png";
import dryerOffIcon from "../../../assets/automationsPages/devices/dryer/dryerAut.png";
import lowTempIcon from "../../../assets/automationsPages/stateIcons/temperature/lowTemperature.png";
import highTempIcon from "../../../assets/automationsPages/stateIcons/temperature/highTemperature.png";

const modeMap = {
    "Regular Dry": "regularDry",
    "Gentle Dry": "gentleDry",
    "Permanent Press": "permanentPress",
};

const formatModeToDisplay = (backendMode) =>
    Object.keys(modeMap).find((key) => modeMap[key] === backendMode) || backendMode;

export default function StateControl({
                                         isDryerOn,
                                         toggleDryer,
                                         temperature,
                                         updateTemperature,
                                         dryMode,
                                         updateDryMode,
                                         isRunning,
                                     }) {
    const handleModeChange = (e) => {
        const newModeDisplay = e.target.value;
        const newModeBackend = modeMap[newModeDisplay] || newModeDisplay;
        updateDryMode(newModeBackend);
    };

    return (
        <div className="flex flex-col items-center mt-6">
            <button
                onClick={() => toggleDryer(!isDryerOn)}
                className={`w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative ${
                    isRunning ? "opacity-50 pointer-events-none" : ""
                }`}
                disabled={isRunning}
            >
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                <div className="z-10">
                    {isDryerOn ? (
                        <img src={dryerOnIcon} alt="Dryer On" className="w-20 h-20" />
                    ) : (
                        <img src={dryerOffIcon} alt="Dryer Off" className="w-20 h-20" />
                    )}
                </div>
            </button>
            {isRunning && <p className="text-orange-500 font-semibold mt-2">Dryer Running...</p>}

            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">{isDryerOn ? "On" : "Off"}</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-orange-500"
                    checked={isDryerOn}
                    onChange={() => toggleDryer(!isDryerOn)}
                    disabled={isRunning}
                />
            </div>

            <div className="mt-6 w-60 text-center">
                <div className="flex justify-between items-center">
                    <img src={lowTempIcon} alt="Low Temperature" className="w-8 h-8" />
                    <input
                        type="range"
                        min="50"
                        max="90"
                        step="1"
                        value={temperature}
                        onChange={(e) => updateTemperature(Number(e.target.value))}
                        disabled={isRunning}
                        className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FFA726 ${
                                ((temperature - 50) / 40) * 100
                            }%, #e5e7eb ${
                                ((temperature - 50) / 40) * 100
                            }%)`,
                        }}
                    />
                    <img src={highTempIcon} alt="High Temperature" className="w-8 h-8" />
                </div>
                <p className="text-orange-500 font-semibold mt-0">{temperature}°C</p>
            </div>

            <div className="mt-6 w-60 text-center">
                <label className="text-lg font-medium">Dry Mode</label>
                <select
                    value={formatModeToDisplay(dryMode)}
                    onChange={handleModeChange}
                    disabled={isRunning}
                    className="mt-2 block w-full border border-gray-300 rounded-lg p-2 text-gray-700 font-medium bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                    {Object.keys(modeMap).map((mode) => (
                        <option key={mode} value={mode}>
                            {mode}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
