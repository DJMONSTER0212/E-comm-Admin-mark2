import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

const page = async () => {
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
    return <p>Redirecting....</p>
}

export default page