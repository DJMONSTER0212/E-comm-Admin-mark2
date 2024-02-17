import connectDB from '@/app/_conf/database/connection'
import { rentedCarSpecialpriceModel } from '@/app/_models/rented-car-special-price';
import mongoose from 'mongoose';

export const specialPrices = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    const searchParams = req.nextUrl.searchParams
    const matchQuery = { rentedCarId: new mongoose.Types.ObjectId(rentedCarId) };
    if (searchParams.get('name')) {
        matchQuery.name = { $regex: new RegExp(`.*${searchParams.get('name')}.*`, "i") }
    }
    if (searchParams.get('rangeType')) {
        matchQuery.rangeType = { $in: searchParams.get('rangeType').toString().split('.').map((item) => item ) }
    }
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('per_page') || 20;
    // Database connection
    connectDB()
    // Fetching rented car special prices
    let rentedCarSpecialprices;
    try {
        const sortQuery = { createdAt: -1 };
        rentedCarSpecialprices = await rentedCarSpecialpriceModel.aggregate([
            { $match: matchQuery },
            { $sort: sortQuery },
            { $skip: (Number(page) - 1) * Number(perPage) },
            { $limit: Number(perPage) },
        ]);
    } catch (error) {
        return Response.json({ error: `Fetching rented car special prices failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Fetching page count
    let totalRentedCarSpecialprices;
    try {
        totalRentedCarSpecialprices = await rentedCarSpecialpriceModel.countDocuments(matchQuery);
    } catch (error) {
        return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    return Response.json({ rentedCarSpecialprices, pageCount: Math.ceil(totalRentedCarSpecialprices / perPage) }, { status: 200 })
}
