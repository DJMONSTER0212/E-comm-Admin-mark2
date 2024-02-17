import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const includes = async ({ req, params, session }) => {
    const { tourId } = params
    if (!tourId) {
        return Response.json({ error: `Tour id is required to fetch includes.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour to get include items
    try {
        let tour = await tourModel.findOne({ _id: tourId }).select({ includes: 1 });
        return Response.json(tour.includes || [], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching include items failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
