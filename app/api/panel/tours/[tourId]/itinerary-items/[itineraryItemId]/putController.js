import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const putItineraryItem = async ({ req, params, session }) => {
    const { itineraryItemId, tourId } = params
    if (!itineraryItemId || !tourId) {
        return Response.json({ error: `Tour id and itinerary item id are required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        title: body.title,
        subTitle: body.subTitle,
        shortDesc: body.shortDesc,
    }
    // Database connection
    connectDB()
    // Updating tour itinerary item
    try {
        await tourModel.updateOne({ _id: tourId, 'itineraryItems._id': itineraryItemId, }, { $set: { 'itineraryItems.$': updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating itinerary item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}