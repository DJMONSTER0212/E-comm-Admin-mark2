import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const putItinerary = async ({ req, params, session }) => {
    const { tourId } = params
    const body = await req.json();
    const updateFields = {
        title: body.title,
        desc: body.desc,
    }
    if (!tourId) {
        return Response.json({ error: `Tour id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Updating tour itinerary
    try {
        await tourModel.updateOne({ _id: tourId }, { $set: { itinerary: updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating itinerary failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}