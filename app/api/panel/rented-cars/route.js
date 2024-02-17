import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { rentedCars } from "./getController"
import { postRentedCar } from "./postController"

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions)
    // Checking sessions and applying logic from controller for each role
    if (!session) {
        return Response.json({ error: `Please sign in to access this content.` }, { status: 400 })
    } else {
        switch (session.user.role) {
            case 'sadmin':
            case 'admin':
                return await rentedCars({ req, params, session })
            default:
                return Response.json({ error: `You are not allowed to access this content.` }, { status: 400 })
        }
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions)
    // Checking sessions and applying logic from controller for each role
    if (!session) {
        return Response.json({ error: `Please sign in to access this content.` }, { status: 400 })
    } else {
        switch (session.user.role) {
            case 'sadmin':
            case 'admin':
                return await postRentedCar({ req, session })
            default:
                return Response.json({ error: `You are not allowed to access this content.` }, { status: 400 })
        }
    }
}