import connectDB from '@/app/_conf/database/connection'
import { homepageBannerModel } from '@/app/_models/homepage-banner'

export const deleteHomepageBanner = async ({ req, params, session }) => {
    const { homepageBannerId } = params
    if (!homepageBannerId) {
        return Response.json({ error: `Homepage banner id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check homepage banner exist or not
    try {
        const isHomepageBannerExist = await homepageBannerModel.countDocuments({ _id: homepageBannerId });
        if (isHomepageBannerExist == 0) {
            return Response.json({ error: `Homepage banner is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for homepage banner existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting homepage banner
    try {
        await homepageBannerModel.deleteOne({ _id: homepageBannerId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting homepage banner failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}