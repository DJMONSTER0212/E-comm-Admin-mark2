import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const include = async ({ req, params, session }) => {
    const { includeId, tourId } = params
    if (!includeId || !tourId) {
        return Response.json({ error: `Tour id and include id are required to fetch include item.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour to get include item
    try {
        let tour = await tourModel.findOne({ _id: tourId, 'includes._id': includeId, }).select({ includes: 1 });
        return Response.json(tour.includes[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching include item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
