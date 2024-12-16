import React from "react";
import fullsunIcon from "../../../assets/automationsPages/stateIcons/suns/fullSun.png";
import outlineSunIcon from "../../../assets/automationsPages/stateIcons/suns/outlineSun.png";
import shutteropen from "../../../assets/automationsPages/devices/shutter/shutter_open.png";
import shutterclosed from "../../../assets/automationsPages/devices/shutter/shutter_closed.png";

export default function StateControl({
                                         isShutterOpen,
                                         openPercentage,
                                         toggleShutter,
                                         updateOpenPercentage,
                                     }) {
    return (
        <div className="flex flex-col items-center mt-6">
            {/* Shutter State Button */}
            <button
                onClick={toggleShutter}
                className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
            >
                <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                <div className="z-10">
                    {isShutterOpen ? (
                        <img src={shutteropen} alt="Open Shutter" className="w-20 h-20" />
                    ) : (
                        <img src={shutterclosed} alt="Closed Shutter" className="w-20 h-20" />
                    )}
                </div>
            </button>

            {/* Shutter State Toggle */}
            <div className="mt-4 flex items-center">
                <span className="text-lg font-medium mr-3">{isShutterOpen ? "Open" : "Closed"}</span>
                <input
                    type="checkbox"
                    className="toggle bg-gray-300 checked:bg-yellow-500"
                    checked={isShutterOpen}
                    onChange={toggleShutter}
                />
            </div>

            {/* Open Percentage Control */}
            <div
                className={`mt-6 w-60 text-center ${
                    isShutterOpen ? "" : "opacity-50 pointer-events-none"
                }`}
            >
                <div className="flex justify-between items-center">
                    <img src={outlineSunIcon} alt="Closed Shutter" className="w-11 h-11" />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={openPercentage}
                        onChange={(e) => updateOpenPercentage(e.target.value)}
                        className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FACC15 ${openPercentage}%, #e5e7eb ${openPercentage}%)`,
                        }}
                    />
                    <img src={fullsunIcon} alt="Open Shutter" className="w-11 h-11" />
                </div>
                <p className="text-white-500 mt-0">{openPercentage}%</p>
            </div>
        </div>
    );
}
