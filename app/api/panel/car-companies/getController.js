import connectDB from '@/app/_conf/database/connection'
import { carCompanyModel } from '@/app/_models/car-company'

export const carCompanies = async ({ req, params }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('name')) {
        matchQuery.name = { $regex: new RegExp(`.*${searchParams.get('name')}.*`, "i") }
    }
    if (searchParams.get('isPinOnFilters')) {
        matchQuery.isPinOnFilters = { $in: searchParams.get('isPinOnFilters').toString().split('.').map((item) => item === 'true') }
    }
    // Prepare pipeline
    let pipeline = [
        { $match: matchQuery },
        { $sort: { name: 1 } },
    ]
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
    let page = searchParams.get('page') || 1;
    let perPage = searchParams.get('per_page') || 20;
    if (searchParams.get('all') != 'true') {
        pipeline.push({ $skip: (Number(page) - 1) * Number(perPage) })
        pipeline.push({ $limit: Number(perPage) })
    }
    // Database connection
    connectDB()
    // Fetching car companies
    let carCompanies;
    try {
        carCompanies = await carCompanyModel.aggregate(pipeline);
    } catch (error) {
        return Response.json({ error: `Fetching car companies failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Fetching page count
    if (searchParams.get('all') != 'true') {
        let totalCarCompanyModel;
        try {
            totalCarCompanyModel = await carCompanyModel.countDocuments(matchQuery);
        } catch (error) {
            return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        return Response.json({ carCompanies, pageCount: Math.ceil(totalCarCompanyModel / perPage) }, { status: 200 })
    }
    return Response.json(carCompanies, { status: 200 })
}
