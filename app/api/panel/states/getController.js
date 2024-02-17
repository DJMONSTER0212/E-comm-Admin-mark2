import connectDB from '@/app/_conf/database/connection'
import { stateModel } from '@/app/_models/state'
import mongoose from 'mongoose';

export const states = async ({ req, params }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('countryId')) {
        matchQuery.countryId = new mongoose.Types.ObjectId(searchParams.get('countryId'))
    }
    // Database connection
    connectDB()
    // Fetching states
    let pipeline = [{ $sort: { name: 1 } }, { $match: matchQuery }];
    if (searchParams.get("totalCities") === 'true') {
        if (searchParams.get("totalCities") === 'true') {
            pipeline.push({
                $lookup: {
                    from: 'cities',
                    localField: '_id',
                    foreignField: 'stateId',
                    as: 'cities',
                },
            });
            pipeline.push({
                $addFields: {
                    totalCities: { $size: '$cities' },
                },
            });
        }
        pipeline.push({
            $project: {
                cities: 0,
            },
        });
    }
    try {
        const states = await stateModel.aggregate(pipeline);
        return Response.json(states, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching states failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}