import connectDB from '@/app/_conf/database/connection'
import { stateModel } from '@/app/_models/state'
import { cityModel } from '@/app/_models/city'
import mongoose from 'mongoose';

export const cities = async ({ req, params }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('countryId')) {
        let stateIds = []
        try {
            const states = await stateModel.find({ countryId: searchParams.get('countryId') })
            stateIds = states.map((state) => new mongoose.Types.ObjectId(state._id));
        } catch (error) {
            return Response.json({ error: `Fetching states for this country failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        matchQuery.stateId = { $in: stateIds }
    } else if (searchParams.get('stateId')) {
        matchQuery.stateId = new mongoose.Types.ObjectId(searchParams.get('stateId'))
    }
    // Database connection
    connectDB()
    // Fetching cities
    try {
        const sortQuery = { name: 1 };
        let cities = await cityModel.aggregate([
            { $match: matchQuery },
            { $sort: sortQuery },
            {
                $lookup: {
                    from: 'states',
                    localField: 'stateId',
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
            {
                $unwind: '$country',
            },
        ]);
        return Response.json(cities, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching cities failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}