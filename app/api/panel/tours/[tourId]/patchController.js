import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const patchTour = async ({ req, params, session }) => {
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
        case 'isActive':
            updateFields = { isActive: body.isActive }
            break;
        case 'updateStartEndPoint':
            updateFields = {
                startPoint: {
                    address: body.startAddress,
                    mapsLink: body.startMapsLink,
                    shortDesc: body.startShortDesc,
                },
                endPoint: {
                    address: body.endAddress,
                    mapsLink: body.endMapsLink,
                    shortDesc: body.endShortDesc,
                },
            }
            break;
        case 'updateSeo':
            updateFields = {
                seo: {
                    title: body.title,
                    shortDesc: body.shortDesc,
                }
            }
            break;
        default:
            break;
    }
    // Updating tour
    try {
        await tourModel.updateOne({ _id: tourId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating tour failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}