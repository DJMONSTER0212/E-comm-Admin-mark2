import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const deleteRentedCar = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
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
    // Deleting rented car
    try {
        await rentedCarModel.deleteOne({ _id: rentedCarId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting rented car failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}