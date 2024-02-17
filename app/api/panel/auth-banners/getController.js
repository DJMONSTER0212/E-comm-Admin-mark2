import connectDB from '@/app/_conf/database/connection'
import { authBannerModel } from '@/app/_models/auth-banner'

export const authBanners = async ({ req, params }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('title')) {
        matchQuery.title = { $regex: new RegExp(`.*${searchParams.get('title')}.*`, "i") }
    }
    if (searchParams.get('status')) {
        matchQuery.isActive = { $in: searchParams.get('status').toString().split('.').map((item) => item === 'true') }
    }
    let page = searchParams.get('page') || 1;
    let perPage = searchParams.get('per_page') || 20;
    // Database connection
    connectDB()
    // Fetching auth banners
    let sortQuery = { title: 1 };
    let authBanners;
    try {
        authBanners = await authBannerModel.aggregate([
            { $match: matchQuery },
            { $sort: sortQuery },
            { $skip: (Number(page) - 1) * Number(perPage) },
            { $limit: Number(perPage) },
        ]);
    } catch (error) {
        return Response.json({ error: `Fetching auth banners failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Fetching page count
    if (searchParams.get('all') != 'true') {
        let totalAuthBanners;
        try {
            totalAuthBanners = await authBannerModel.countDocuments(matchQuery);
        } catch (error) {
            return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        return Response.json({ authBanners, pageCount: Math.ceil(totalAuthBanners / perPage) }, { status: 200 })
    }
    return Response.json(authBanners, { status: 200 })
}
