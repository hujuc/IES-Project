import React from "react";
import speakerOnIcon from "../../../assets/automationsPages/devices/stereo/stereoOn.png"; // Ícone para Speaker ligado
import speakerOffIcon from "../../../assets/automationsPages/devices/stereo/stereoOff.png"; // Ícone para Speaker desligado
import lowVolumeIcon from "../../../assets/automationsPages/stateIcons/volume/volumeMin.png"; // Ícone para volume baixo
import highVolumeIcon from "../../../assets/automationsPages/stateIcons/volume/volumeMax.png"; // Ícone para volume alto

export default function StateControl({
                                         isSpeakerOn,
                                         toggleSpeaker,
                                         volume,
                                         updateVolume,
                                     }) {
    return (
        <div className="flex flex-col items-center">
            {/* Botão de Estado */}
            <div className="flex flex-col items-center mt-6">
                <button
                    onClick={() => toggleSpeaker()}
                    className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
                >
                    {/* Fundo do Speaker */}
                    <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                    {/* Ícone do Speaker */}
                    <div className="z-10">
                        {isSpeakerOn ? (
                            <img
                                src={speakerOnIcon}
                                alt="Speaker On"
                                className="w-20 h-20"
                            />
                        ) : (
                            <img
                                src={speakerOffIcon}
                                alt="Speaker Off"
                                className="w-20 h-20"
                            />
                        )}
                    </div>
                </button>
                {/* Seletor do estado */}
                <div className="mt-4 flex items-center">
                    <span className="text-lg font-medium mr-3">
                        {isSpeakerOn ? "On" : "Off"}
                    </span>
                    <input
                        type="checkbox"
                        className="toggle bg-gray-300 checked:bg-yellow-500"
                        checked={isSpeakerOn}
                        onChange={() => toggleSpeaker()}
                    />
                </div>
            </div>

            {/* Controle de Volume */}
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
                <p className="text-white-500 mt-0">{volume}</p> {/* Exibe apenas o valor numérico do volume */}
            </div>
        </div>
    );
}
