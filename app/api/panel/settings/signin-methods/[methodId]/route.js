import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { putSigninMethodSettings } from "./putController"
import { patchSigninMethodSettings } from "./patchController"

export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions)
    // Checking sessions and applying logic from controller for each role
    if (!session) {
        return Response.json({ error: `Please sign in to access this content.` }, { status: 400 })
    } else {
        switch (session.user.role) {
            case 'sadmin':
                return await putSigninMethodSettings({req, params})
            default:
                return Response.json({ error: `You are not allowed to access this content.` }, { status: 400 })
        }
    }
}

export async function PATCH(req, { params }) {
    const session = await getServerSession(authOptions)
    // Checking sessions and applying logic from controller for each role
    if (!session) {
        return Response.json({ error: `Please sign in to access this content.` }, { status: 400 })
    } else {
        switch (session.user.role) {
            case 'sadmin':
                return await patchSigninMethodSettings({req, params})
            default:
                return Response.json({ error: `You are not allowed to access this content.` }, { status: 400 })
        }
    }
}