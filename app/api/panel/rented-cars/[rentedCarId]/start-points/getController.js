import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const startPoints = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching rented car to get start points
    try {
        let rentedCar = await rentedCarModel.findOne({ _id: rentedCarId }).select({ startPoints: 1 });
        return Response.json(rentedCar.startPoints || [], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching start points failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
