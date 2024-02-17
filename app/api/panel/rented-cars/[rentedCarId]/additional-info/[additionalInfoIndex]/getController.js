import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const additionalInfo = async ({ req, params, session }) => {
    const { additionalInfoIndex, rentedCarId } = params
    if (!additionalInfoIndex || !rentedCarId) {
        return Response.json({ error: `Rented car id and additional info index are required to fetch additional info.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching rented car to get additional info
    try {
        let rentedCar = await rentedCarModel.findOne({ _id: rentedCarId }).select({ additionalInfo: 1 });
        return Response.json(rentedCar.additionalInfo[additionalInfoIndex], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching additional info failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
