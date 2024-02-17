import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'
import mongoose from 'mongoose'

export const rentedCar = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to fetch rented car.` }, { status: 400 })
    }
    const matchQuery = { _id: new mongoose.Types.ObjectId(rentedCarId) };
    // Database connection
    connectDB()
    // Fetching rented car
    let rentedCar;
    try {
        rentedCar = await rentedCarModel.aggregate([
            { $match: matchQuery },
            {
                $lookup: {
                    from: 'car-companies',
                    localField: 'carCompanyId',
                    foreignField: '_id',
                    as: 'carCompany'
                }
            },
            { $unwind: '$carCompany' },
            {
                $lookup: {
                    from: 'cities',
                    localField: 'cityId',
                    foreignField: '_id',
                    as: 'city'
                }
            },
            { $unwind: '$city' },
        ]);
        return Response.json(rentedCar[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching rented car failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
