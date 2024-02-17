import connectDB from '@/app/_conf/database/connection'
import { tourDateModel } from '@/app/_models/tour-date'

export const deleteTourDate = async ({ req, params, session }) => {
    const { tourId, tourDateId } = params
    if (!tourId, !tourDateId) {
        return Response.json({ error: `Tour id and tour date id are required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check tour date exist or not
    let tourDate;
    try {
        tourDate = await tourDateModel.findOne({ _id: tourDateId });
        if (!tourDate) {
            return Response.json({ error: `Tour date is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for tour date existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting tour date
    try {
        await tourDateModel.deleteOne({ _id: tourDateId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting tour date failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}