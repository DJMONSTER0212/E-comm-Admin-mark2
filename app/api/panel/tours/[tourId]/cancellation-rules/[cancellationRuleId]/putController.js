import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const putCancellationRule = async ({ req, params, session }) => {
    const { cancellationRuleId, tourId } = params
    if (!cancellationRuleId || !tourId) {
        return Response.json({ error: `Tour id and cancellation rule id are required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        refundablePrice: body.refundablePrice,
        hoursBeforeStartingTime: body.hoursBeforeStartingTime,
        rule: body.rule,
    }
    // Database connection
    connectDB()
    // Updating tour cancellation rule
    try {
        await tourModel.updateOne({ _id: tourId, 'cancellationRules._id': cancellationRuleId, }, { $set: { 'cancellationRules.$': updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating cancellation rule failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}