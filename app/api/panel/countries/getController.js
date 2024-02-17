import connectDB from '@/app/_conf/database/connection'
import { countryModel } from '@/app/_models/country'

export const countries = async ({ req }) => {
    const searchParams = req.nextUrl.searchParams
    // Database connection
    connectDB()
    // Fetching countries
    let pipeline = [{ $sort: { name: 1 } }, { $match: {} }];
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
        const countries = await countryModel.aggregate(pipeline);
        return Response.json(countries, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching countries failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}