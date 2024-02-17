import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const putInclude = async ({ req, params, session }) => {
    const { includeId, tourId } = params
    if (!includeId || !tourId) {
        return Response.json({ error: `Tour id and Include id are required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        title: body.title,
        isIncluded: body.isIncluded || false,
        order: body.order
    }
    // Database connection
    connectDB()
    // Updating tour include item
    try {
        await tourModel.updateOne({ _id: tourId, 'includes._id': includeId, }, { $set: { 'includes.$': updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating include item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}