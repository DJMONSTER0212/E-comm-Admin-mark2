import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const includes = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching rented car to get include items
    try {
        let rentedCar = await rentedCarModel.findOne({ _id: rentedCarId }).select({ includes: 1 });
        return Response.json(rentedCar.includes || [], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching include items failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
