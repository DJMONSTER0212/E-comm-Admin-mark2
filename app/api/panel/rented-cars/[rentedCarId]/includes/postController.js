import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const postInclude = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        title: body.title,
        isIncluded: body.isIncluded || false,
    }
    // Fetching total include items to set order
    try {
        const rentedCar = await rentedCarModel.findOne({ _id: rentedCarId }).select({ includes: 1 });
        if (rentedCar.includes && rentedCar.includes.length > 0) {
            updateFields.order = rentedCar.includes.length + 1;
        } else {
            updateFields.order = 0;
        }
    } catch (error) {
        return Response.json({ error: `Setting up order failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Adding new include item
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId }, { $push: { includes: updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding include item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}