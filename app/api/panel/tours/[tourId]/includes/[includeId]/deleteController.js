import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const deleteInclude = async ({ req, params, session }) => {
    const { includeId, tourId } = params
    if (!includeId || !tourId) {
        return Response.json({ error: `Tour id and Include id are required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check tour exist or not
    let tour;
    try {
        tour = await tourModel.findOne({ _id: tourId });
        if (!tour) {
            return Response.json({ error: `Tour is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for tour existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting tour include item
    try {
        await tourModel.updateOne({ _id: tourId, 'includes._id': includeId, }, { $pull: { 'includes': { _id: includeId } } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting include item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}