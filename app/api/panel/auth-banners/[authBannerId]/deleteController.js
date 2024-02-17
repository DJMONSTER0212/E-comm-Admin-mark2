import connectDB from '@/app/_conf/database/connection'
import { authBannerModel } from '@/app/_models/auth-banner'

export const deleteAuthBanner = async ({ req, params, session }) => {
    const { authBannerId } = params
    if (!authBannerId) {
        return Response.json({ error: `Auth banner id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check auth banner exist or not
    try {
        const isAuthBannerExist = await authBannerModel.countDocuments({ _id: authBannerId });
        if (isAuthBannerExist == 0) {
            return Response.json({ error: `Auth banner is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for auth banner existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting auth banner
    try {
        await authBannerModel.deleteOne({ _id: authBannerId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting auth banner failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}