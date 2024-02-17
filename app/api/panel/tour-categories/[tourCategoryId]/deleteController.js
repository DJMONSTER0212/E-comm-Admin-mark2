import connectDB from '@/app/_conf/database/connection'
import { tourCategoryModel } from '@/app/_models/tour-category'

export const deleteTourCategory = async ({ req, params, session }) => {
    const { tourCategoryId } = params
    if (!tourCategoryId) {
        return Response.json({ error: `Tour category id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check tour category exist or not
    try {
        const isTourCategoryExist = await tourCategoryModel.countDocuments({ _id: tourCategoryId });
        if (isTourCategoryExist == 0) {
            return Response.json({ error: `Tour category is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for tour category existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting tour category
    try {
        await tourCategoryModel.deleteOne({ _id: tourCategoryId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting tour category failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}