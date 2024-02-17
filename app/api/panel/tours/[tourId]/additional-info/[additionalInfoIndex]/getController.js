import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const additionalInfo = async ({ req, params, session }) => {
    const { additionalInfoIndex, tourId } = params
    if (!additionalInfoIndex || !tourId) {
        return Response.json({ error: `Tour id and additional info index are required to fetch additional info.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour to get additional info
    try {
        let tour = await tourModel.findOne({ _id: tourId }).select({ additionalInfo: 1 });
        return Response.json(tour.additionalInfo[additionalInfoIndex], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching additional info failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
