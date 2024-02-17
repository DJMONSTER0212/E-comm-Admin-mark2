import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const itineraryItem = async ({ req, params, session }) => {
    const { itineraryItemId, tourId } = params
    if (!itineraryItemId || !tourId) {
        return Response.json({ error: `Tour id and itinerary item id are required to fetch itinerary item.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour to get itinerary item
    try {
        let tour = await tourModel.findOne({ _id: tourId, 'itineraryItems._id': itineraryItemId, }).select({ itineraryItems: 1 });
        return Response.json(tour.itineraryItems[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching itinerary item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
