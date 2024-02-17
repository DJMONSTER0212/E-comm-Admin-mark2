import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const startPoint = async ({ req, params, session }) => {
    const { startPointId, rentedCarId } = params
    if (!startPointId || !rentedCarId) {
        return Response.json({ error: `Rented car id and start point id are required to fetch start point item.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching rented car to get start point
    try {
        let rentedCar = await rentedCarModel.findOne({ _id: rentedCarId, 'startPoints._id': startPointId, }).select({ startPoints: 1 });
        return Response.json(rentedCar.startPoints[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching start point failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
