import connectDB from '@/app/_conf/database/connection'
import { authBannerModel } from '@/app/_models/auth-banner'

export const patchAuthBanner = async ({ req, params, session }) => {
    const { authBannerId } = params
    if (!authBannerId) {
        return Response.json({ error: `Auth banner id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Updating auth banner
    try {
        await authBannerModel.updateOne({ _id: authBannerId }, { $set: { isActive: body.isActive } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating auth banner failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}