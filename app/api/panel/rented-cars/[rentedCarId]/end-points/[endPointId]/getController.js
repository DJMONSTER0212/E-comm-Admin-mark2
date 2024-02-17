import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const endPoint = async ({ req, params, session }) => {
    const { endPointId, rentedCarId } = params
    if (!endPointId || !rentedCarId) {
        return Response.json({ error: `Rented car id and end point id are required to fetch end point item.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching rented car to get end point
    try {
        let rentedCar = await rentedCarModel.findOne({ _id: rentedCarId, 'endPoints._id': endPointId, }).select({ endPoints: 1 });
        return Response.json(rentedCar.endPoints[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching end point failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
