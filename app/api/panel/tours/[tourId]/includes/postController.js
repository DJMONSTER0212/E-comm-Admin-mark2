import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const postInclude = async ({ req, params, session }) => {
    const { tourId } = params
    const body = await req.json();
    const updateFields = {
        title: body.title,
        isIncluded: body.isIncluded || false,
    }
    // Fetching total include items to set order
    try {
        const tour = await tourModel.findOne({ _id: tourId }).select({ includes: 1 });
        if (tour.includes && tour.includes.length > 0) {
            updateFields.order = tour.includes.length + 1;
        } else {
            updateFields.order = 0;
        }
    } catch (error) {
        return Response.json({ error: `Setting up order failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Adding new include item
    try {
        await tourModel.updateOne({ _id: tourId }, { $push: { includes: updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding include item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}