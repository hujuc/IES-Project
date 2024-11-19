import GetBackButton from "../components/GetBackButton.jsx";
import EllipsisButton from "../components/EllipsisButton.jsx";
import TemperatureControl from "../components/TemperatureControl.jsx";
import AirFluxControl from "../components/AirFluxControl.jsx";
import Automatize from "../components/AutomatizeAirCond.jsx";
import React, { useEffect, useState } from "react";
import "../index.css";

export default function AirConditionerControl() {
    return (
        <div
            className="flex flex-col items-center w-screen min-h-screen"
            style={{ backgroundColor: "#433F3C" }}
        >
            {/* Top Bar */}
            <div className="w-full flex justify-between px-4 py-4">
                {/* Back Button */}
                <div className="h-16 w-16">
                    <GetBackButton />
                </div>
                {/* Three Dots Button */}
                <div className="h-12 w-14">
                    <EllipsisButton />
                </div>
            </div>

            {/* Title Section */}
            <div className="flex flex-col items-center justify-center mt-4">
                <div className="form-control w-60">
                    <label className="label cursor-pointer">
                        <span className="label-text text-2xl font-semibold text-white">
                            Air Conditioner
                        </span>
                        <input
                            type="checkbox"
                            className="toggle bg-gray-300 checked:bg-orange-500"
                            checked="checked"
                        />
                    </label>
                </div>
            </div>

            {/* Temperature Control */}
            <div className="mt-8">
                <TemperatureControl />
            </div>

            {/* Air Flux Control */}
            <div className="mt-8">
                <AirFluxControl />
            </div>

            {/* Automatize */}
            <div className="flex flex-col items-center justify-center mt-8 mb-6">
                <Automatize />
            </div>
        </div>
    );
}
