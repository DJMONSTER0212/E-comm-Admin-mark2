import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const carDetails = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    const fieldsToSend = {
        images: 1,
        name: 1,
        number: 1,
        modelYear: 1,
        fuelType: 1,
        carCategory: 1,
        carCompanyId: 1,
    }
    // Database connection
    connectDB()
    // Fetching rented car to get car details
    try {
        let rentedCar = await rentedCarModel.findOne({ _id: rentedCarId }).select(fieldsToSend);
        return Response.json(rentedCar, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching car details failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
