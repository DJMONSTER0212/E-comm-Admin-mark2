import connectDB from '@/app/_conf/database/connection'
import { carCompanyModel } from '@/app/_models/car-company'
import mongoose from 'mongoose';

export const carCompany = async ({ req, params }) => {
    const searchParams = req.nextUrl.searchParams;
    const { carCompanyId } = params
    if (!carCompanyId) {
        return Response.json({ error: `Car company id is required to fetch car company.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching car company
    let pipeline = [{ $match: { _id: new mongoose.Types.ObjectId(carCompanyId) } }];
    if (searchParams.get("totalRentedCars") === 'true') {
        pipeline.push({
            $lookup: {
                from: 'rented-cars',
                localField: '_id',
                foreignField: 'carCompanyId',
                as: 'rentedCars',
            },
        });
        pipeline.push({
            $addFields: {
                totalRentedCars: { $size: '$rentedCars' },
            },
        });
        pipeline.push({
            $project: {
                rentedCars: 0,
            },
        });
    }
    try {
        let carCompany = await carCompanyModel.aggregate(pipeline);
        return Response.json(carCompany[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching car company failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
