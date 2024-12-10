import React from "react";
import GetBackButton from "./buttons/GetBackButton";

export default function AutomationsHeader() {
    return (
        <div className="w-full flex justify-between px-4 py-4">
            <div className="h-16 w-16">
                <GetBackButton />
            </div>
        </div>
    );
}
