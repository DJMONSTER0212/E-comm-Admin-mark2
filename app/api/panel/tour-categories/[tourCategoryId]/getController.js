import connectDB from '@/app/_conf/database/connection'
import { tourCategoryModel } from '@/app/_models/tour-category'

export const tourCategory = async ({ req, params }) => {
    const { tourCategoryId } = params
    if (!tourCategoryId) {
        return Response.json({ error: `Category id is required to fetch tour category.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour category
    try {
        let tourCategory = await tourCategoryModel.findOne({ _id: tourCategoryId });
        return Response.json(tourCategory, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching tour category failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
