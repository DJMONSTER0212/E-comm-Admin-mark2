import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'
import { cityModel } from '@/app/_models/city'
import { stateModel } from '@/app/_models/state'
import { countryModel } from '@/app/_models/country'
import mongoose from 'mongoose'

export const tours = async ({ req, params, session }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('name')) {
        matchQuery.name = { $regex: new RegExp(`.*${searchParams.get('name')}.*`, "i") }
    }
    if (searchParams.get('category')) {
        let categoryIds = searchParams.get('category').toString().split('.');
        categoryIds = categoryIds.map((categoryId) => new mongoose.Types.ObjectId(categoryId))
        matchQuery.categoryId = { $in: categoryIds }
    }
    if (searchParams.get('status')) {
        matchQuery.isActive = { $in: searchParams.get('status').toString().split('.').map((item) => item === 'true') }
    }
    if (searchParams.get('isPinOnNavbar')) {
        matchQuery.isPinOnNavbar = { $in: searchParams.get('isPinOnNavbar').toString().split('.').map((item) => item === 'true') }
    }
    if (searchParams.get('city')) {
        let cityIds;
        try {
            let cities = await cityModel.find({ name: { $regex: new RegExp(`.*${searchParams.get('city')}.*`, "i") } });
            cityIds = cities.map((city) => city._id);
        } catch (error) {
            return Response.json({ error: `Fetching cities failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }, { status: 400 })
        }
        matchQuery.cityId = { $in: cityIds }
    }
    if (searchParams.get('state')) {
        let stateIds;
        try {
            let states = await stateModel.find({ name: { $regex: new RegExp(`.*${searchParams.get('state')}.*`, "i") } });
            stateIds = states.map((state) => state._id);
        } catch (error) {
            return Response.json({ error: `Fetching states failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }, { status: 400 })
        }
        let cityIds;
        try {
            let cities = await cityModel.find({ stateId: { $in: stateIds } });
            cityIds = cities.map((city) => city._id);
        } catch (error) {
            return Response.json({ error: `Fetching cities failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }, { status: 400 })
        }
        matchQuery.cityId = { $in: cityIds }
    }
    if (searchParams.get('country')) {
        let countryIds;
        try {
            let countries = await countryModel.find({ name: { $regex: new RegExp(`.*${searchParams.get('country')}.*`, "i") } });
            countryIds = countries.map((country) => country._id);
        } catch (error) {
            return Response.json({ error: `Fetching countries failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }, { status: 400 })
        }
        let stateIds;
        try {
            let states = await stateModel.find({ countryId: { $in: countryIds } });
            stateIds = states.map((state) => state._id);
        } catch (error) {
            return Response.json({ error: `Fetching states failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }, { status: 400 })
        }
        let cityIds;
        try {
            let cities = await cityModel.find({ stateId: { $in: stateIds } });
            cityIds = cities.map((city) => city._id);
        } catch (error) {
            return Response.json({ error: `Fetching cities failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }, { status: 400 })
        }
        matchQuery.cityId = { $in: cityIds }
    }
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('per_page') || 20;
    // Database connection
    connectDB()
    // Fetching tours
    let tours;
    try {
        const sortQuery = { name: 1 };
        tours = await tourModel.aggregate([
            { $match: matchQuery },
            { $sort: sortQuery },
            {
                $lookup: {
                    from: 'tour-categories',
                    localField: 'tourCategoryId',
                    foreignField: '_id',
                    as: 'tourCategory'
                }
            },
            { $unwind: '$tourCategory' },
            {
                $lookup: {
                    from: 'cities',
                    localField: 'cityId',
                    foreignField: '_id',
                    as: 'city'
                }
            },
            { $unwind: '$city' },
            {
                $lookup: {
                    from: 'states',
                    localField: 'city.stateId',
                    foreignField: '_id',
                    as: 'state'
                }
            },
            { $unwind: '$state' },
            {
                $lookup: {
                    from: 'countries',
                    localField: 'state.countryId',
                    foreignField: '_id',
                    as: 'country',
                },
            },
            { $unwind: '$country' },
            { $skip: (Number(page) - 1) * Number(perPage) },
            { $limit: Number(perPage) },
        ]);
    } catch (error) {
        return Response.json({ error: `Fetching tours failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }, { status: 400 })
    }
    // Fetching page count
    let totalTours;
    try {
        totalTours = await tourModel.countDocuments(matchQuery);
    } catch (error) {
        return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }, { status: 400 })
    }
    return Response.json({ tours, pageCount: Math.ceil(totalTours / perPage) }, { status: 200 })
}
