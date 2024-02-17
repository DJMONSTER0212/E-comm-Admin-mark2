import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const deleteInclude = async ({ req, params, session }) => {
    const { includeId, rentedCarId } = params
    if (!includeId || !rentedCarId) {
        return Response.json({ error: `Rented car id and include id are required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check rented car exist or not
    let rentedCar;
    try {
        rentedCar = await rentedCarModel.findOne({ _id: rentedCarId });
        if (!rentedCar) {
            return Response.json({ error: `Rented car is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for rented car existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting rented car include item
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId, 'includes._id': includeId, }, { $pull: { 'includes': { _id: includeId } } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting include item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}