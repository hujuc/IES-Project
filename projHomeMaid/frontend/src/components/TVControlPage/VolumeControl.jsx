import React from "react";

export default function VolumeControl({ isTVOn, volume, updateVolume }) {
    return (
        <div
            className={`mt-6 w-60 text-center ${
                isTVOn ? "" : "opacity-50 pointer-events-none"
            }`}
        >
            <h3 className="text-lg font-medium mb-2">Volume</h3>
            <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => updateVolume(e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #FACC15 ${volume}%, #e5e7eb ${volume}%)`,
                }}
            />
            <p className="text-white-500 mt-2">{volume}%</p>
        </div>
    );
}
