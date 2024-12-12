import React from "react";

export default function BrightnessControl({ brightness, updateBrightness, isTVOn }) {
    return (
        <div className={`mt-6 w-60 text-center ${isTVOn ? "" : "opacity-50 pointer-events-none"}`}>
            <div className="flex flex-col items-center">
                <label className="text-lg font-medium mb-2">Brightness</label>
                <div className="flex items-center justify-between w-full">
                    {/* Slider */}
                    <input
                        type="range"
                        min="10" // Valor mínimo definido como 10
                        max="100"
                        value={brightness}
                        onChange={(e) => updateBrightness(e.target.value)}
                        className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FACC15 ${brightness}%, #e5e7eb ${brightness}%)`,
                        }}
                    />
                </div>
                <p className="mt-2 text-sm text-gray-400">{brightness}%</p>
            </div>
        </div>
    );
}
