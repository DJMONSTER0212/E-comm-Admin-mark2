import connectDB from '@/app/_conf/database/connection'
import { tourDateModel } from '@/app/_models/tour-date'

export const tourDate = async ({ req, params, session }) => {
    const { tourId, tourDateId } = params
    if (!tourId, !tourDateId) {
        return Response.json({ error: `Tour id and tour date id are required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour date
    try {
        let tourDate = await tourDateModel.findOne({ _id: tourDateId, tourId });
        return Response.json(tourDate, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching tour date failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
