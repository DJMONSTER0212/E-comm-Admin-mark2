import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const postAdditionalInfo = async ({ req, params, session }) => {
    const { tourId } = params
    if (!tourId) {
        return Response.json({ error: `Tour id is required to fetch additional info.` }, { status: 400 })
    }
    const body = await req.json();
    const newAdditionalInfo = body.info;
    // Database connection
    connectDB()
    // Adding new additional info
    try {
        await tourModel.updateOne({ _id: tourId }, { $push: { additionalInfo: newAdditionalInfo } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding additional info failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}