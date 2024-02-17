import React from 'react'
import Sidebar from './components/sidebar'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { fetchAuthBanners } from '@/app/_server-actions/auth-banners'

const AuthLayout = async ({ children }) => {
    const session = await getServerSession(authOptions)
    // Auth >>>>>>>>>>>
    if (session) {
        switch (session.user.role) {
            case 'sadmin':
            case 'admin':
                redirect('/panel/users');
            case 'supportTeam':
                redirect('/panel/visa-leads')
            default:
                redirect('/')
        }
    }
    // Pre fetching auth banners
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ['website-auth-banners'],
        queryFn: fetchAuthBanners,
    })
    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Sidebar />
            </HydrationBoundary>
            {children}
        </>
    )
}

export default AuthLayout