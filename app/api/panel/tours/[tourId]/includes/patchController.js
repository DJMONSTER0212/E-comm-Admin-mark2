import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const patchIncludes = async ({ req, params, session }) => {
    const { tourId } = params
    if (!tourId) {
        return Response.json({ error: `Tour id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Check tour exist or not
    try {
        let tour = await tourModel.findOne({ _id: tourId });
        if (!tour) {
            return Response.json({ error: `Tour not found.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for tour failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Settings update fields according to action
    let updateFields = {};
    switch (body.action) {
        case 'sort':
            let sortedIncludes = body.includes;
            for (let index = 0; index < sortedIncludes.length; index++) {
                sortedIncludes[index].order = index;
            }
            updateFields = [...sortedIncludes];
            break;
        default:
            break;
    }
    // Updating tour
    try {
        await tourModel.updateOne({ _id: tourId }, { $set: { includes: updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Sorting tour include items failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}