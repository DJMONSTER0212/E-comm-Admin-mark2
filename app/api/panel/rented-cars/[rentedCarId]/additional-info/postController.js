import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const postAdditionalInfo = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const newAdditionalInfo = body.info;
    // Database connection
    connectDB()
    // Adding new additional info
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId }, { $push: { additionalInfo: newAdditionalInfo } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding additional info failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}