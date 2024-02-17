import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const postItineraryItem = async ({ req, params, session }) => {
    const { tourId } = params
    const body = await req.json();
    const updateFields = {
        title: body.title,
        subTitle: body.subTitle,
        shortDesc: body.shortDesc,
    }
    // Fetching total itinerary items to set order
    try {
        const tour = await tourModel.findOne({ _id: tourId }).select({ itineraryItems: 1 });
        if (tour.itineraryItems && tour.itineraryItems.length > 0) {
            updateFields.order = tour.itineraryItems.length + 1;
        } else {
            updateFields.order = 0;
        }
    } catch (error) {
        return Response.json({ error: `Setting up order failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Adding new itinerary item
    try {
        await tourModel.updateOne({ _id: tourId }, { $push: { itineraryItems: updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding itinerary item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}