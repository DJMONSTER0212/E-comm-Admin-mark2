'use client'
import React, { createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGeneralSettings } from '@/app/_server-actions/providers/settings'

// Settings context
export const SettingsContext = createContext();

// Settings provider component
export const SettingsProvider = ({ children }) => {
    // Fetch settings
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['settings-context'],
        queryFn: async () => { return await fetchGeneralSettings() },
    });
    // Provide the data and functions through the context
    const contextValue = {
        data,
        error,
        isLoading,
        isError,
        refetch,
    };
    return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};