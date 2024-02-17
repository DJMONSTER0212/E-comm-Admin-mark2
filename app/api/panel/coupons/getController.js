import connectDB from '@/app/_conf/database/connection'
import { couponModel } from '@/app/_models/coupon'
import { tourModel } from '@/app/_models/tour'
import { rentedCarModel } from '@/app/_models/rented-car'
import { userModel } from '@/app/_models/user'

export const coupons = async ({ req, params, session }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('coupon')) {
        matchQuery.coupon = { $regex: new RegExp(`.*${searchParams.get('coupon')}.*`, "i") }
    }
    if (searchParams.get('user')) {
        let userIds;
        try {
            let users = await userModel.find({ name: { $regex: new RegExp(`.*${searchParams.get('user')}.*`, "i") }, email: { $regex: new RegExp(`.*${searchParams.get('user')}.*`, "i") } });
            userIds = users.map((user) => user._id);
        } catch (error) {
            return Response.json({ error: `Fetching users failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        matchQuery.userId = { $in: userIds }
    }
    if (searchParams.get('tour')) {
        let tourIds;
        try {
            let tours = await tourModel.find({ name: { $regex: new RegExp(`.*${searchParams.get('tour')}.*`, "i") } });
            tourIds = tours.map((tour) => tour._id);
        } catch (error) {
            return Response.json({ error: `Fetching tours failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        matchQuery.tourId = { $in: tourIds }
    }
    if (searchParams.get('rentedCar')) {
        let rentedCarIds;
        try {
            let rentedCars = await rentedCarModel.find({ name: { $regex: new RegExp(`.*${searchParams.get('rentedCar')}.*`, "i") }, nickname: { $regex: new RegExp(`.*${searchParams.get('rentedCar')}.*`, "i") } });
            rentedCarIds = rentedCars.map((rentedCar) => rentedCar._id);
        } catch (error) {
            return Response.json({ error: `Fetching rented cars failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        matchQuery.rentedCarId = { $in: rentedCarIds }
    }
    if (searchParams.get('type')) {
        matchQuery.type = { $in: searchParams.get('type').toString().split('.') }
    }
    if (searchParams.get('validOn')) {
        matchQuery.validOn = { $in: searchParams.get('validOn').toString().split('.') }
    }
    if (searchParams.get('status')) {
        matchQuery.isActive = { $in: searchParams.get('status').toString().split('.').map((item) => item === 'true') }
    }
    // Prepare pipeline
    let pipeline = [
        { $sort: { createdAt: -1 } },
        { $match: matchQuery },
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
    let page = searchParams.get('page') || 1;
    let perPage = searchParams.get('per_page') || 20;
    if (searchParams.get('all') != 'true') {
        pipeline.push({ $skip: (Number(page) - 1) * Number(perPage) })
        pipeline.push({ $limit: Number(perPage) })
    }
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
    // Fetching coupons
    let coupons;
    try {
        coupons = await couponModel.aggregate(pipeline);
    } catch (error) {
        return Response.json({ error: `Fetching coupons failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }


    // Fetching page count
    let totalCoupons;
    try {
        totalCoupons = await tourModel.countDocuments(matchQuery);
    } catch (error) {
        return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    return Response.json({ coupons, pageCount: Math.ceil(totalCoupons / perPage) }, { status: 200 })
}
