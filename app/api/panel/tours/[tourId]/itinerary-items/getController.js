import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const itineraryItems = async ({ req, params, session }) => {
    const { tourId } = params
    if (!tourId) {
        return Response.json({ error: `Tour id is required to fetch itinerary items.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour to get itinerary items
    try {
        let tour = await tourModel.findOne({ _id: tourId }).select({ itineraryItems: 1 });
        return Response.json(tour.itineraryItems || [], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching itinerary items failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
