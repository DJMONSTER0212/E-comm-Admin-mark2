import connectDB from '@/app/_conf/database/connection'
import { homepageBannerModel } from '@/app/_models/homepage-banner'

export const homepageBanner = async ({ req, params }) => {
    const { homepageBannerId } = params
    if (!homepageBannerId) {
        return Response.json({ error: `Homepage banner id is required to fetch homepage banner.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching homepage banner
    try {
        let homepageBanner = await homepageBannerModel.findOne({ _id: homepageBannerId });
        return Response.json(homepageBanner, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching homepage banner failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
