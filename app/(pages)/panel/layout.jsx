import React from 'react'
import Sidebar from './components/sidebar'
import Body from './components/body'
import Footer from './components/footer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

const PanelLayout = async ({ children }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/auth/signin`)
  }
  return (
    <>
      {/* // Sidebar >>>>>>>>>>>> */}
      <Sidebar session={session} />
      {/* // Body >>>>>>>>>>>> */}
      <Body>
        {/* // Children/Page content >>>>>>>>>>>> */}
        {children}
        {/* // Footer >>>>>>>>>>>> */}
        <Footer />
      </Body>
    </>
  )
}

export default PanelLayout