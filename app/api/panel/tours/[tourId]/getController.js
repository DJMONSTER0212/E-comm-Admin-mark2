import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const tour = async ({ req, params, session }) => {
    const { tourId } = params
    if (!tourId) {
        return Response.json({ error: `Tour id is required to fetch tour.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour
    try {
        let tour = await tourModel.findOne({ _id: tourId });
        return Response.json(tour, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching tour failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
