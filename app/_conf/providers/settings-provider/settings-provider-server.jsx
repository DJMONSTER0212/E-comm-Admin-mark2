import React from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { SettingsProvider } from './settings-provider'
import { fetchGeneralSettings } from '@/app/_server-actions/providers/settings'

const SettingsProviderServer = async ({ children }) => {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ['settings-context'],
        queryFn: fetchGeneralSettings,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </HydrationBoundary>
    )
}

export default SettingsProviderServer