import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const postStartPoint = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        address: body.address,
        mapsLink: body.mapsLink,
    }
    // Database connection
    connectDB()
    // Adding new start point
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId }, { $push: { startPoints: updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding start point failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}