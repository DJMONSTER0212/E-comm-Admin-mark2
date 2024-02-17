import connectDB from '@/app/_conf/database/connection'
import { homepageBannerModel } from '@/app/_models/homepage-banner'

export const patchHomepageBanner = async ({ req, params, session }) => {
    const { homepageBannerId } = params
    if (!homepageBannerId) {
        return Response.json({ error: `Homepage banner id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Updating homepage banner
    try {
        await homepageBannerModel.updateOne({ _id: homepageBannerId }, { $set: { isActive: body.isActive } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating homepage banner failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}