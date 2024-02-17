import connectDB from '@/app/_conf/database/connection'
import { countryModel } from '@/app/_models/country'
import mongoose from 'mongoose';

export const country = async ({ req, params }) => {
    const searchParams = req.nextUrl.searchParams;
    const { countryId } = params
    if (!countryId) {
        return Response.json({ error: `Country id is required to fetch country.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching country
    let pipeline = [{ $match: { _id: new mongoose.Types.ObjectId(countryId) } }];
    if (searchParams.get("totalStates") === 'true' || searchParams.get("totalCities") === 'true') {
        pipeline.push({
            $lookup: {
                from: 'states',
                localField: '_id',
                foreignField: 'countryId',
                as: 'states',
            },
        });
        if (searchParams.get("totalStates") === 'true') {
            pipeline.push({
                $addFields: {
                    totalStates: { $size: '$states' },
                },
            });
        }
        if (searchParams.get("totalCities") === 'true') {
            pipeline.push({
                $lookup: {
                    from: 'cities',
                    localField: 'states._id',
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
                states: 0,
                cities: 0,
            },
        });
    }
    try {
        const country = await countryModel.aggregate(pipeline);
        return Response.json(country[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching country failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
