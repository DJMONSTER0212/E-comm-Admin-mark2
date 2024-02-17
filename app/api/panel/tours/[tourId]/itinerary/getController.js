import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const itinerary = async ({ req, params, session }) => {
    const { tourId } = params
    if (!tourId) {
        return Response.json({ error: `Tour id is required to fetch itinerary.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour to get itinerary
    try {
        let tour = await tourModel.findOne({ _id: tourId }).select({ itinerary: 1 });
        return Response.json(tour.itinerary, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching itinerary failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
