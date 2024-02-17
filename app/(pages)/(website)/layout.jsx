import React from 'react'
import Navbar from './components/navbar'
import Body from './components/body'
import Footer from './components/footer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const WebsiteLayout = async ({ children }) => {
    const session = await getServerSession(authOptions);
    return (
        <>
            <Navbar session={session} />
            <Body>
                {children}
                <Footer />
            </Body>
        </>
    )
}

export default WebsiteLayout