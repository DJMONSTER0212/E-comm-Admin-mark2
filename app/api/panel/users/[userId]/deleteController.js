import connectDB from '@/app/_conf/database/connection'
import { userModel } from '@/app/_models/user'

export const deleteUser = async ({ req, params, session }) => {
    const { userId } = params
    if (!userId) {
        return Response.json({ error: `User id is required to perform this action.` }, { status: 400 })
    }
    // Avoid self actions
    if (userId == session.user._id) {
        return Response.json({ error: `You can't perform this action on yourself.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check user exist or not
    let user;
    try {
        user = await userModel.findOne({ _id: userId });
        if (!user) {
            return Response.json({ error: `User is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for user existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Avoid deleting super admin
    if (session.user.role !== 'sadmin' && user.role == 'sadmin') {
        return Response.json({ error: "You can't delete a super admin" }, { status: 400 })
    }
    // Deleting user
    try {
        await userModel.deleteOne({ _id: userId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}