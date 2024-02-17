import connectDB from '@/app/_conf/database/connection'
import { tourDateModel } from '@/app/_models/tour-date';
import mongoose from 'mongoose';

export const tourDates = async ({ req, params, session }) => {
    const { tourId } = params
    if (!tourId) {
        return Response.json({ error: `Tour id is required to  perform this action.` }, { status: 400 })
    }
    const searchParams = req.nextUrl.searchParams
    const matchQuery = { tourId: new mongoose.Types.ObjectId(tourId) };
    if (searchParams.get('times')) {
        matchQuery.times = searchParams.get('times')
    }
    if (searchParams.get('status')) {
        switch (searchParams.get('status')) {
            case 'true':
                matchQuery.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                break;
            case 'false':
                matchQuery.date = { $lt: new Date().setHours(0, 0, 0, 0) };
                break;
            default:
                break;
        }
    }
    if (searchParams.get('type')) {
        if (searchParams.get('type') == 'shared') {
            matchQuery['sharedTour.isActive'] = true
        } else {
            matchQuery['privateTour.isActive'] = true
        }
    }
    if (searchParams.get('dates')) {
        let dateStrings = searchParams.get('dates').toString().split('.')
        let startDate = new Date(dateStrings[0].trim())
        let endDate = new Date(dateStrings[1].trim())
        matchQuery.date = {
            $gte: startDate,
            $lte: endDate
        }
    }
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('per_page') || 20;
    // Database connection
    connectDB()
    // Fetching tour dates
    let tourDates;
    try {
        const sortQuery = { date: -1 };
        tourDates = await tourDateModel.aggregate([
            { $match: matchQuery },
            { $sort: sortQuery },
            { $skip: (Number(page) - 1) * Number(perPage) },
            { $limit: Number(perPage) },
        ]);
    } catch (error) {
        return Response.json({ error: `Fetching tour dates failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Fetching page count
    let totalTourDates;
    try {
        totalTourDates = await tourDateModel.countDocuments(matchQuery);
    } catch (error) {
        return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    return Response.json({ tourDates, pageCount: Math.ceil(totalTourDates / perPage) }, { status: 200 })
}
