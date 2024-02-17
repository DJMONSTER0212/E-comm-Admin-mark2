import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const putAdditionalInfo = async ({ req, params, session }) => {
    const { additionalInfoIndex, rentedCarId } = params
    if (!additionalInfoIndex || !rentedCarId) {
        return Response.json({ error: `Rented car id and additional info index are required to fetch additional info.` }, { status: 400 })
    }
    const body = await req.json();
    const newAdditionalInfo = body.info;
    // Database connection
    connectDB()
    // Updating rented car additional info
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId }, { $set: { [`additionalInfo.${additionalInfoIndex}`]: newAdditionalInfo } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating additional info failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}