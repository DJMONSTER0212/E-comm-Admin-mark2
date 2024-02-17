import connectDB from '@/app/_conf/database/connection'
import { couponModel } from '@/app/_models/coupon'
import mongoose from 'mongoose'

export const coupon = async ({ req, params, session }) => {
    const searchParams = req.nextUrl.searchParams
    const { couponId } = params
    if (!couponId) {
        return Response.json({ error: `Coupon id is required to fetch coupon.` }, { status: 400 })
    }
    // Prepare pipeline
    let pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(couponId) } },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'tours',
                localField: 'tourId',
                foreignField: '_id',
                as: 'tour',
            },
        },
        { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'rented-cars',
                localField: 'rentedCarId',
                foreignField: '_id',
                as: 'rentedCar',
            },
        },
        { $unwind: { path: '$rentedCar', preserveNullAndEmptyArrays: true } },
    ];
    if (searchParams.get("totalUsage") === 'sss') {
        pipeline.push({
            $lookup: {
                from: 'couponUsages',
                localField: '_id',
                foreignField: 'couponId',
                as: 'couponUsages',
            },
        });
        pipeline.push({
            $addFields: {
                totalUsage: { $size: '$couponUsages' },
            },
        });
        pipeline.push({
            $project: {
                couponUsages: 0,
            },
        });
    }
    // Database connection
    connectDB()
    // Fetching coupon
    try {
        let coupon = await couponModel.aggregate(pipeline);
        return Response.json(coupon[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching coupon failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
