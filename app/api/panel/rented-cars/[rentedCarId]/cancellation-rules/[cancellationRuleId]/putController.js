import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const putCancellationRule = async ({ req, params, session }) => {
    const { cancellationRuleId, rentedCarId } = params
    if (!cancellationRuleId || !rentedCarId) {
        return Response.json({ error: `Rented car id and cancellation rule id are required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        refundablePrice: body.refundablePrice,
        hoursBeforeStartingTime: body.hoursBeforeStartingTime,
        rule: body.rule,
    }
    // Database connection
    connectDB()
    // Updating rented car cancellation rule
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId, 'cancellationRules._id': cancellationRuleId, }, { $set: { 'cancellationRules.$': updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating cancellation rule failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}