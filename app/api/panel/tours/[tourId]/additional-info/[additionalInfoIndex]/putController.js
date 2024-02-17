import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const putAdditionalInfo = async ({ req, params, session }) => {
    const { additionalInfoIndex, tourId } = params
    if (!additionalInfoIndex || !tourId) {
        return Response.json({ error: `Tour id and additional info index are required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const newAdditionalInfo = body.info;
    // Database connection
    connectDB()
    // Updating tour additional info
    try {
        await tourModel.updateOne({ _id: tourId }, { $set: { [`additionalInfo.${additionalInfoIndex}`]: newAdditionalInfo } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating additional info failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}