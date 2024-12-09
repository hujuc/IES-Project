import React from "react";
import lowVolumeIcon from "../../../assets/volume_min.jpg"; // Ícone para volume baixo
import highVolumeIcon from "../../../assets/volume_max.jpg"; // Ícone para volume alto

export default function VolumeControl({ isSpeakerOn, volume, updateVolume }) {
    return (
        <div
            className={`mt-6 w-60 text-center ${
                isSpeakerOn ? "" : "opacity-50 pointer-events-none"
            }`}
        >
            <div className="flex justify-between items-center">
                {/* Ícone para volume baixo */}
                <img src={lowVolumeIcon} alt="Low Volume" className="w-7 h-7" />

                {/* Slider */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => updateVolume(e.target.value)}
                    className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #34D399 ${volume}%, #e5e7eb ${volume}%)`, // Efeito visual no slider
                    }}
                />

                {/* Ícone para volume alto */}
                <img src={highVolumeIcon} alt="High Volume" className="w-7 h-7" />
            </div>
            <p className="text-white-500 mt-0">{volume}%</p> {/* Exibe o volume atual */}
        </div>
    );
}
