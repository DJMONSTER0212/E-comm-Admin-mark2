import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const patchIncludes = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Check rented car exist or not
    try {
        let rentedCar = await rentedCarModel.findOne({ _id: rentedCarId });
        if (!rentedCar) {
            return Response.json({ error: `Rented car not found.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for rented car failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
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
    // Updating rented car
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId }, { $set: { includes: updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Sorting rented car include items failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}