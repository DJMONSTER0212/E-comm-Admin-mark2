import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const include = async ({ req, params, session }) => {
    const { includeId, rentedCarId } = params
    if (!includeId || !rentedCarId) {
        return Response.json({ error: `Rented car id and include id are required to fetch include item.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching rented car to get include item
    try {
        let rentedCar = await rentedCarModel.findOne({ _id: rentedCarId, 'includes._id': includeId, }).select({ includes: 1 });
        return Response.json(rentedCar.includes[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching include item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
