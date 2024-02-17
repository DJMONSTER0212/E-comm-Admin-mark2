import connectDB from '@/app/_conf/database/connection'
import { userModel } from '@/app/_models/user'

export const user = async ({ req, params, session }) => {
    const { userId } = params
    if (!userId) {
        return Response.json({ error: `User id is required to fetch user.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching user
    try {
        let user = await userModel.findOne({ _id: userId });
        // Exclude super admin from results
        if (session.user.role !== 'sadmin' && user.role == 'sadmin') {
            return Response.json({ error: "You can't access a super admin account" }, { status: 400 })
        }
        return Response.json(user, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
