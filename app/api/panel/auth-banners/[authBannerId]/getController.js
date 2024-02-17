import connectDB from '@/app/_conf/database/connection'
import { authBannerModel } from '@/app/_models/auth-banner'

export const authBanner = async ({ req, params }) => {
    const { authBannerId } = params
    if (!authBannerId) {
        return Response.json({ error: `Auth banner id is required to fetch auth banner.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching auth banner
    try {
        let authBanner = await authBannerModel.findOne({ _id: authBannerId });
        return Response.json(authBanner, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching auth banner failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
