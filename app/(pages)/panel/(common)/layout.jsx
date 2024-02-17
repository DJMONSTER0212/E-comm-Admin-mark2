import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import NotFound from '@/app/_components/ui/not-found'

const PanelLayout = async ({ children }) => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role == 'user') {
        return (<NotFound />)
    }
    return (
        <>
            {children}
        </>
    )
}

export default PanelLayout