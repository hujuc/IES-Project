import React from "react";
import { useNavigate } from "react-router-dom";

function DeviceCard({ device, onToggle, getDeviceImage, loadingDeviceId }) {
    const navigate = useNavigate();

    const isToggleDisabled =
        (device.type === "clock" && !device.state) ||
        ((device.type === "washingMachine" ||
                device.type === "dryerMachine" ||
                device.type === "coffeeMachine") &&
            device.state);

    return (
        <div
            className="bg-white rounded-lg shadow-lg p-3 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-xl cursor-pointer w-full"
            style={{ minHeight: "230px" }} // Altura mínima ajustada
            onClick={() => navigate(`/${device.type}/${device.deviceId}`)}
        >
            {/* Título */}
            <div className="flex items-center justify-center w-full mb-0 min-h-[40px] mt-3">
                <h4 className="text-base font-semibold text-gray-800 text-center leading-snug break-words">
                    {device.name || "Unnamed Device"}
                </h4>
            </div>

            {/* Imagem */}
            <div className="flex items-center justify-center w-full h-20 mb-0">
                <img
                    src={getDeviceImage(device.type)}
                    alt={device.name || "Device"}
                    className="w-20 h-20 object-contain"
                />
            </div>

            {/* Botão de Toggle */}
            <div className="flex items-center justify-center w-full mt-2">
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isToggleDisabled) {
                            onToggle(device.deviceId, device.state, device.type);
                        }
                    }}
                    className={`w-14 h-7 flex items-center rounded-full p-1 ${
                        isToggleDisabled ? "cursor-not-allowed" : "cursor-pointer"
                    } ${
                        device.state ? "bg-orange-500" : "bg-gray-300"
                    } transition-colors duration-300`}
                >
                    <div
                        className={`w-6 h-6 bg-white rounded-full shadow-md transform ${
                            device.state ? "translate-x-7" : "translate-x-0"
                        } transition-transform duration-300`}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default DeviceCard;
