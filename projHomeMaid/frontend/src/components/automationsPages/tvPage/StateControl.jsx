import React from "react";
import tvOnIcon from "../../../assets/automationsPages/devices/tv/TVon.png"; // Ícone para TV ligada
import tvOffIcon from "../../../assets/automationsPages/devices/tv/TVoff.png"; // Ícone para TV desligada
import lowVolumeIcon from "../../../assets/automationsPages/stateIcons/volume/volumeMin.png"; // Ícone para volume baixo
import highVolumeIcon from "../../../assets/automationsPages/stateIcons/volume/volumeMax.png"; // Ícone para volume alto
import outlineSunIcon from "../../../assets/automationsPages/stateIcons/suns/outlineSun.png"; // Ícone de brilho baixo
import fullSunIcon from "../../../assets/automationsPages/stateIcons/suns/fullSun.png"; // Ícone de brilho alto

export default function StateControl({
                                         isTVOn,
                                         toggleTV,
                                         volume,
                                         updateVolume,
                                         brightness,
                                         updateBrightness,
                                     }) {
    return (
        <div className="flex flex-col items-center mt-6">
            {/* Botão de Estado da TV */}
            <div className="flex flex-col items-center mt-6">
                <button
                    onClick={toggleTV}
                    className="w-48 h-56 bg-white rounded-3xl flex items-center justify-center shadow-lg relative"
                >
                    {/* Fundo da TV */}
                    <div className="absolute w-32 h-32 rounded-full bg-gray-300"></div>
                    {/* Ícone da TV */}
                    <div className="z-10">
                        <img
                            src={isTVOn ? tvOnIcon : tvOffIcon}
                            alt={isTVOn ? "TV On" : "TV Off"}
                            className="w-20 h-20"
                        />
                    </div>
                </button>
                {/* Seletor do Estado */}
                <div className="mt-4 flex items-center">
                    <span className="text-lg font-medium mr-3">
                        {isTVOn ? "On" : "Off"}
                    </span>
                    <input
                        type="checkbox"
                        className="toggle bg-gray-300 checked:bg-yellow-500"
                        checked={isTVOn}
                        onChange={toggleTV}
                    />
                </div>
            </div>

            {/* Controle de Volume */}
            <div
                className={`mt-6 w-60 text-center ${
                    isTVOn ? "" : "opacity-50 pointer-events-none"
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
                            background: `linear-gradient(to right, #FFA500 ${volume}%, #e5e7eb ${volume}%)`, // Agora é laranja (#FFA500)
                        }}
                    />

                    {/* Ícone para volume alto */}
                    <img src={highVolumeIcon} alt="High Volume" className="w-7 h-7" />
                </div>
                <p className="text-white-500 mt-0">{volume}</p> {/* Exibe apenas o valor numérico do volume */}
            </div>

            {/* Controle de Brilho */}
            <div
                className={`mt-6 w-60 text-center ${
                    isTVOn ? "" : "opacity-50 pointer-events-none"
                }`}
            >
                <div className="flex justify-between items-center">
                    <img src={outlineSunIcon} alt="Low Brightness" className="w-11 h-11" />
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={brightness}
                        onChange={(e) => updateBrightness(e.target.value)}
                        className="w-full mx-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FFA500 ${brightness}%, #e5e7eb ${brightness}%)`,
                        }}
                    />
                    <img src={fullSunIcon} alt="High Brightness" className="w-11 h-11" />
                </div>
                <p className="text-white-500 mt-0">{brightness}%</p>
            </div>
        </div>
    );
}
