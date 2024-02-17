import React, { useContext } from "react";
import { SettingsContext } from "../providers/settings-provider/settings-provider";

export default function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettingsContext must be used within a SettingsProvider');
    }
    return context;
};