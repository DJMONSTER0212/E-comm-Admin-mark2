import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const patchRentedCar = async ({ req, params, session }) => {
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
        case 'isActive':
            updateFields = { isActive: body.isActive }
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
    // Updating rented car
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating rented car failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}