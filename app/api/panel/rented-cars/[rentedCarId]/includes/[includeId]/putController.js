import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const putInclude = async ({ req, params, session }) => {
    const { includeId, rentedCarId } = params
    if (!includeId || !rentedCarId) {
        return Response.json({ error: `Rented car id and include id are required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        title: body.title,
        isIncluded: body.isIncluded || false,
        order: body.order
    }
    // Database connection
    connectDB()
    // Updating rented car include item
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId, 'includes._id': includeId, }, { $set: { 'includes.$': updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating include item failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}