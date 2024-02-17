import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const putStartPoint = async ({ req, params, session }) => {
    const { startPointId, rentedCarId } = params
    if (!startPointId || !rentedCarId) {
        return Response.json({ error: `Rented car id and start point id are required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        address: body.address,
        mapsLink: body.mapsLink,
    }
    // Database connection
    connectDB()
    // Updating rented car start point
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId, 'startPoints._id': startPointId, }, { $set: { 'startPoints.$': updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating start point failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}