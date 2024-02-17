import connectDB from '@/app/_conf/database/connection'
import { userModel } from '@/app/_models/user'

export const patchUser = async ({ req, params, session }) => {
    const { userId } = params
    if (!userId) {
        return Response.json({ error: `User id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Check user exist or not
    try {
        let user = await userModel.findOne({ _id: userId });
        if (!user) {
            return Response.json({ error: `User not found.` }, { status: 400 })
        }
        // Avoid modifying super admin
        if (session.user.role !== 'sadmin' && user.role == 'sadmin') {
            return Response.json({ error: "You can't modify a super admin" }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Settings update fields according to action
    let updateFields = {};
    switch (body.action) {
        case 'isBlock':
            // Avoid self actions
            if (userId == session.user._id) {
                return Response.json({ error: `You can't perform this action on yourself.` }, { status: 400 })
            }
            updateFields = { isBlock: body.isBlock }
            break;
        case 'resetPassword':
            updateFields = { password: body.newPassword }
            break;
        default:
            break;
    }
    // Updating user
    try {
        await userModel.updateOne({ _id: userId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}