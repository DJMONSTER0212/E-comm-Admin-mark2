import connectDB from '@/app/_conf/database/connection'
import { tourCategoryModel } from '@/app/_models/tour-category'

export const tourCategories = async ({ req, params }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('name')) {
        matchQuery.name = { $regex: new RegExp(`.*${searchParams.get('name')}.*`, "i") }
    }
    if (searchParams.get('isPinOnNavbar')) {
        matchQuery.isPinOnNavbar = { $in: searchParams.get('isPinOnNavbar').toString().split('.').map((item) => item === 'true') }
    }
    if (searchParams.get('isPinOnFilters')) {
        matchQuery.isPinOnFilters = { $in: searchParams.get('isPinOnFilters').toString().split('.').map((item) => item === 'true') }
    }
    // Prepare pipeline
    let pipeline = [
        { $match: matchQuery },
        { $sort: { name: 1 } },
    ]
    let page = searchParams.get('page') || 1;
    let perPage = searchParams.get('per_page') || 20;
    if (searchParams.get('all') != 'true') {
        pipeline.push({ $skip: (Number(page) - 1) * Number(perPage) })
        pipeline.push({ $limit: Number(perPage) })
    }
    // Database connection
    connectDB()
    // Fetching tour categories
    let tourCategories;
    try {
        tourCategories = await tourCategoryModel.aggregate(pipeline);
    } catch (error) {
        return Response.json({ error: `Fetching tour categories failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Fetching page count
    if (searchParams.get('all') != 'true') {
        let totalTourCategories;
        try {
            totalTourCategories = await tourCategoryModel.countDocuments(matchQuery);
        } catch (error) {
            return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        return Response.json({ tourCategories, pageCount: Math.ceil(totalTourCategories / perPage) }, { status: 200 })
    }
    return Response.json(tourCategories, { status: 200 })
}
