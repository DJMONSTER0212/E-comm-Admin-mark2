import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { notFound } from 'next/navigation'

const PanelLayout = async ({ children }) => {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user.role == 'sadmin' || session.user.role == 'admin')) {
        notFound();
    }
    return (
        <>
            {children}
        </>
    )
}

export default PanelLayout