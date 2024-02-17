import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const postCancellationRule = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        refundablePrice: body.refundablePrice,
        hoursBeforeStartingTime: body.hoursBeforeStartingTime,
        rule: body.rule,
    }
    // Database connection
    connectDB()
    // Adding new cancellation rule
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId }, { $push: { cancellationRules: updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding cancellation rule failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}