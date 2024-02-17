import connectDB from '@/app/_conf/database/connection'
import { tourDateModel } from '@/app/_models/tour-date'

export const postTourDate = async ({ req, params, session }) => {
    const { tourId } = params
    if (!tourId) {
        return Response.json({ error: `Tour id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        date: body.date,
        times: body.times,
        sharedTour: {
            isActive: body.sharedIsActive,
            price: body.sharedPrice,
            maxPerson: body.sharedMaxPerson,
        },
        privateTour: {
            isActive: body.privateIsActive,
            price: body.privatePrice,
            minPerson: body.privateMinPerson,
            maxPerson: body.privateMaxPerson,
        },
        tourId: tourId,
    }
    // Avoid activating shared or private tour without required details
    if (updateFields.sharedTour.isActive == 'true' && (!updateFields.sharedTour.price || !updateFields.sharedTour.maxPerson)) {
        return Response.json({ error: "Price and number of max. persons are required to enable shared tour." }, { status: 400 })
    }
    if (updateFields.privateTour.isActive == 'true' && (!updateFields.privateTour.price || !updateFields.privateTour.minPerson || !updateFields.privateTour.maxPerson)) {
        return Response.json({ error: "Price, number of max. and min. persons are required to enable private tour." }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check for existing tour date on same date
    try {
        let existingTourDate = await tourDateModel.countDocuments({ date: updateFields.date, tourId })
        if (existingTourDate) {
            return Response.json({ error: `This date for this tour is already added.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for existing tour date failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Adding new tour date
    try {
        const newTourDate = new tourDateModel(updateFields)
        await newTourDate.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding tour date failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}