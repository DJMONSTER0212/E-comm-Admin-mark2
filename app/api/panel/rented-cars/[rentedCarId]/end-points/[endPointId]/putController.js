import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const putEndPoint = async ({ req, params, session }) => {
    const { endPointId, rentedCarId } = params
    if (!endPointId || !rentedCarId) {
        return Response.json({ error: `Rented car id and end point id are required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        address: body.address,
        mapsLink: body.mapsLink,
    }
    // Database connection
    connectDB()
    // Updating rented car end point
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId, 'endPoints._id': endPointId, }, { $set: { 'endPoints.$': updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating end point failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}