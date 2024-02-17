import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'
import { cityModel } from '@/app/_models/city'
import { stateModel } from '@/app/_models/state'
import { countryModel } from '@/app/_models/country'

export const rentedCars = async ({ req, params, session }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('name')) {
        matchQuery.name = { $regex: new RegExp(`.*${searchParams.get('name')}.*`, "i") }
    }
    if (searchParams.get('nickname')) {
        matchQuery.nickname = { $regex: new RegExp(`.*${searchParams.get('nickname')}.*`, "i") }
    }
    if (searchParams.get('carCategory')) {
        matchQuery.carCategory = { $regex: new RegExp(`.*${searchParams.get('carCategory')}.*`, "i") }
    }
    if (searchParams.get('number')) {
        matchQuery.number = { $regex: new RegExp(`.*${searchParams.get('number')}.*`, "i") }
    }
    if (searchParams.get('status')) {
        matchQuery.isActive = { $in: searchParams.get('status').toString().split('.').map((item) => item === 'true') }
    }
    if (searchParams.get('city')) {
        let cityIds;
        try {
            let cities = await cityModel.find({ name: { $regex: new RegExp(`.*${searchParams.get('city')}.*`, "i") } });
            cityIds = cities.map((city) => city._id);
        } catch (error) {
            return Response.json({ error: `Fetching cities failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        matchQuery.cityId = { $in: cityIds }
    }
    if (searchParams.get('state')) {
        let stateIds;
        try {
            let states = await stateModel.find({ name: { $regex: new RegExp(`.*${searchParams.get('state')}.*`, "i") } });
            stateIds = states.map((state) => state._id);
        } catch (error) {
            return Response.json({ error: `Fetching states failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        let cityIds;
        try {
            let cities = await cityModel.find({ stateId: { $in: stateIds } });
            cityIds = cities.map((city) => city._id);
        } catch (error) {
            return Response.json({ error: `Fetching cities failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        matchQuery.cityId = { $in: cityIds }
    }
    if (searchParams.get('country')) {
        let countryIds;
        try {
            let countries = await countryModel.find({ name: { $regex: new RegExp(`.*${searchParams.get('country')}.*`, "i") } });
            countryIds = countries.map((country) => country._id);
        } catch (error) {
            return Response.json({ error: `Fetching countries failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        let stateIds;
        try {
            let states = await stateModel.find({ countryId: { $in: countryIds } });
            stateIds = states.map((state) => state._id);
        } catch (error) {
            return Response.json({ error: `Fetching states failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        let cityIds;
        try {
            let cities = await cityModel.find({ stateId: { $in: stateIds } });
            cityIds = cities.map((city) => city._id);
        } catch (error) {
            return Response.json({ error: `Fetching cities failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        matchQuery.cityId = { $in: cityIds }
    }
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('per_page') || 20;
    // Database connection
    connectDB()
    // Fetching rented cars
    let rentedCars;
    try {
        const sortQuery = { name: 1 };
        rentedCars = await rentedCarModel.aggregate([
            { $match: matchQuery },
            { $sort: sortQuery },
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
        return Response.json({ error: `Fetching rented cars failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Fetching page count
    let totalRentedCars;
    try {
        totalRentedCars = await rentedCarModel.countDocuments(matchQuery);
    } catch (error) {
        return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    return Response.json({ rentedCars, pageCount: Math.ceil(totalRentedCars / perPage) }, { status: 200 })
}
