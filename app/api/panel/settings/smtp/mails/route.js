import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { mailsSettings } from "./getController"
import { putMailsSettings } from "./putController"

export async function GET(req) {
    const session = await getServerSession(authOptions)
    // Checking sessions and applying logic from controller for each role
    if (!session) {
        return Response.json({ error: `Please sign in to access this content.` }, { status: 400 })
    } else {
        switch (session.user.role) {
            case 'sadmin':
            case 'admin':
                return await mailsSettings({ req })
            default:
                return Response.json({ error: `You are not allowed to access this content.` }, { status: 400 })
        }
    }
}

export async function PUT(req) {
    const session = await getServerSession(authOptions)
    // Checking sessions and applying logic from controller for each role
    if (!session) {
        return Response.json({ error: `Please sign in to access this content.` }, { status: 400 })
    } else {
        switch (session.user.role) {
            case 'sadmin':
            case 'admin':
                return await putMailsSettings({ req })
            default:
                return Response.json({ error: `You are not allowed to access this content.` }, { status: 400 })
        }
    }
}